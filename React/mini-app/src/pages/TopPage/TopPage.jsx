import { useEffect, useState } from "react";
import _ from "lodash";

import { Page } from "@/components/Page.jsx";
import Nav from "@/components/Nav.jsx";
import { useAuth } from "@/context/AuthContext";

import Rocket from "../../assets/images/rocket.png";
import Crown from "../../assets/images/crown_icon.png";
import Portrait from "../../assets/images/Depth 5, Frame 0.svg";
import "./TopPage.css";

export const TopPage = () => {
  const { socket, socketData: socketInit } = useAuth();

  const [socketData, setSocketData] = useState({
    statistics: null,
    leaderboard: [],
    blockMined: null,
    userData: null,
    blocksFeeds: [],
  });

  useEffect(() => {
    setSocketData(socketInit);
    console.log(socketInit, "socketInit");

    if (socket) {
      socket.on("leaderboard_update", (data) => {
        console.log("leaderboard_update", data);
        setSocketData((prev) => ({ ...prev, leaderboard: data?.leaderboard || [] }));
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, socketInit]);

  return (
    <Page>
      <div className="container-main-triumphs">
        <div className="container-title-triumphs">
          <div className="title-track">TRACK</div>
          <div className="title-your-triumphs">YOUR</div>
          <div className="container-triumphs-img">
            <div className="title-triumphs">TRIUMPHS</div>
            <img src={Rocket} className="rocket" />
          </div>
        </div>
        {socketData.leaderboard && socketData.leaderboard.map((item, index) => (
          <div className="container-user-img">
            <div className="container-portrait-crow">
              {index === 0 && <img src={Crown} className="crown" />}
              <img src={Portrait} className="portrait" />
            </div>
            <div className="nick-name-top-page">{item.username}</div>
          </div>
        ))}

        <Nav active={"top"} />
      </div>
    </Page>
  );
};
