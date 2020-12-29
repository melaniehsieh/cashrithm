import React, { useEffect, useState, useContext, createContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FetchContext } from "../../../context/FetchContext";

import "./styles.css";

const Summary = () => {
  console.log(useParams());
  const { id } = useParams();
  const fetchContext = useContext(FetchContext);
  const [record, setRecord] = useState([]);
  //const [category, setCategory] = useState([]);
  const [error, setError] = useState("");
  //const [categoryError, setCategoryError] = useState("");

  const getRecord = async () => {
    try {
      const { data } = await fetchContext.authAxios.get(
        `/entities/user-record/${id}`
      );
      setRecord(data);
      console.log(data);
    } catch (e) {
      setError(e.response.data.message);
      //console.log(e);
    }
  };

  /*const getCategory = async () => {
    try {
      const { data } = await fetchContext.authAxios.get(
        "/entities/user-entities"
      );
      setCategory(data.entities.category);
      //console.log(data);
    } catch (e) {
      setCategoryError(e.response.data.message);
      //console.log(e);
    }
  };*/

  useEffect(() => {
    getRecord();
    //getCategory();
  }, []);

  return (
    <div className="summary-container">
      <div className="back">
        <Link to="/reports">← Back</Link>
      </div>
      <div className="summary-title">
        <h2>Feburary Monthly Summary</h2>
      </div>

      <div className="summary">
        <h4>All Branch Values</h4>
        <h4>Amount($)</h4>
      </div>

      <div className="summary">
        <div className="left">
          <p>Gross Profit</p>
          <p>Operating Expense</p>
          <p>Running Total</p>
          <p>Net Income</p>
        </div>
        <div className="right">
          <p>13,231.69</p>
          <p>- 2,410.02</p>
          <p>10,821.71</p>
          <p>121,187.04</p>
        </div>
      </div>
      <Category />
      {/*<div className="category">
        {category
          ? category.map((el) => {
              return <Category record={record} key={el._id} el={el} />;
            })
          : ""}
      </div>*/}
    </div>
  );
};

const Category = () => {
  return(
    <div>
    category
    </div>
  );
}

/*
const Category = ({ el, record }) => {
  return (
    <div>
      <div>
        <h4>{el.type.toUpperCase()}</h4>
      </div>
      {el.vendors.map((el) => {
        return (
          <div key={el._id}>
            <p>{el}</p>
            {record
              ? record.doc.map((rec) => {
                  if (el === rec.revenueVendor && el === rec.expenseVendor) {
                    return (
                      <p key={rec._id}>
                        <span>${rec.totalRevenue}</span>
                        <br />
                        <span>${rec.totalExpense}</span>
                      </p>
                    );
                  }
                  if (el === rec.revenueVendor || el === rec.expenseVendor) {
                    return el === rec.revenueVendor ? (
                      <p key={rec._id}>
                        <span>${rec.totalRevenue}</span>
                      </p>
                    ) : (
                      <p key={rec._id}>
                        <span>${rec.totalExpense}</span>
                      </p>
                    );
                  }
                })
              : ""}
          </div>
        );
      })}
    </div>
  );
};
*/
export default Summary;
