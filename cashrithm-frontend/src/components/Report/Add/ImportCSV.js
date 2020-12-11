import React, { useState } from "react";
import Dropzone from "react-dropzone";
import "./styles.css";

const csv = require("csvtojson");

const ImportCSV = ({ onDrop }) => {
  const [file, setFile] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const fileAsBinaryString = reader.result;

        csv({
          noheader: true,
          output: "json",
        })
          .fromString(fileAsBinaryString)
          .then((csvRows) => {
            const toJson = [];
            csvRows.forEach((aCsvRow, i) => {
              if (i !== 0) {
                const builtObject = {};

                Object.keys(aCsvRow).forEach((aKey) => {
                  const valueToAddInBuiltObject = aCsvRow[aKey];
                  const keyToAddInBuiltObject = csvRows[0][aKey];
                  builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
                });

                toJson.push(builtObject);
              }
            });
            onDrop(toJson);
          });
      };

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.readAsBinaryString(file);
    });
  };

  return (
    <div className="import-csv">
      <Dropzone onDrop={handleDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Select CSV files...</p>
          </div>
        )}
      </Dropzone>
      <ul>
        {file.map((f) => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ImportCSV;
