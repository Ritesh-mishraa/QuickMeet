import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../styles/landingPage.css";
import { ReactTyped } from "react-typed";

export default function Landing() {
  return (
    <div className="landingPageContainer">
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <nav className="landingNav">
        <div className="navHeader">
          <h2>QuickMeet</h2>
        </div>
        <div className="navActions">
          <Link to="/auth">
            <button className="navBtn">Join Now</button>
          </Link>
        </div>
      </nav>

      <div className="landingPageMainContainer">
        <div className="landingPageTextContainer">
          <h1 className="landingTitle">
            <span className="staticText">Connect with your</span>
            <br />
            <ReactTyped
              strings={[
                "<span class='highlight-text'>Loved Ones.</span>",
                "<span class='highlight-text'>Team.</span>",
                "<span class='highlight-text'>World.</span>",
              ]}
              typeSpeed={60}
              backSpeed={40}
              backDelay={1500}
              smartBackspace
              loop
            />
          </h1>

          <p className="landingSubtitle">
            Experience crystal clear video calls with low latency. Distance is
            just a word when the connection is this good.
          </p>

          <div className="buttonGroup">
            <Link to={"/auth"}>
              <button className="ctaBtn">Get Started</button>
            </Link>
            <div className="users-preview">
              <span>🟢 10k+ Active Users</span>
            </div>
          </div>
        </div>

        <div className="landingPageImageContainer">
          <div className="image-glass-card">
            <img
              src="/mobile.jpg"
              alt="QuickMeet Mobile App"
              className="floating-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
