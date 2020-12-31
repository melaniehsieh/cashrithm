import React, { useContext, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "./styles.css";
import Report from "./Report";
import Navbar from "../Navbar/Navbar";
//import { AuthContext } from "../../context/AuthContext";
import { FetchContext } from "../../context/FetchContext";
import Popup from "../Popup/Popup";

const ReportList = () => {
  //const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const [entities, setEntities] = useState({});
  const [errorPopup, setErrorPopup] = useState(false);
  const [entitiesError, setEntitiesError] = useState("");

  const fetchEntities = async () => {
    try {
      const { data } = await fetchContext.authAxios.get(
        "/entities/user-entities"
      );
      setEntities(data.entities);
    } catch (e) {
      setErrorPopup(true);
      setEntitiesError(e.response.data.message);
      console.log(e);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  //console.log(entities);
  //console.log(entitiesError);
  return (
    <div>
      {errorPopup && (
        <Popup
          type="error"
          text={entitiesError}
          setErrorPopup={setErrorPopup}
        />
      )}
      <Navbar />
      <div className="report-list">
        <div className="report">
          {entities.transaction
            ? entities.transaction.map((el) => {
                return <Report doc={el} key={el._id} />;
              })
            : "loading..."}
        </div>
        <div className="records-container">
          <Link to="/add">Create New Record</Link>
          <Link to="/category" style={{ margin: "1em 0" }}>
            Create New Category
          </Link>
          <CategoryNav entities={entities} />
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
        : "loading..."}
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
