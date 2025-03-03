import { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { formatDistance, differenceInSeconds } from "date-fns";
import _ from "lodash";
import clsx from "classnames";
import Image from "@/assets/images/Ellipse 71.svg";
import Image1 from "@/assets/images/Group 1.svg";
import imgBattery from "@/assets/images/Rectangle 130.svg";
import imgBattery1 from "@/assets/images/Rectangle 131.svg";
import Rectangle132 from "@/assets/images/Rectangle 132.svg";
import Arrow from "@/assets/images/Group 2.svg";

import { CircularDeterminate } from "@/components/CircularDeterminate.jsx";
import Nav from "@/components/Nav.jsx";
import { useAuth } from "@/context/AuthContext";
import { useMiner, STATUSES } from "@/context/MinerContext";
import "./IndexPage.css";
import { truncateString, hashFormat, progressBarValue } from "@/helpers/data";
import { payment } from "@/helpers/payment";
import {
  Popup,
  PopupContent,
  PopupContentRequest,
  PopupHeaderArrow,
  PopupHeaderWarning,
} from "@/components/Popup/Popup.jsx";

export const IndexPage = () => {
  const { socket, socketData: socketInit, authToken } = useAuth();
  const { status, setDebouncedStatus, difficulty } = useMiner();

  const [socketData, setSocketData] = useState({
    statistics: null,
    leaderboard: [],
    blockMined: null,
    userData: null,
    blocksFeeds: [],
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false); // popup block open
  const [isPopupRequestOpen, setIsPopupRequestOpen] = useState(false); // popup request open
  const [blockItem, setBlockItem] = useState(false);

  const [minerStatus, setMinerStatus] = useState(status);

  const openBlock = (event) => {
    event.preventDefault();
    setIsPopupOpen(true);

    const indexBlock = event.target
      .closest("div")
      .closest(".container-item")
      .getAttribute("data-key");

    setBlockItem(socketData.blocksFeeds[indexBlock]);
  };

  const toggleMining = async (event) => {
    event.preventDefault();
    if (socketData.userData.miningAccess) {
      const currentStatus = minerStatus === STATUSES.mining ? STATUSES.waiting : STATUSES.mining;

      setMinerStatus(currentStatus);
      setDebouncedStatus(currentStatus);

      return;
    }

    try {
      await payment(authToken, "miningAccess");
    } catch (error) {
      console.error("Payment Error", error);
    }
  };

  useEffect(() => {
    setSocketData(socketInit);
    console.log(socketInit, "socketInit");

    if (socket) {
      socket.on("data_update", (data) => {
        console.log("data_update", data, socketData.blocksFeeds);
        setSocketData((prev) => ({ ...prev, userData: data.userData }));
      });

      socket.on("block_mined", (data) => {
        console.log("block_mined", data);
        setSocketData((prev) => ({ 
          ...prev, 
          blockMined: data.block, 
          blocksFeeds: [data.block, ...prev.blocksFeeds]
        }));
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
        socket.off("data_update");
        socket.off("block_mined");
        socket.off("blocks_feed");
      };
    }
  }, [socket, socketInit]);

  const [miningStatus, setMiningStatus] = useState("");

  const getMiningStatus = useMemo(() => {
    return minerStatus === STATUSES.waiting
      ? _.get(socketData, "userData.miningAccess") 
        ? "START MINER" 
        : "SEND REQUEST"
      : "STOP MINING";
  }, [minerStatus, socketData]);

  useEffect(() => {
    setMiningStatus(getMiningStatus);
  }, [getMiningStatus]);

  return (
    <>
      <div className={`main-container ${isPopupOpen || isPopupRequestOpen ? "dimmed" : ""}`}>
        <div className="title">MINING</div>
        <div className="secondary">
          <div className="profile-container">
            <div className="profile">Profile</div>
            <div className="max-energy">max energy</div>
            <div className="number">
              {_.get(socketData, "userData.maxEnergy")}
            </div>
          </div>
          <div className="image-container">
            <img src={Image} alt="Profile" className="image" />
            <img src={Image1} className="image1" />
            <div className="count">{_.get(socketData, "userData.coins")}</div>
          </div>
          <div className="progress-bar-container">
            <CircularDeterminate
              value={progressBarValue(
                _.get(socketData, "userData.currentEnergy"),
                _.get(socketData, "userData.maxEnergy")
              )}
              className="circ-prog-bar"
            />
            <img src={imgBattery} className="imgBattery" />
            <img src={imgBattery1} className="imgBattery1" />
            <img src={Rectangle132} className="rectangle132" />
            <div className="count1">
              {_.get(socketData, "userData.currentEnergy")}
            </div>
            <div className="count2">
              {_.get(socketData, "userData.maxEnergy")}
            </div>
          </div>
        </div>
        <div className="information-container">
          <div className="information">Information</div>
          <div className="block-of-info">
            <div className="block-1">
              <dl className="container-1">
                <dt className="block">block</dt>
                <dd className="info-block">
                  {hashFormat(_.get(socketData, "blocksFeeds[0].blockNumber"))}
                </dd>
              </dl>
              <dl className="container-2">
                <dt className="reward">reward</dt>
                <dd className="info-reward">
                  {_.get(socketData, "blocksFeeds[0].minerReward")}
                </dd>
              </dl>
              <dl className="container-3">
                <dt className="online">online</dt>
                <dd className="info-online">
                  {_.get(socketData, "blocksFeeds[0].totalMiners")}
                </dd>
              </dl>
            </div>
            <div className="block-2">
              <dl className="container-21">
                <dt className="difficulty">difficulty</dt>
                <dd className="info-difficulty">
                  {BigInt(difficulty).toString()}
                </dd>
              </dl>
              <dl className="container-22">
                <dt className="hashes">hashes</dt>
                <dd className="info-hashes">
                  {truncateString(_.get(socketData, "blocksFeeds[0].hash"), 6)}
                </dd>
              </dl>
              <dl className="container-23">
                <dt className="earning">earning</dt>
                <dd className="info-earning">
                  {_.get(socketData, "blocksFeeds[0].reward")}
                </dd>
              </dl>
            </div>
            <div className="block-3">
              <div className="status">STATUS</div>
              <button className="pending">{status}</button>
            </div>
          </div>
        </div>
        <div className="container-send-request">
          <button
            className={clsx("send-request", {
              active: minerStatus !== STATUSES.waiting,
            })}
            onClick={toggleMining}
          >
            {miningStatus}
          </button>
        </div>
        <div className="latest-blacks">latest blacks</div>
        <div className="overlap-container">
          <Box
            className="container-blocks"
            sx={{
              width: "100%",
              height: "250px",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "10px",
              border: "none",
            }}
          >
            {socketData.blocksFeeds.map((block, index) => (
              <Box
                className={clsx("container-item", {
                  active:
                    differenceInSeconds(new Date(), block?.createdAt) < 60,
                })}
                key={index}
                onClick={openBlock}
                data-key={index}
              >
                <div className="container-item-line1">
                  <div className="info-block">#{block?.blockNumber}</div>
                  <button className="blacks-batton">
                    +{block?.minerReward}
                  </button>
                </div>
                <div className="container-item-line2">
                  <img src={Arrow} className="arrow" />
                  <div className="personal-info">
                    <div className="created-at">
                      created at{" "}
                      {formatDistance(block?.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                    <div className="nick-name">{block?.minerUserName}</div>
                  </div>
                </div>
              </Box>
            ))}
          </Box>
          <Nav active={"coin"} />
        </div>

        <Popup
          open={isPopupOpen}
          setOpen={setIsPopupOpen}
          PopupContent={PopupContent}
          Header={PopupHeaderArrow}
          data={blockItem}
        />
        <Popup
          open={isPopupRequestOpen}
          setOpen={setIsPopupRequestOpen}
          PopupContent={PopupContentRequest}
          Header={PopupHeaderWarning}
          data={{}}
        />
      </div>
    </>
  );
};
