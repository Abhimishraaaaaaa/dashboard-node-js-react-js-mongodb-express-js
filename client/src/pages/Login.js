import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../components/shared/inputForm";
import Spinner from "../components/shared/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading } = useSelector((state) => state.alerts);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        return alert("please provide all fields");
      }
      dispatch(showLoading());
      const { data } = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (data.success) {
        dispatch(hideLoading());
        localStorage.setItem("token", data.token);
        toast.success("login successfully");

        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid credential");
      dispatch(hideLoading());
      console.log(error);
    }
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="form-container">
          <form className="card p-2" onSubmit={handleSubmit}>
            <img
              src="assest/images/logo/logo.png"
              alt="logo"
              height={150}
              width={400}
            />{" "}
            <InputForm
              htmlFor="email"
              labeltext={"Email"}
              type={"text"}
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            <InputForm
              htmlFor="password"
              labeltext={"Password"}
              type={"text"}
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            <div className="d-flex justify-content-around">
              <p>
                you have not an account ? <Link to="/register"> register </Link>{" "}
              </p>{" "}
              <button type="submit" className="btn btn-primary">
                Login{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>
      )}{" "}
    </>
  );
};

export default Login;
