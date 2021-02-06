import React, { useState } from "react";
import axios, { post } from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

const Webscraper = () => {
  const [csvfileData, setCsvFileDate] = useState();
  const [resultData, setResultData] = useState("");
  const [resultData2, setResultData2] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [noPages, setNoPages] = useState("");
  const [showData, setShowData] = useState(false);
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const onPageNoChange = (e) => {
    setNoPages(e.target.value);
  };
  const onFileNameChange = (e) => {
    setCsvFileDate(e.target.value);
  };
  const onPageValueChange = async (e) => {
    document.getElementById("exampleInputEmail2").disabled = true;
    document.getElementById("exampleInputEmail3").disabled = true;
    console.log(e.target.value);
    setLoad(true);

    const API = "http://127.0.0.1:5000/no_pages";
    const formData = new FormData();
    formData.append("url", e.target.value);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    await axios
      .post(API, formData, config)
      .then((response) => {
        setLoad(false);
        console.log(response.data);
        setNoPages(response.data.No_pages);
        setFileName(response.data.heading);
        setUrl(e.target.value)
        document.getElementById("exampleInputEmail2").disabled = false;
        document.getElementById("exampleInputEmail3").disabled = false;
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err.message);
      });
  };

  const handleUpload = async () => {
    setLoad2(true);
    const API = "http://127.0.0.1:5000/scrape_reviews";
    const formData = new FormData();
    formData.append("url", url);
    formData.append("num_pages", noPages);
    formData.append("file_name", fileName);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    //return  post(url, formData,config)
    await axios
      .post(API, formData, config)
      .then((response) => {
        setLoad2(false);
        console.log(response.data);
        setResultData(response.data);
        setShowData(true);
        setUrl( ' ');
        setNoPages(' ' );
        setFileName( ' ');
      })
      .catch((err) => {
        setLoad2(false);
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
              File Location: {resultData.file_location}
              <br />
              <br />
              Status: {resultData.status}
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
          <div className="card col-md-8 offset-md-2 text-center">
            <h2>Webscraper</h2>
            <div className="card-body">
                <div className="form-group text-center">
                  <label htmlFor="exampleInputEmail1">
                    Enter the URL:{" "}
                    {load ? (
                      <>
                        <Spinner animation="border" variant="success" />
                      </>
                    ) : (
                      <></>
                    )}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="urlInput"
                    aria-describedby="emailHelp"
                    placeholder="Enter URL"
                    onChange={(e) => onPageValueChange(e)}
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    Currently only tripadvisor webiste supports
                  </small>
                </div>
                <div className="form-group text-center">
                  <label htmlFor="noOfPages">
                    Amount of pages to be scraped:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail2"
                    aria-describedby="emailHelp"
                    placeholder="Amount of Pages"
                    value={noPages}
                    onChange={(e) => onPageNoChange(e)}
                    disabled
                  />
                </div>
                <div className="form-group text-center">
                  <label htmlFor="exampleInputEmail3">
                    File name of the CSV:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail3"
                    aria-describedby="emailHelp"
                    placeholder="Csv file name"
                    value={fileName}
                    onChange={(e) => onFileNameChange(e)}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleUpload}
                  >
                   {load2 ? (
                    <>
                      <Spinner animation="border" variant="success" />
                    </>
                  ) : (
                    <>Submit</>
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

export default Webscraper;
