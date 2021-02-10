import React, { useState } from "react";
import axios, { post } from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

const ModelTraining = () => {
  const [load, setLoad] = useState(false);
  const [fileData, setFileDate] = useState();
  const [resultData, setResultData] = useState("");
  const [showData, setShowData] = useState(false);
  const [modelFileName, setModelFileName] = useState("");
  const onmodelFileNameChange = (e) => {
    setModelFileName(e.target.value);
    document.getElementById("submitbtn").disabled = false;
  };
  const onUpload = (data) => {
    setFileDate(data.target.files[0]);
    document.getElementById("exampleInputEmail2").disabled = false;
  };
  const handleUpload = async () => {
    setLoad(true);
    const url = "http://127.0.0.1:5000/model_training";
    const formData = new FormData();
    formData.append("reviews", fileData);
    formData.append("file_name", modelFileName);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    //return  post(url, formData,config)
    await axios
      .post(url, formData, config)
      .then((response) => {
        setLoad(false);
        console.log(response.data);
        setResultData(response.data);
        setShowData(true);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err.message);
      });
  };

  const handleClose = () => {
    setShowData(false);
    setResultData("");
  };

  return (
    <div>
        <Modal show={showData} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Training</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultData !== "" ? (
            <>
              Status: {resultData.status}
              <br />
              <br />
              File Name: {resultData.file_name}
              <br />
              <br />
              File Path: {resultData.file_path}
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Download File
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <br />
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3 text-center">
            <h2>Model Training</h2>
            <div className="card-body">
              <div className="form-group text-center">
                <label htmlFor="exampleFormControlFile1">
                  Uplaod CSV file for Model Training:
                </label>
                <input
                  type="file"
                  className="form-control-file text-center"
                  id="exampleFormControlFile1"
                  onChange={(e) => onUpload(e)}
                />
              </div>
              <div className="form-group text-center">
                  <label htmlFor="noOfPages">
                    Model Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail2"
                    aria-describedby="emailHelp"
                    placeholder="Model Name"
                    value={modelFileName}
                    onChange={(e) => onmodelFileNameChange(e)}
                    disabled
                  />
                </div>
              <div className="form-group text-center">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={handleUpload}
                  id = "submitbtn"
                >
                  {load ? (
                    <>
                      <Spinner animation="border" variant="success" disabled/>
                    </>
                  ) : (
                    <>Upload</>
                  )}
                </button>
              </div>
              <div className="text-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
