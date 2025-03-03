import { createContext, useContext, useEffect, useState } from "react";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const initializeSocket = (authToken, setSocket, setSocketData) => {
  const socketInstance = io(`${import.meta.env.VITE_API_URL}/`, {
    withCredentials: true,
    transports: ["websocket"],
    auth: { token: authToken },
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected with token:", authToken);
  });

  socketInstance.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  // Save socket event data
  socketInstance.on("statistics_update", (data) => {
    // console.log("statistics_update", data);
    setSocketData((prev) => ({ ...prev, statistics: data.statistics }));
  });

  socketInstance.on("leaderboard_update", (data) => {
    // console.log("leaderboard_update", data);
    setSocketData((prev) => ({ ...prev, leaderboard: data.leaderboard }));
  });

  socketInstance.on("data_update", (data) => {
    // console.log("data_update", data);
    setSocketData((prev) => ({ ...prev, userData: data.userData }));
  });

  socketInstance.on("block_mined", (data) => {
    // console.log("block_mined", data);
    setSocketData((prev) => ({ ...prev, blockMined: data.blockMined }));
  });

  socketInstance.on("blocks_feed", (data) => {
    const blocks =
      data?.blocks && data?.blocks?.length
        ? data.blocks.sort(
            (a, b) => new Date(a.createdAt) + new Date(b.createdAt)
          )
        : [];
    // console.log("blocks_feed", blocks);
    setSocketData((prev) => ({ ...prev, blocksFeeds: blocks }));
  });

  setSocket(socketInstance);
  return socketInstance;
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketData, setSocketData] = useState({
    statistics: null,
    leaderboard: [],
    userData: null,
    blockMined: null,
    blocksFeeds: [],
  });

  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  useEffect(() => {
    let socketInstance;

    const fetchAuthToken = async (data, referralCode) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, referralCode }),
          }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const { token } = await response.json();

        if (token) {
          setAuthToken(token);
          socketInstance = initializeSocket(token, setSocket, setSocketData);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    };

    fetchAuthToken(initDataRaw, initDataState.startParam);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket disconnected during cleanup");
      }
    };
  }, [initDataRaw, initDataState]);

  return (
    <AuthContext.Provider value={{ authToken, socket, socketData }}>
      {children}
    </AuthContext.Provider>
  );
};
