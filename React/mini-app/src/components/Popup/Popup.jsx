import { Placeholder, Modal } from "@telegram-apps/telegram-ui";
import { useEffect, useState } from "react";
import ButtonArrow from "../../assets/images/Frame 21.svg";
import ButtonWarn from "../../assets/images/Frame 21.png";
import ButtonBoost from "../../assets/images/Frame 21 1.png";
import Star from "../../assets/images/160-star.png";
import { formatDate } from "../../helpers/date";
import "./Popup.css";
import { hashFormat } from "../../helpers/data";
import { payment } from "../../helpers/payment";
import { useAuth } from "@/context/AuthContext";

export const Popup = ({
  Header = null,
  open,
  setOpen,
  PopupContent,
  data = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [popupData, setPopupData] = useState({});

  useEffect(() => {
    setIsModalOpen(open);
    setPopupData(data);
  }, [open]);

  const handleClosePopup = () => {
    setIsModalOpen(false);
    if (setOpen) setOpen(false);
  };

  const onOpenChange = (event) => {
    setIsModalOpen(event);
    if (setOpen) setOpen(event);
  };

  return (
    <Modal
      className="popup"
      header={Header}
      open={isModalOpen}
      dismissible={true}
      style={{ marginBottom: "80px" }}
      onOpenChange={onOpenChange}
    >
      <Placeholder>
        <div className="tab-container">
          <div className="popup" onClick={handleClosePopup}>
            <div className="popup-content">
              {Header && <Header onClose={handleClosePopup} />}
              <div>
                <div className="container-main-popup">
                  {PopupContent && <PopupContent data={popupData} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Placeholder>
    </Modal>
  );
};

export const PopupHeaderArrow = ({ onClose }) => {
  return (
    <img
      className="close-button"
      src={ButtonArrow}
      alt="close btn"
      onClick={onClose}
    />
  );
};

export const PopupHeaderBoost = ({ onClose }) => {
  return (
    <img
      className="close-button"
      src={ButtonBoost}
      alt="close btn"
      onClick={onClose}
    />
  );
};

export const PopupHeaderWarning = ({ onClose }) => {
  return (
    <img
      className="close-button"
      src={ButtonWarn}
      alt="close btn"
      onClick={onClose}
    />
  );
};

export const PopupContentBoost = () => {
  const { authToken } = useAuth();
  const openRequest = async (event) => {
    event.preventDefault();
    try {
      await payment(authToken, "miningAccess");
    } catch (error) {
      console.error("Payment Error", error);
    }
  };

  return (
    <div className="container-main-boost-energy">
      <div className="title-boost-your-energy">
        <div className="text-boost-your">BOOST YOUR</div>
        <div className="text-energy">ENERGY</div>
      </div>
      <div className="text-decription">
        Increase your maximum energy with Telegram Stars,
        <br />
        Attention: Your energy will be fuly restored
      </div>
      <div className="container-6000-max-energy">
        <div className="text-6000">+ 6000</div>
        <div className="text-max-energy">max energy</div>
      </div>
      <div>
        <button className="button-get-now" onClick={openRequest}>
          GET NOW
        </button>
      </div>
      <div>
        <img className="number-star" src={Star} />
      </div>
    </div>
  );
};

export const PopupContentRequest = () => {
  const { authToken } = useAuth();
  const openRequest = async (event) => {
    event.preventDefault();
    try {
      await payment(authToken, "miningAccess");
    } catch (error) {
      console.error("Payment Error", error);
    }
  };

  return (
    <div className="container-main-popup">
      <div className="container-limited-access">
        <div className="limited">LIMITED</div>
        <div className="access">ACCESS</div>
      </div>
      <div className="decription">
        Due to high demand and the fact that the application
        <br /> has not yet been fully released, access to mining
        <br /> is temporarily limited{" "}
      </div>
      <button className="send-request-limited-access" onClick={openRequest}>
        SEND REQUEST
      </button>
      <div className="check-your-access">CHECK YOUR ACCESS</div>
    </div>
  );
};

export const PopupContent = ({ data }) => {
  const { date, time } = formatDate(data?.createdAt);
  return (
    <>
      <div className="container-above">
        <div className="container-date-time">
          <span className="date">{date}</span>
          <span className="time">{time}</span>
        </div>
        <div className="container-number-blocks">
          <span className="number-block">{hashFormat(data?.blockNumber)}</span>
          <span className="id-number">{data.hash}</span>
        </div>
      </div>
      <div className="container-popup-info">
        <div className="container-first-popup">
          <dl className="container-first-popup1">
            <dt className="miner-popup">miner</dt>
            <dd className="name-popup">{data.miner}</dd>
          </dl>
          <dl className="container-first-popup2">
            <dt className="reward-popup">reward</dt>
            <dd className="number-popup">{data.reward}</dd>
          </dl>
          <dl className="container-first-popup3">
            <dt className="total-miners-popup">total miners</dt>
            <dd className="numbers-total-popup">{data.totalMiners}</dd>
          </dl>
        </div>
        <div className="container-second-popup">
          <dl className="container-second-popup1">
            <dt className="share-reward-popup">share reward</dt>
            <dd className="number-share-popup">{data.sharedReward}</dd>
          </dl>
          <dl className="container-second-popup2">
            <dt className="my-reward-popup">my reward</dt>
            <dd className="numbers-my-reward-popup">{data.reward}</dd>
          </dl>
        </div>
      </div>
    </>
  );
};
