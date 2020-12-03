import React, { useState } from "react";
import ImportCSV from "./ImportCSV";
import "./styles.css";

const AddCategories = () => {
  const [file, setFile] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(file);
  }

  return (
    <form className="add-report" onSubmit={handleSubmit}>
      <h3>Add Categories</h3>
      <ImportCSV
        onDrop={(result) => {
          setFile(result);
        }}
      />
      <button>Create</button>
    </form>
  );
};

export default AddCategories;
