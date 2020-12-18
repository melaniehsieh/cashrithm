import React from "react";
import "./styles.css";

<<<<<<< HEAD
/*const months = [
=======
const months = [
>>>>>>> 018f58f26fd18939020b794442e2b54d821aa632
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
<<<<<<< HEAD
months[new Date(doc.createdAt).getMonth()]*/
=======
>>>>>>> 018f58f26fd18939020b794442e2b54d821aa632

const Report = ({ doc }) => {
  return (
    <>
      <div className="record">
        <a href={`/summary/${doc._id}`}>
<<<<<<< HEAD
          <h2>{doc.title && doc.title}</h2>
=======
          <h2>{months[new Date(doc.createdAt).getMonth()]}</h2>
>>>>>>> 018f58f26fd18939020b794442e2b54d821aa632
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
