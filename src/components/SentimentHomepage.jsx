import React, { Component,useState } from "react";
import axios, { post } from 'axios';

class SentimentHomepage extends Component {
  
    constructor(props) {
        super(props);
        this.state ={
          file:null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        const [sentiment, setsentiment] = useState(null);
      }
    
      onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response)=>{
          console.log(response.data);
        })
      }
    
      onChange(e) {
        this.setState({file:e.target.files[0]})
      }
    
      fileUpload(file){
        const url = 'http://127.0.0.1:5000/predict';
        const formData = new FormData();
        formData.append('reviews',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return  post(url, formData,config)
      }
    




  render() {
    return (
      <div>
    
        <div className="container">
            <br/>
          <div className="row">
            <div className="card col-md-6 offset-md-3 offset-md-3">
              <h2>Sentiment Analysis</h2>
              <div className="card-body">
                <form onSubmit={this.onFormSubmit}>
                  <div className="form-group text-center">
                    <label htmlFor="exampleFormControlFile1">
                      Uplaod CSV file for sentiment analysis
                    </label>
                    <input
                      type="file"
                      className="form-control-file text-center"
                      id="exampleFormControlFile1"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group text-center">
                  <button className="btn btn-primary" type="submit">Upload</button>
                  </div>
                  <div className="text-center">

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SentimentHomepage;
