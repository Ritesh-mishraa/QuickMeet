import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../styles/landingPage.css";

export default function landing() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>QUICKMEET</h2>
        </div>
        <div className="navList" style={{ textDecoration: "none" }}>
          <Link to="/auth">
            <button>Register</button>
          </Link>
        </div>
      </nav>
      <div className="landingPageMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> With Your Loved
            One
          </h1>
          <p>Cover a distance by Quick Meet</p>
          <div>
            <Link to={"/auth"}>
              <button className="btn">Get Started</button>
            </Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}
