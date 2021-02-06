import React, { useState } from "react";
import axios, { post } from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

const Test = () => {
  const [fileData, setFileDate] = useState();
  const [resultData, setResultData] = useState("");
  const [showData, setShowData] = useState(false);
  const [load, setLoad] = useState(false);
  const onUpload = (data) => {
    setFileDate(data.target.files[0]);
  };

  const handleUpload = async () => {
    setLoad(true);
    const url = "http://127.0.0.1:5000/predict";
    const formData = new FormData();
    formData.append("reviews", fileData);
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
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultData !== "" ? (
            <>
              AVG{resultData.Average}
              <br />
              <br />
              EX{resultData.Excellent}
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <br />
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h2>Sentiment Analysis</h2>
            <div className="card-body">
              <div className="form-group text-center">
                <label htmlFor="exampleFormControlFile1">
                  Uplaod CSV file for sentiment analysis
                </label>
                <input
                  type="file"
                  className="form-control-file text-center"
                  id="exampleFormControlFile1"
                  onChange={(e) => onUpload(e)}
                />
              </div>
              <div className="form-group text-center">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={handleUpload}
                >
                  {load ? (
                    <>
                      <Spinner animation="border" variant="success" />
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

export default Test;
