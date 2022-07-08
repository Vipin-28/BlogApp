import axios from "axios";
import {axiosInstance} from "../../config.js";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./login.css";

export default function Login() {
  const userRef = useRef();         // to get reference of the user input dom object
  const passwordRef = useRef();     // to get referecne of the password input dom object
  const {dispatch, isFetching } = useContext(Context);      // sending 2 props

  const handleSubmit = async (e) => { // on submission of the login form
    e.preventDefault();               // prevent webpage to get refresh
    dispatch({ type: "LOGIN_START" });// start login on form submission
    try {
      const res = await axiosInstance.post("/auth/login", {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      // if we got the response
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });  
      //console.log("login success");  
    } catch (err) {
      //console.log("login error");  
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };
  //console.log(isFetching);
  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="loginInput"
          placeholder="Enter your username..."
          ref={userRef}       
        />
        <label>Password</label>
        <input
          type="password"
          className="loginInput"
          placeholder="Enter your password..."
          ref={passwordRef}
        />
        <button className="loginButton" type="submit" disabled={isFetching}>
          Login
        </button>
      </form>
      <button className="loginRegisterButton">
        <Link className="link" to="/register">
          Register
        </Link>
      </button>
    </div>
  );
}