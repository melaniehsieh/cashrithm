import React, { useContext, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "./styles.css";
import Report from "./Report";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Navbar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { FetchContext } from "../../context/FetchContext";

const ReportList = () => {
  const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const [entities, setEntities] = useState({});
  const [entitiesError, setEntitiesError] = useState("");
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);

  const fetchEntities = async () => {
    try {
      const { data } = await fetchContext.authAxios.get(
        "/entities/user-entities"
      );
      setEntities(data.entities);
    } catch (e) {
      setEntitiesError(e.response.data.message);
      console.log(e);
      setRedirectOnSuccess(true);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  console.log(entities);
  console.log(entitiesError);
  return (
    <div className="main__dashboard">
      {redirectOnSuccess && <Redirect to="/login" />}
      <Navbar />
      <div className="report__list--container">
        <Sidebar />
        <div className="report-list">
          <div className="report">
            {entities.transaction
              ? entities.transaction.map((el) => {
                  return <Report doc={el} key={el._id} />;
                })
              : ""}
          </div>
          <div className="records-container">
            <Link to="/add">Create New Record</Link>
            <Link to="/category">Create New Category </Link>
            <CategoryNav entities={entities} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryNav = ({ entities }) => {
  return (
    <div className="category-container">
      <h3 className="big__header">Category</h3>
      {entities.category
        ? entities.category.map((el) => {
            return <SubCategoryNav key={el._id} category={el} />;
          })
        : ""}
    </div>
  );
};

const SubCategoryNav = ({ category }) => {
  return (
    <>
      <h5 className="sub__big__header">
        {category.type[0].toUpperCase() + category.type.substring(1)}
      </h5>
      {category.vendors.map((el, i) => {
        return (
          <p key={i} className="category__vendor">
            {el}
          </p>
        );
      })}
    </>
  );
};

export default ReportList;
