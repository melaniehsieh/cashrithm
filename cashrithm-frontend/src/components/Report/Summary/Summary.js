import React, { useEffect, useState, useContext, createContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FetchContext } from "../../../context/FetchContext";

import "./styles.css";

const Summary = () => {
  console.log(useParams());
  const { id } = useParams();
  const fetchContext = useContext(FetchContext);
  const [record, setRecord] = useState({});
  const [category, setCategory] = useState([]);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const getRecord = async () => {
    try {
      const { data } = await fetchContext.authAxios.get(
        `/entities/user-record/${id}`
      );
      setRecord(data.record);
      //console.log(data);
    } catch (e) {
      setError(e.response.data.message);
      //console.log(e);
    }
  };

  const getCategory = async () => {
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
  };

  useEffect(() => {
    getRecord();
    getCategory();
  }, []);
  console.log(record);
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
      <div className="summary">
        <h4>Category</h4>
      </div>
      {category
        ? category.map((el) => {
            return <Category record={record} key={el._id} el={el} />;
          })
        : ""}
    </div>
  );
};

const Category = ({ el, record }) => {
  return (
    <div className="summary">
      <div className="left">
        <p>{el.type[0].toUpperCase() + el.type.substring(1)}</p>
      </div>
      {el.vendors.map((el) => {
        return (
          <div className="summay">
            <div className="left">
              <p key={el._id}>{el}</p>
            </div>
            {record
              ? record.doc.map((rec) => {
                  if (el === rec.revenueVendor && el === rec.expenseVendor) {
                    return (
                      <div className="right">
                        <p key={rec._id}>
                          <p>${rec.totalRevenue}</p>
                          <p>${rec.totalExpense}</p>
                        </p>
                      </div>
                    );
                  }
                  if (el === rec.revenueVendor || el === rec.expenseVendor) {
                    return el === rec.revenueVendor ? (
                      <div className="right">
                        <p key={rec._id}>
                          <p>${rec.totalRevenue}</p>
                        </p>
                      </div>
                    ) : (
                      <div className="right">
                        <p key={rec._id}>
                          <p>${rec.totalExpense}</p>
                        </p>
                      </div>
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
/*
const Transaction = ({record}) => {
  console.log("Transaction");
  console.log(record);
  
  return (
    <div>
      {
        record ? record.map((el) => {
          return(
            <div key={el._id}>
              <p>{el.expenseVendor}</p>
              <p>{el.totalExpense}</p>
              <p>{el.revenueVendor}</p>
              <p>{el.totalRevenue}</p>
            </div>
          );
        }) : ""
      }
    </div>
  );
}*/

export default Summary;
