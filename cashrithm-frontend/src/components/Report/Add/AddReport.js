import React, { useState, useContext } from "react";
import "./styles.css";
import {Redirect} from "react-router-dom";
import {FetchContext} from "../../../context/FetchContext";
import Popup from "../../Popup/Popup";
import {VscTriangleUp} from "react-icons/vsc";


const AddReport = () => {
  const [file, setFile] = useState(null);
  const {authAxios} = useContext(FetchContext)
  const [isLoading, setIsLoading] = useState(false)
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);
  
  
  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("csv", file);
      const {data} = await authAxios.post("/upload-csv/transaction", formData);
      setSuccessPopup(true);
      setTimeout(() => {
        setRedirectOnSuccess(true);
      }, 1500);
    } catch (e) {
      setErrorPopup(true);
      setIsLoading(false);
      setErrorMessage(e.response.data.message);
    }
  }

  return (
    <form className="add-report" onSubmit={handleSubmit}>
    {redirectOnSuccess && <Redirect to ="/reports" />}
    {successPopup && <Popup type="success" text="Record Successful Created" setSuccessPopup={setSuccessPopup} />}
      {errorPopup && <Popup type="error" text={errorMessage} setErrorPopup={setErrorPopup} />}
      <h3>Add Data</h3>
      <div className="container">
        <label className="dropzone" htmlFor="files">select trasaction csv file</label>
        <input id="files" type="file" onChange={(e) => handleOnChange(e)} />
      </div>
      <button>{isLoading ? <div><VscTriangleUp className="spinner" /><span>Please wait...</span></div> : <span>Create</span>}</button>
    </form>
  );
};

export default AddReport;
