import axios from 'axios'

const SENTIMENT_FLASK_API_URL = "http://127.0.0.1:5000/predict";

class SentimentAnalysisService {

    getSentimentAnalysis(){
        return axios.get(SENTIMENT_FLASK_API_URL);
    }
}

export default new SentimentAnalysisService()