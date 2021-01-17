import React from "react";
import Page2 from "./Page2";
import "./styles.css";
import summary from "./summary.png";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
      <div className="container">
        <img src={summary} alt="title image" />
        <div className="title_text">
          <h1>
            discover the <br /> experience
          </h1>
          <h4>
            a platform dedicated to startups <br /> provide in-depth
            personalized summary
          </h4>
          <Link to="/signup">
            <button>Get Started</button>
          </Link>
        </div>
      </div>
      <Page2 />
    </div>
  );
};

export default Landing;
