import React from "react";
import "./styles.css";

const Report = ({ doc }) => {
  return (
    <>
      <div className="record">
        <a href={`/summary/${doc._id}`}>
          <h2>{doc.title && doc.title}</h2>
          <p>
            Revenue
            <span className="revenue-figure">$ {doc.all_total_revenue}</span>
          </p>
          <p>
            Expense
            <span className="expense-figure">$ {doc.all_total_expense}</span>
          </p>
        </a>
      </div>
    </>
  );
};

export default Report;
