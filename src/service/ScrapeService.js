import axios from 'axios'

const SCRAPE_FLASK_API_URL = "http://127.0.0.1:5000/scrape_reviews";

class ScrapeService {

    getScarpe(){
        return axios.get(SCRAPE_FLASK_API_URL);
    }
}

export default new ScrapeService()