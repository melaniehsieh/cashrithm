import React from "react";
import "./styles.css";

/*const months = [
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
months[new Date(doc.createdAt).getMonth()]*/

const Report = ({ doc }) => {
  return (
    <>
      <div className="record">
        <a href={`/summary/${doc._id}`}>
          <h2>{doc.title && doc.title}</h2>
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
