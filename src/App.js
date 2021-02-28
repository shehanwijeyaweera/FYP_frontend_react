import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import SentimentHomepage from "./components/Test";
import ScraperHome from "./components/ScraperHome";
import Webscraper from "./components/Webscraper";
import ModelTraining from "./components/ModelTraining";
import ClientApp from "./components/ClientApp";

function App() {
  return (
    <div>
      <Router>
        <div >
          <HeaderComponent />
          <div style={{backgroundImage:"radial-gradient(circle, #84a0c9, #4fb0d8, #00bfd2, #00cbb3, #51d183)",height:"100vh",width:"100vw",margin:"0 auto"}}>
            <Switch>
              <Route path="/" exact component={SentimentHomepage}></Route>
              <Route path="/sentiment" exact  component={SentimentHomepage}></Route>
              <Route path="/scrape" exact  component={Webscraper}></Route>
              <Route path="/modeltrain" exact  component={ModelTraining}></Route>
              <Route path="/clientapp" exact  component={ClientApp}></Route>
            </Switch>
          </div>
          <FooterComponent />
        </div>
      </Router>
    </div>
  );
}

export default App;
