import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { initData } from "@telegram-apps/sdk-react";

export const STATUSES = {
  waiting: "WAITING",
  low: "LOW ENERGY",
  mining: "MINING",
};

export const MinerContext = createContext();

export const MinerProvider = ({ children }) => {
  const workersRef = useRef([]);

  const { socket, socketData: initialSocketData } = useAuth();
  const [status, setDebouncedStatus] = useDebouncedStatus(STATUSES.waiting);
  const statusRef = useRef(status);
  const [difficulty, setDifficulty] = useState(() => {
    const decimalValue = 1; // Your decimal difficulty value
    // Convert to hex string with 64 characters (32 bytes) with leading zeros
    return '0x' + decimalValue.toString(16).padStart(64, '0');
  });

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const miner = (WORKER_NUM, submitCallback) => {
    workersRef.current.forEach((worker) => worker.terminate());
    workersRef.current = [];

    for (let i = 0; i < WORKER_NUM; i++) {
      const worker = new window.Worker(new URL("worker.js", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (event) => {
        const message = event.data;
        switch (message.type) {
          case "BEST_HASH":
            console.log(`Worker found best hash:`, message.bestHash);
            console.log(`Hash rate: ${message.hashRate}`);
            break;
          case "SUBMIT_BLOCK":
            submitCallback(message.hash, message.nonce);
            break;
        }
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
      };

      worker.postMessage({
        type: "START_MINING",
        startNonce: i * 1000000,
        range: 1000000,
        iterations: 100,
        data: {
          difficulty,
          telegramUserId: initData.telegramUserId || "123",
          blockNumber: initialSocketData?.blocksFeeds[0]?.blockNumber,
          prevBlockHash: initialSocketData?.blocksFeeds[0]?.hash,
        },
      });

      workersRef.current.push(worker);
    }

    return workersRef.current;
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("block_mined", (data) => {
      console.log("update difficulty", data.targetDifficulty);
      setDifficulty(data.targetDifficulty);
    });

    if (status === STATUSES.waiting) {
      console.log("🛑 Mining... stopped", status);
      return;
    }
    console.log("⏳ Mining... starting");

    const { userData, blocksFeeds } = initialSocketData;
    if (!userData || userData.currentEnergy === 0) {
      console.log("⚠️ Not enough energy. Skipping.");
      setDebouncedStatus(STATUSES.low);
      return prev;
    }

    const latestBlock = blocksFeeds[0];

    miner(1, (hash, nonce) => {
      socket.emit(
        "block_submit",
        {
          hash,
          prevBlockHash: latestBlock.hash,
          nonce,
          blockNumber: latestBlock.blockNumber,
          telegramUserId: initData.telegramUserId,
        },
        (result) => {
          console.log("✅ block_submit_result", result);
        }
      );
    });
    return () => {
      workersRef.current.forEach((worker) => worker.terminate());
      workersRef.current = [];
    };
  }, [socket, initialSocketData, status, difficulty]);

  return (
    <MinerContext.Provider value={{ status, setDebouncedStatus, difficulty }}>
      {children}
    </MinerContext.Provider>
  );
};

export const useDebouncedStatus = (initialStatus, delay = 10000) => {
  const [status, setStatus] = useState(initialStatus);
  const lastChangeTime = useRef(Date.now());
  const timerRef = useRef(null);

  const updateStatus = (newStatus) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastChangeTime.current;

    if (timeSinceLastUpdate >= delay) {
      setStatus(newStatus);
      lastChangeTime.current = now;
    } else {
      // If within debounce time, delay the update
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStatus(newStatus);
        lastChangeTime.current = Date.now();
      }, delay - timeSinceLastUpdate);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return [status, updateStatus];
};

export const useMiner = () => {
  return useContext(MinerContext);
};
