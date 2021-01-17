import React from "react";
import "./styles.css";
import summary from "./summary.png";
import csv from "./csv.png";

const Page2 = () => {
  return (
    <div className="page2">
      <div className="text">
        <h2>
          CSV to Income <br /> Statement
        </h2>
        <h5>
          With a click of a button, turn your CSV data into an income statement.
        </h5>
      </div>
      <div className="screenshots">
        <img src={csv} alt="csv" />
        <img src={summary} alt="summary" />
      </div>
    </div>
  );
};

export default Page2;
