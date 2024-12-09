import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../components/shared/inputForm";
import Spinner from "../components/shared/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading } = useSelector((state) => state.alerts);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !lastname || !email || !password) {
        return alert("please provide all fields");
      }
      dispatch(showLoading());
      const { data } = await axios.post("/api/v1/auth/register", {
        name,
        lastname,
        email,
        password,
      });

      if (data.success) {
        dispatch(hideLoading());
        toast.success("Register successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid form details please try again");
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
            />
            <InputForm
              htmlFor="name"
              labeltext={"Name"}
              type={"text"}
              value={name}
              handleChange={(e) => setName(e.target.value)}
              name="name"
            />
            <InputForm
              htmlFor="lastname"
              labeltext={"last name"}
              type={"text"}
              value={lastname}
              handleChange={(e) => setLastname(e.target.value)}
              name="lastname"
            />
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
            <div className="mb-1">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input type="text" className="form-control" name="location" />
            </div>
            <div className="d-flex justify-content-around">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
