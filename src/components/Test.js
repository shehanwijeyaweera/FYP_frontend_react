import React, { useState, useEffect } from "react";
import axios, { post } from "axios";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer, MDBRow, MDBCol, MDBBtn , MDBCard, MDBCardBody, MDBInput, MDBBadge} from "mdbreact";

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
          "rgba(0,198,93,255)",
          "rgba(40,187,174,255)",
          "rgba(224,224,224,255)",
          "rgba(255,186,69,255)",
          "rgba(255,56,70,255)",
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
          <Modal.Title>Sentiment Analysis: {resultData.hotel_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultData !== "" ? (
            <>
            <div className="row">
            <div className="col-6">
              Excellent: <MDBBadge pill color="success"> {resultData.Excellent.toFixed(2)}% </MDBBadge>
              <br />
              <br />
              Very Good: <MDBBadge pill color="default"> {resultData.Very_Good.toFixed(2)}% </MDBBadge>
              <br />
              <br />
              Average: <MDBBadge pill color="light"> {resultData.Average.toFixed(2)}% </MDBBadge>
              </div>
              <div className="col-6">
              Poor: <MDBBadge pill color="warning"> {resultData.Poor.toFixed(2)}% </MDBBadge>
              <br />
              <br />
              Terrible: <MDBBadge pill color="danger"> {resultData.Terrible.toFixed(2)}% </MDBBadge>
              </div>
              </div>
            </>
          ) : null}
          <div className="chart">
            <Doughnut data={piedata} options={optionspie} />
          </div>
          <div>
            
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
      {/* -------- */}
      <MDBContainer>
      <MDBRow>
        <MDBCol md="6" className="offset-3" style={{marginTop: 100}}>
          <MDBCard>
            <div className="header pt-3 grey lighten-2">
              <MDBRow className="d-flex justify-content-start">
                <h3 className="deep-grey-text mt-3 mb-4 pb-1 mx-5">Sentiment Analysis</h3>
                </MDBRow>
            </div>
            <MDBCardBody className="mx-4 mt-4">
            <label
                htmlFor="defaultFormEmailEx"
                className="grey-text font-weight-light"
              >
                Uplaod CSV file for sentiment analysis
              </label>
              <MDBInput
                 type="file"
                 className="form-control-file text-center"
                 id="exampleFormControlFile1"
                 onChange={(e) => onUpload(e)}
              />
              <label
                htmlFor="defaultFormEmailEx"
                className="grey-text font-weight-light"
              >
                Or select from database
              </label>
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
               </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
  );
};

export default Test;
