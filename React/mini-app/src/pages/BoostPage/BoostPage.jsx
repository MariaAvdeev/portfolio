import { useEffect, useState } from "react";
import _ from "lodash";
import {
  Box,
  FormGroup,
  LinearProgress,
  Typography,
  FormControlLabel,
} from "@mui/material";

import {
  Popup,
  PopupContentBoost,
  PopupContentRequest,
  PopupHeaderBoost,
  PopupHeaderWarning,
} from "@/components/Popup/Popup.jsx";

import "./BoostPage.css";
import Lightning from "../../assets/images/lighting.png";
import Star from "../../assets/images/160-star.png";
import { IOSSwitch } from "@/components/Switch.jsx";

import Nav from "@/components/Nav.jsx";
import { useAuth } from "@/context/AuthContext";

import { progressBarValue } from "../../helpers/data";
import { payment } from "../../helpers/payment";

export const BoostPage = () => {
  const { socket, socketData: socketInit, authToken } = useAuth();

  const [socketData, setSocketData] = useState({
    statistics: null,
    leaderboard: [],
    blockMined: null,
    userData: null,
    blocksFeeds: [],
  });
  const [isPopupBoostOpen, setIsPopupBoostOpen] = useState(false);
  const [isPopupRequestOpen, setIsPopupRequestOpen] = useState(false); // popup request open

  const openRequest = async (event) => {
    event.preventDefault();
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
      socket.on("statistics_update", (data) => {
        console.log("statistics_update", data);
        setSocketData((prev) => ({ ...prev, statistics: data?.statistics }));
      });

      socket.on("data_update", (data) => {
        console.log("data_update", data);
        setSocketData((prev) => ({ ...prev, userData: data.userData }));
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, socketInit]);

  return (
    <div className={`container-main-boost ${isPopupBoostOpen || isPopupRequestOpen ? "dimmed" : ""}`}>
      <div className="title">
        <div className="title-boost">BOOST</div>
        <div className="container-title-complete">
          <div className="title-your">YOUR</div>
          <div className="title-mining">MINING</div>
        </div>
        <div className="container-result">
          <div className="title-result">RESULT</div>
          <img className="image-lightning" src={Lightning} />
        </div>
      </div>
      <div className="container-energy">
        <div className="content-wrapper">
          <div className="max-energy-nr">
            max energy {_.get(socketData, "userData.maxEnergy")}
          </div>
          <Box
            sx={{
              display: "flex",
              marginTop: "8px",
              marginRight: "-75px",
              alignItems: "center",
              width: "90%",
            }}
          >
            <Box
              sx={{ width: "100%", marginTop: "13px", mr: 1, color: "#2C5DFF" }}
            >
              <LinearProgress
                variant="determinate"
                value={progressBarValue(
                  _.get(socketData, "userData.currentEnergy"),
                  _.get(socketData, "userData.maxEnergy")
                )}
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  marginTop: "17px",
                  color: "white",
                  fontSize: "11px",
                  fontFamily: "Gilroy-Regular",
                  fontWeight: "500",
                }}
              >
                {_.get(socketData, "userData.currentEnergy")}
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
      <div className="info-increase">
        you can restore energy by completing tasks <br />
        or increase your maximum energy level
      </div>
      <div className="container-button-increase">
        <button className="button-increase" onClick={openRequest}>
          INCREASE MAX ENERGY
          <img src={Star} className="star" alt="Star Icon" />
        </button>
      </div>
      <div className="container-turbo-mode">
        <div className="container-turbo-mode-text">
          <div className="turbo-mod">Turbo mode</div>
          <div className="turbo-mode-descr">
            you can restore energy by completing tasks
            <br /> or increase your maximum energy level
          </div>
        </div>
        <FormGroup className="turbo-mode-button">
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 0 }}
                checked={_.get(socketData, "userData.turboMode")}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPopupBoostOpen(true);
                }}
                inputProps={{
                  "aria-label": "iOS style switch for turbo mode",
                }}
              />
            }
            label=""
          />
        </FormGroup>
      </div>
      <div className="container-supesonic-mode">
        <div className="container-supersonic-mode-text">
          <div className="supersonic-mod">Supersonic mode</div>
          <div className="supersonic-mode-descr">
            you can restore energy by completing tasks
            <br /> or increase your maximum energy level
          </div>
        </div>
        <FormGroup className="supersonic-mode-button">
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 0 }}
                // TODO: implement supesonic mode
                checked={_.get(socketData, "userData.turboMode")}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPopupRequestOpen(true);
                }}
                inputProps={{
                  "aria-label": "iOS style switch for turbo mode",
                }}
              />
            }
            label=""
          />
        </FormGroup>
      </div>
      <Popup
        open={isPopupBoostOpen}
        setOpen={setIsPopupBoostOpen}
        PopupContent={PopupContentBoost}
        Header={PopupHeaderBoost}
        data={{}}
      />

      <Popup
        open={isPopupRequestOpen}
        setOpen={setIsPopupRequestOpen}
        PopupContent={PopupContentRequest}
        Header={PopupHeaderWarning}
        data={{}}
      />
      <div className="nav-boost">
        <Nav active={"boost"} />
      </div>
    </div>
  );
};
