import { useState } from "react";
import RegisterPage from "./component/RegisterPage";
import ChatRoom from "./ChatRoom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import LoginPage from "./component/LoginPage";
import { loginContext } from "./TestContext";
function App() {
  const [data, setData] = useState({});
  const [showNavbar,setshowNavbar] =useState(true);

  const values = {
    data,
    setData,
  };
  return (

    <loginContext.Provider value={values}>
      <Router>
      <div>
       {showNavbar && 
          <div>
            <nav className="navbar navbar-light bg-light">
              <form className="container-fluid justify-content-start">
                <Link to="/login">
                  <button
                    className="btn btn-outline-success me-2"
                    type="button"
                    onClick={()=>setshowNavbar(false)}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                  >
                    Register
                  </button>
                </Link>
              </form>
            </nav>
          </div> 
      }

          <Routes>
            <Route exact path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="user/:email" element={<ChatRoom />} />
          </Routes>
        </div>
      </Router>
    </loginContext.Provider>
  );
}

export default App;
