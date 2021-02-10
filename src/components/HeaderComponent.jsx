import React,{useEffect,useState} from 'react'
import { useHistory } from "react-router-dom";


const HeaderComponent = () => {
  let history = useHistory();
const [admin,setAdmin] = useState(false);
const [client,setClient] = useState(false);

  useEffect(() => {
    const account = localStorage.getItem('account');
    if (account === 'admin' || account === null || account === '') {
      setAdmin(true)
      setClient(false);
    }
    else if( account=== 'client')
    {
      setClient(true);
      setAdmin(false);
    }
  }, []);


  const HandleClick = async () => {
    const account = await  localStorage.getItem('account');
    if (account === 'admin' || account === null || account === '') {
      localStorage.setItem('account', "client");
      setClient(true);
      setAdmin(false);
      await history.push('/clientapp')
    }
    else if( account=== 'client')
    {
      localStorage.setItem('account', "admin");
      setAdmin(true)
      setClient(false);
      await history.push('/')

    }

  }

  return (
    <>
    {admin ? (
      <>
      <div>
            <div>
        <header>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div>
              <a className="navbar navbar-brand">Sentiment Analysis</a>
            </div>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="http://localhost:3000/">
                    Sentiment Analysis
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="http://localhost:3000/scrape">
                    Scrape Reviews
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="http://localhost:3000/modeltrain"
                  >
                    Model Training
                  </a>
                </li>
              </ul>
              <div class="form-inline my-2 my-lg-0 offset-9" onClick={HandleClick}>
                <a
                  class="btn btn-outline-success my-2 my-sm-0"
                >client App</a>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </div>
      </>
    ):null}


    {client ?  (
      <>
<div>
            <div>
        <header>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div>
              <a className="navbar navbar-brand">Sentiment Analysis</a>
            </div>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="http://localhost:3000/">
                    Client Sentiment Analysis
                  </a>
                </li>
              </ul>
              <div class="form-inline my-2 my-lg-0 offset-9" onClick={HandleClick}>
                <a
                  class="btn btn-outline-success my-2 my-sm-0"
                >Admin App</a>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </div>
      </>
    ):null

    }


    


    </>
  )
}

export default HeaderComponent
