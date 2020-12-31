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
      setRecord(data.record);
      //console.log(data);
    } catch (e) {
      setError(e.response.data.message);
      console.log(e);
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
  console.log(record);
  console.log(record.total_doc_by_option);

  const renderedOption = record.total_doc_by_option
    ? record.total_doc_by_option.map((el) => {
        return (
          <div className="summary-content-text" key={el._id}>
            <p>{el.option[0].toUpperCase() + el.option.substring(1)}</p>
            <p>{el.total_by_option}</p>
          </div>
        );
      })
    : "loading";

  const renderedCategoryValue = record.category_by_vendor
    ? record.category_by_vendor.map((el) => {
        return <CategoryValue key={el._id} el={el} />;
      })
    : "loading";

  return (
    <div className="summary-container">
      <div className="back">
        <Link to="/reports">← Back</Link>
      </div>
      <div className="summary-title">
        <h2>{record.title && record.title}</h2>
      </div>
      <div className="summary">
        <div className="summary-header">
          <h4>All Branch Values</h4>
          <h4>Amount($)</h4>
        </div>
        <div className="summary-content">{renderedOption}</div>
      </div>

      <div className="summary">
        <div className="summary-header">
          <h4>Category</h4>
          <h4>Amount($)</h4>
        </div>
        <div className="summary-content">{renderedCategoryValue}</div>
      </div>

      {/*<div className="summary">
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
      </div>*/}
      {/*<Category />*/}
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

const CategoryValue = ({ el }) => {
  const [showSummary, setShowSummary] = useState(false);

  const changeSummary = (e) => {
    setShowSummary(!showSummary);
  };

  return (
    <div onClick={changeSummary} className="summary-category-value">
      <div className="summary-content-text">
        <p>{el.category[0].toUpperCase() + el.category.substring(1)}</p>
        <p>{el.total}</p>
      </div>
      <div className="sub-summary">
        {showSummary &&
          el.vendor_details.map((el) => {
            return (
              <div className="sub-summary-content" key={el._id}>
                <p>{el.vendor}</p>
                <p>{el.value}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

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
