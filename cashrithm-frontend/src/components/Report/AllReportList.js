import React, {useContext} from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Report from "./Report";
import Navbar from "../Navbar/Navbar";
import {AuthContext} from "../../context/AuthContext";


const AllReportList = () => {
  const authContext = useContext(AuthContext);
  
  return (
    <div className="main__dashboard">
      <div className="report-list">
        <div className="report">
          <Report
            month="Feb"
            revenue="300.00"
            expense="-30.00"
            url="/summary"
          />
          <Report
            month="Mar"
            revenue="400.00"
            expense="-40.00"
            url="/summary"
          />
          <Report
            month="May"
            revenue="250.00"
            expense="-25.00"
            url="/summary"
          />
        </div>
        <div className="spacer"></div>
        <div className="records-container">
          <Link to="/add">Create New Record</Link>
          <Link to="/category">Create New Category </Link>
        </div>
      </div>
    </div>
  );
};

export default AllReportList;
