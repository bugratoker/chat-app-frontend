import { useState,useContext } from "react";
import { useFormik } from "formik";
import axios from "axios";
import ChatRoom from "../ChatRoom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { loginContext } from "../TestContext";


function LoginPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const {data,setData} = useContext(loginContext);
  let baseURL = "http://localhost:8082/v1/auth/login";
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2));
      console.log("submitlendi");
      login(values);
    },
  });
  function login(user) {
    axios
      .post(baseURL, {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUserData(response.data);
        setData(response.data);
        localStorage.setItem("data",JSON.stringify(response.data));
        navigate(`/user/${user.email}`);
        
      })
      .catch((error) => {
        alert(error.response.data);
      });
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ textAlign: "center", marginTop: "150px" }}
    >
      <label htmlFor="email">Email Address</label>
      <br />
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <br />
      <br />
      <label htmlFor="password">Password</label>
      <br />
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <br />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;
