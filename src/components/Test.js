import React, { useState, useEffect } from "react";
import axios, { post } from "axios";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";

const Test = () => {
  const [fileData, setFileDate] = useState();
  const [resultData, setResultData] = useState("");
  const [hotelname, setHotelName] = useState("");
  const [showData, setShowData] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [load, setLoad] = useState(false);
  const onUpload = (data) => {
    setFileDate(data.target.files[0]);
  };

  const handleUpload = async () => {
    setLoad(true);
    if (fileData == null){
      const url = "http://127.0.0.1:5000/predict_from_database";
    const formData = new FormData();
    formData.append("hotel_name", hotelname);
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
    }
    else{
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
    }
  };

  const handleClose = () => {
    setShowData(false);
    setResultData("");
  };

  const piedata = {
    labels: ["Excellent", "Very Good", "Average", "Poor", "Terrible"],
    datasets: [
      {
        label: "sentiment analysis for hotel 2021",
        data: [
          resultData.Excellent,
          resultData.Very_Good,
          resultData.Average,
          resultData.Poor,
          resultData.Terrible,
        ],
        backgroundColor: [
          "rgb(0,255,0)",
          "rgba(0, 194, 19, 1)",
          "rgb(255,255,0)",
          "rgba(240, 80, 0, 1)",
          "rgba(240, 0, 0, 1)",
        ],
      },
    ],
  };

  const optionspie = {
    title: {
      display: true,
      text: "Sentiment Analysis",
    },
  };

  useEffect(() => getDropdown(), []);

  const getDropdown = async () => {
    await axios
      .get("http://127.0.0.1:5000/get_all_table_names")
      .then((response) => {
        setLoad(false);
        console.log(response.data);
        setTableList(response.data);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err.message);
      });
  };

  const performSentiment = async (e) => {
    setLoad(true);
  }

  return (
    <div>
      <Modal
        show={showData}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sentiment Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultData !== "" ? (
            <>
              Excellent: {resultData.Excellent.toFixed(2)}%
              <br />
              <br />
              Very Good: {resultData.Very_Good.toFixed(2)}%
              <br />
              <br />
              Average: {resultData.Average.toFixed(2)}%
              <br />
              <br />
              Poor: {resultData.Poor.toFixed(2)}%
              <br />
              <br />
              Terrible: {resultData.Terrible.toFixed(2)}%
            </>
          ) : null}
          <div className="chart">
            <Doughnut data={piedata} options={optionspie} />
          </div>
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
          <div className="card col-md-6 offset-md-3 offset-md-3 text-center">
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
              <Form.Group controlId="formGridState">
                <Form.Label>Or select from database</Form.Label>
                <Form.Control value={hotelname} onChange={(e) => setHotelName(e.currentTarget.value)} as="select" defaultValue="Choose...">
                  {tableList.length !== 0 ? (
                    <>
                      {tableList.map((obj) => (
                        <>
                          <option value={obj.hotel_name}>{obj.hotel_name}</option>
                        </>
                      ))}
                    </>
                  ) : null}
                </Form.Control>
              </Form.Group>
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
