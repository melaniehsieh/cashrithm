import React, { useState } from "react";
import "./styles.css";

const RevenueReport = ({ revenue }) => {
  return (
    <>
      {
        revenue.revenue.map((el) => {
          return <p>
        Revenue <span className="revenue-figure">${el.totalRevenue}</span>
      </p>
        })
      }
          {/*<p>
            Expense <span className="expense-figure">expense</span>
          </p>*/}
    </>
  );
};

export default RevenueReport;
