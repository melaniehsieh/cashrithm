import React from "react";
import "./styles.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Report = ({ doc }) => {
  return (
    <>
      <div className="record">
        <a href={`/summary/${doc._id}`}>
          <h2>{months[new Date(doc.createdAt).getMonth()]}</h2>
          <p>
            Revenue
            <span className="revenue-figure">$ {doc.allTotalRevenue}</span>
          </p>
          <p>
            Expense
            <span className="expense-figure">$ {doc.allTotalExpense}</span>
          </p>
        </a>
      </div>
    </>
  );
};

export default Report;
