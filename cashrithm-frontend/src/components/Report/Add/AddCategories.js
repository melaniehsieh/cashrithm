<<<<<<< HEAD
import React, { useState, useContext } from "react";
=======
import React, { useState, useEffect, useContext } from "react";
>>>>>>> 018f58f26fd18939020b794442e2b54d821aa632
import { Redirect } from "react-router-dom";
import { FetchContext } from "../../../context/FetchContext";
import "./styles.css";
import Popup from "../../Popup/Popup";
import { VscTriangleUp } from "react-icons/vsc";

const AddCategories = () => {
  const [file, setFile] = useState(null);
  const { authAxios } = useContext(FetchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);

  /*useEffect(() => {
    const timer = setTimeout(() => {
      setRedirectOnSuccess(true);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [redirectOnSuccess]);*/

  const handleOnChange = (e) => {
    //console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("csv", file);
<<<<<<< HEAD
      await authAxios.post("/upload-csv/category", formData);
=======
      const { data } = await authAxios.post("/upload-csv/category", formData);
>>>>>>> 018f58f26fd18939020b794442e2b54d821aa632
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
      {redirectOnSuccess && <Redirect to="/reports" />}
      {successPopup && (
        <Popup
          type="success"
          text="Category Successful Created"
          setSuccessPopup={setSuccessPopup}
        />
      )}
      {errorPopup && (
        <Popup type="error" text={errorMessage} setErrorPopup={setErrorPopup} />
      )}
      <h3>Add Categories</h3>
      <input
        id="files"
        type="file"
        placeholder="Select Category CSV files..."
        onChange={(e) => handleOnChange(e)}
      />
      <button>
        {isLoading ? (
          <div>
            <VscTriangleUp className="spinner" />
            <span>Please wait...</span>
          </div>
        ) : (
          <span>Create</span>
        )}
      </button>
    </form>
  );
};

export default AddCategories;
