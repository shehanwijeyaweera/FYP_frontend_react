import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios, { post } from "axios";
import Table from "react-bootstrap/Table";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";

function ClientApp() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [listOne, setListOne] = useState([]);
  const [listtwo, setListtwo] = useState([]);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShowData(false);
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [load3, setLoad3] = useState(false);
  const [link, setLink] = useState("");
  const [csvfilename, setCsvfilename] = useState("");
  const [resultData, setResultData] = useState("");
  const [showData, setShowData] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const HandleOne = async () => {
    setLoad(true);
    await axios
      .get("http://127.0.0.1:5000/get_top_hotels_sl")
      .then((response) => {
        setLoad(false);
        console.log(response.data);
        setListOne(response.data);
        setShow(true);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err.message);
      });
  };

  const Handletwo = async () => {
    setLoad2(true);
    await axios
      .get("http://127.0.0.1:5000/get_top_hotels_wp")
      .then((response) => {
        setLoad2(false);
        console.log(response.data);
        setListtwo(response.data);
        setShow2(true);
      })
      .catch((err) => {
        setLoad2(false);
        console.log(err.message);
      });
  };

  const perfomSentiment = async (e) => {
    setShow(false);
    setShow2(false);
    document.getElementById("btnsl").style.visibility = "hidden";
    document.getElementById("btnwp").style.visibility = "hidden";
    document.getElementById("headertext").innerHTML =
      "Getting No of review pages of : " + e.title;
    setLoad3(true);

    const API = "http://127.0.0.1:5000/no_pages";
    const formData = new FormData();
    formData.append("url", e.link);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    await axios
      .post(API, formData, config)
      .then((response) => {
        document.getElementById("headertext").innerHTML =
          "Pages : " +
          response.data.No_pages +
          " | Scraping reviews of : " +
          e.title;
        setLoad3(true);
        scrapeReviews(e, response);
        setCsvfilename(response.data.heading);
      })
      .catch((err) => {
        setLoad3(false);
        console.log(err.message);
        document.getElementById("headertext").innerHTML =
          "Error getting No of pages: " + e.title;
      });
  };

  const scrapeReviews = async (e, response) => {
    const API = "http://127.0.0.1:5000/scrape_reviews_db";
    const formData = new FormData();
    formData.append("url", e.link);
    formData.append("num_pages", response.data.No_pages);
    formData.append("file_name", response.data.heading);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    //return  post(url, formData,config)
    await axios
      .post(API, formData, config)
      .then((response) => {
        document.getElementById("headertext").innerHTML =
          "Performing Sentiment Analysis of: " + e.title;
        sentimentAnalysis(response.data.filename);
      })
      .catch((err) => {
        document.getElementById("headertext").innerHTML =
          "Error scraping reviews of : " + e.title;
        console.log(err.message);
      });
  };

  const sentimentAnalysis = async (filename) => {
    const url = "http://127.0.0.1:5000/predict_from_database";
    const formData = new FormData();
    formData.append("hotel_name", filename);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    await axios
      .post(url, formData, config)
      .then((response) => {
        setLoad3(false);
        console.log(response.data);
        setResultData(response.data);
        setShowData(true);
      })
      .catch((err) => {
        document.getElementById("headertext").innerHTML =
          "Error Performing Sentiment Analysis! ";
        setLoad3(false);
        console.log(err.message);
      });
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

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Top Hotels in Sri Lanka</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listOne.length !== 0 ? (
                <>
                  {listOne.map((obj) => (
                    <>
                      <tr>
                        <td>{obj.title}</td>
                        <td>
                          <a
                            className="btn btn-outline-primary my-2 my-sm-0"
                            href={obj.link}
                          >
                            Visit Page
                          </a>
                        </td>
                        <td>
                          <a
                            className="btn btn-outline-info my-2 my-sm-0"
                            onClick={(e) => perfomSentiment(obj)}
                          >
                            perform sentiment
                          </a>
                        </td>
                      </tr>
                    </>
                  ))}
                </>
              ) : null}
            </tbody>
          </Table>
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
      {/* ------- */}
      <Modal show={show2} onHide={handleClose2} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Top Hotels around Western province</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listtwo.length !== 0 ? (
                <>
                  {listtwo.map((obj2) => (
                    <>
                      <tr>
                        <td>{obj2.title}</td>
                        <td>
                          <a
                            className="btn btn-outline-primary my-2 my-sm-0"
                            href={obj2.link}
                          >
                            Visit Page
                          </a>
                        </td>
                        <td>
                          <a className="btn btn-outline-info my-2 my-sm-0">
                            perform sentiment
                          </a>
                        </td>
                      </tr>
                    </>
                  ))}
                </>
              ) : null}
            </tbody>
          </Table>
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
      {/* ----- */}
      <Modal
        show={showData}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose3}
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
      <div>
        <MDBContainer>
          <MDBRow >
            <MDBCol md="6" className="offset-3">
              <div className="text-center">
                <br></br>
                <h2 id="headertext">Hotel sentiment Analysis</h2>
                <br></br>
                <img src="https://partners.aljazeera.net/sites/default/files/banners/2020/001_0.jpg" style={{height:200, marginBottom:50}}/>
                <br></br>
                {load3 ? (
                  <>
                    <Spinner animation="border" variant="success" />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="text-center">
                <>
                  <MDBBtn
                    variant="primary"
                    size="lg"
                    active
                    id="btnsl"
                    onClick={HandleOne}
                    style={{ width: 300, height: 75 }}
                    color="purple"
                  >
                    {load ? (
                      <>
                        <Spinner animation="border" variant="success" />
                      </>
                    ) : (
                      <>Top Hotels in Sri Lanka</>
                    )}
                  </MDBBtn>{" "}
                  <MDBBtn
                    variant="primary"
                    size="lg"
                    active
                    id="btnwp"
                    onClick={Handletwo}
                    style={{ width: 300 }}
                    color="purple"
                  >
                    {load2 ? (
                      <>
                        <Spinner animation="border" variant="success" />
                      </>
                    ) : (
                      <>Top Hotels around Western province</>
                    )}
                  </MDBBtn>{" "}
                </>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
}

export default ClientApp;
