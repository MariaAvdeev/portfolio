import { useEffect, useState } from "react";
import _ from "lodash";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./EarnPage.css";
import { Page } from "@/components/Page.jsx";
import Nav from "@/components/Nav.jsx";
import { useAuth } from "@/context/AuthContext";

import Currency from "../../assets/images/Group.svg";
import Reward from "../../assets/images/reward _ + 789 ⭐️.png";
import Icon1 from "../../assets/images/Frame 2147225438.png";
import Icon2 from "../../assets/images/Frame 2147225438 1.png";
import Icon3 from "../../assets/images/Column.png";
import Icon4 from "../../assets/images/Column 1.png";
import Icon5 from "../../assets/images/Column 2.png";

export const EarnPage = () => {
  const { socket, socketData: socketInit } = useAuth();
  
  const [socketData, setSocketData] = useState({
    statistics: null,
    leaderboard: [],
    blockMined: null,
    userData: null,
    blocksFeeds: [],
  });

  const [value, setValue] = useState(1);
  const [activeButton, setActiveButton] = useState("limited");
  const [isLimitedClicked, setIsLimitedClicked] = useState({});

  const handleClickLimited = () => {
    setIsLimitedClicked(!isLimitedClicked);
    setActiveButton("limited");
  }

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  useEffect(() => {
    setSocketData(socketInit);
    console.log(socketInit, "socketInit");

    if (socket) {
      socket.on("statistics_update", (data) => {
        console.log("statistics_update", data);
        setSocketData((prev) => ({ ...prev, statistics: data }));
      });

      socket.on("leaderboard_update", (data) => {
        console.log("leaderboard_update", data);
        setSocketData((prev) => ({ ...prev, leaderboard: data || [] }));
      });

      socket.on("data_update", (data) => {
        console.log("data_update", data);
        setSocketData((prev) => ({ ...prev, dataUpdate: data.dataUpdate }));
      });

      socket.on("block_mined", (data) => {
        console.log("block_mined", data);
        setSocketData((prev) => ({ ...prev, blockMined: data.blockMined }));
      });

      socket.on("blocks_feed", (data) => {
        const blocks =
          data?.blocks && data?.blocks?.length
            ? data.blocks.sort(
                (a, b) => new Date(a.createdAt) + new Date(b.createdAt)
              )
            : [];
        console.log("blocks_feed", blocks);
        setSocketData((prev) => ({ ...prev, blocksFeeds: blocks }));
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, socketInit]);

  return (
    <Page>
      <div className="container-main-complete">
        <div className="container-title">
          <div className="title-complete">COMPLETE</div>
          <div className="container-tasks-earn">
            <div className="tasks">TASKS,</div>
            <div className="earn"> EARN</div>
          </div>
          <div className="container-coin">
            <div className="coins">
              C<img src={Currency} className="image-currency" />
              INS
            </div>
          </div>
        </div>
        <div className="container-main-users">
          <Tabs
            value={value}
            onChange={handleChange}
            className="container-button-tab"
          >
            <Tab 
            className= {`limited-button ${activeButton === "limited" ? "active" : ""}`} 
            onClick={handleClickLimited}
            label="LIMITED"  />
            <Tab 
            className={`in-game ${activeButton === "in-game" ? "active" : ""} ${isLimitedClicked ? "changed-style" : ""}`}
            onClick={() => setActiveButton("in-game")}
            label="IN-GAME" />
            <Tab 
            className={`partners ${activeButton === "partners" ? "active" : ""} ${isLimitedClicked ? "changed-style" : ""}`}
            onClick={() => setActiveButton("partners")}
            label="PARTNERS" />
          </Tabs>
          <div className="container-user-main">
            <div className="continer-user-button1">
              <div className="container-user">
                <img src={Icon1} className="icon-user" />
                <div className="container-info-user">
                  <div className="add-mine-emojii">Add MINE EMOJII</div>
                  <div className="reward">
                    <img src={Reward} />
                  </div>
                </div>
              </div>
              <button className="button-claim-start">CLAIM</button>
            </div>
            <div className="continer-user-button1">
              <div className="container-user">
                <img src={Icon2} className="icon-user" />
                <div className="container-info-user">
                  <div className="add-mine-emojii">Study MINE</div>
                  <div className="reward">
                    <img src={Reward} />
                  </div>
                </div>
              </div>
              <button className="button-claim-start">CLAIM</button>
            </div>
            <div className="continer-user-button1">
              <div className="container-user">
                <img src={Icon3} className="icon-user" />
                <div className="container-info-user">
                  <div className="add-mine-emojii">Join MINE Cult X</div>
                  <div className="reward">
                    <img src={Reward} />
                  </div>
                </div>
              </div>
              <button className="button-claim-start">CLAIM</button>
            </div>
            <div className="continer-user-button1">
              <div className="container-user">
                <img src={Icon4} className="icon-user" />
                <div className="container-info-user">
                  <div className="add-mine-emojii">Join MINE Cult X</div>
                  <div className="reward">
                    <img src={Reward} />
                  </div>
                </div>
              </div>
              <button className="button-claim-start">CLAIM</button>
            </div>
            <div className="continer-user-button1">
              <div className="container-user">
                <img src={Icon5} className="icon-user" />
                <div className="container-info-user">
                  <div className="add-mine-emojii">Put in your name</div>
                  <div className="reward">
                    <img src={Reward} />
                  </div>
                </div>
              </div>
              <button className="button-claim-start">CLAIM</button>
            </div>
            <div className="continer-user-button1">
              <div className="container-user">
                <img src={Icon2} className="icon-user" />
                <div className="container-info-user">
                  <div className="add-mine-emojii">Study MINE</div>
                  <div className="reward">
                    <img src={Reward} />
                  </div>
                </div>
              </div>
              <button className="button-claim-start">CLAIM</button>
            </div>
          </div>
        </div>
        <Nav active={"earn"} />
      </div>
    </Page>
  );
};
