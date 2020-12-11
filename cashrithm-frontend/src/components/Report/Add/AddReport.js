import React, { useState } from "react";
import ImportCSV from "./ImportCSV";
import "./styles.css";

const AddReport = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(title, file);
  }

  return (
    <form className="add-report" onSubmit={handleSubmit}>
      <h3>Add Data</h3>
      <input
        id="title"
        type="text"
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ImportCSV
        onDrop={(result) => {
          setFile(result);
        }}
      />
      <button>Create</button>
    </form>
  );
};

export default AddReport;
