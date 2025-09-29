import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../styles/landingPage.css";
import { ReactTyped } from "react-typed";
// import navbar from "./navbar.jsx";

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
        <div className="landingPageTextContainer">
          <h1 className="text-5xl font-bold text-white">
            <ReactTyped
              strings={[
                 "<span style='color:#FF9839'>Connect</span> With Your<br/>Loved One"
              ]}
              typeSpeed={50}
              backSpeed={30}
              smartBackspace
              loop={false}
            />
          </h1>

          <p>Cover a distance by Quick Meet</p>
          <div>
            <Link to={"/auth"}>
              <button className="btn">Get Started</button>
            </Link>
          </div>
        </div>
        <div className="landingPageImageContainer">
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}


