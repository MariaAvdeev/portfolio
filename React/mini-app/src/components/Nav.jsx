import React, { useState, useEffect } from "react";
import { FixedLayout } from "@telegram-apps/telegram-ui";
import { Link } from "@/components/Link/Link.jsx";

import Circle from "../assets/images/Group.svg";

export default function Nav({ active = "coin" }) {
  const [activeTab, setActiveTab] = useState(active);

  useEffect(() => {
    setActiveTab(activeTab);
  }, [activeTab]);

  const tabMap = {
    boost: "style-boost",
    top: "style-top",
    coin: "style-coin",
    earn: "style-earn",
    info: "style-info",
  };

  const activeTabClass = tabMap[activeTab] || "";

  return (
    <FixedLayout style={{ zIndex: 999 }}>
      <div className={`tab-container`}>
        <div className={`tab-section ${activeTabClass}`}>
          <div className="tab">
            <Link to="/boost">
              <button>BOOST</button>
            </Link>
            <Link to="/top">
              <button>TOP</button>
            </Link>
            <Link to="/">
              <button className="image-button">
                <div className="circle-around">
                  <div className="border-animation"></div>
                  <img src={Circle} alt="Button Image" />
                </div>
              </button>
            </Link>
            <Link to="/earn">
              <button>EARN</button>
            </Link>
            <Link to="/info">
              <button>INFO</button>
            </Link>
          </div>
          <div className="container-batton-bar">
            <div className="batton-bar"></div>
          </div>
        </div>
      </div>
    </FixedLayout>
  );
}
