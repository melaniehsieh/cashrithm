import React, {useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import RevenueReport from "./Report";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Navbar/Sidebar";
import {AuthContext} from "../../context/AuthContext";
import {FetchContext} from "../../context/FetchContext";


const ReportList = () => {
  const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const [entities, setEntities] = useState();
  const [entitiesError, setEntitiesError] = useState("");
  
  const fetchEntities = async () => {
    try {
      const {data} = await fetchContext.authAxios.get("/entities/user-entities");
      setEntities(data.entities)
    } catch (e) {
      setEntitiesError(e.response.data.message);
    };
  };
  
  useEffect(() => {
    fetchEntities();
  }, []);
  
  
  console.log(entities);
  console.log(entitiesError);
  return (
    <div className="main__dashboard">
      <Navbar />
      <div className="report__list--container">
        <Sidebar />
        <div className="report-list">
          <div className="report">
            <div className="record">
              <a href="/summary">
                <h2>month</h2>
                {
                  entities ? entities.transactionRevenue.map((el) => {
                      return <RevenueReport revenue={el} />
              }) : ""
            }
              </a>
            </div>
          </div>
          <div className="records-container">
            <div>
              <Link to="/add">Create New Record</Link>
            </div>
            <div className="category__part">
              <Link to="/category">Create New Category </Link>
            </div>
            <CategoryNav />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryNav = () => {
  return (
    <div className="category__part">
      <h3 className="big__header">Category</h3>
      <SubCategoryNav />
      <SubCategoryNav />
      <SubCategoryNav />
    </div>
  );
}

const SubCategoryNav = () => {
  return(
    <>
      <h5 className="sub__big__header">Food</h5>
      <p className="category__vendor">You know</p>
      <p className="category__vendor">second time</p>
    </>
  );
}
export default ReportList;
