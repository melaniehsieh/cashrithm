import React, { useState } from "react";
import "./styles.css";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const Report = ({ doc }) => {
  
  return (
    <>
      <div className="record">
        <a href={`/summary/${doc._id}`}>
          <h2>{months[new Date(doc.createdAt).getMonth()]}</h2>
          <p>Revenue <span className="revenue-figure">$ {doc.allTotalRevenue}</span></p>
          <p>Expense <span className="expense-figure">$ {doc.allTotalExpense}</span></p>
        </a>
      </div>
      {/*<div className="record">
        <a href="/summary">
          <h2>{months[new Date(revenue.createdAt).getMonth()]}</h2>
         */}
          {/*
            revenue.map((el) => {
              return <div key={el._id}>
                <p>Revenue <span className="revenue-figure">{el.totalRevenue}</span>
                </p>
                <p>Expense <span className="expense-figure">{el.totalExpense}</span>
                </p>
              </div>
            })
          */}
        {/*</a>
      </div>*/}
    </>
  );
};

{/* return<div key={el._id} className="revenue__expense--container">
                <div key={el._id} className="revenue__container">
                  <div>{el.vendor.toUpperCase()}</div>
                  <div className="revenue-figure">${el.totalRevenue}</div>
                </div>
                <div key={expense.expense[i]._id} className="expense__container">
                  <div>{expense.expense[i].vendor.toUpperCase()}</div>
                  <div className="expense-figure">${expense.expense[i].totalExpense}</div>
                </div>
              </div>*/}

export default Report;
