import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Summary = () => {
  return (
    <div className="summary-container">
      <div className="back">
        <Link to="/reports">← Back</Link>
      </div>
      <div className="summary-title">
        <h2>Feburary Monthly Summary</h2>
      </div>

      <div className="summary">
        <div>
          <h4>All Branch Values</h4>
        </div>
        <div>
          <h4>Amount($)</h4>
        </div>
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
        <div className="left">
          <h4>Category</h4>
          <p>Food</p>
          <p>Advertisement</p>
          <p>Transportation</p>
          <p>Others</p>
        </div>
        <div className="right">
          <h4>Sub-amount($)</h4>
          <p>1,231.19</p>
          <p>2,055.02</p>
          <p>821.71</p>
          <p>2958.04</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
