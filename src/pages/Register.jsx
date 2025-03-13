import React, { useState } from "react";
import headerStyles from "../components/header.module.css";
import styles from "../styles/register.module.css";
import imagePath from "../assets/Oan-logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterApi } from "../api/userLoginApi";
import UserRegisterSchema from "../schema/UserRegisterSchema";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import iconstyles from "./Login.module.css";

function Register() {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserRegisterSchema) });

  const onSubmit = async (data) => {
    setErrorMsg(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    const result = await userRegisterApi(data);

    if (result?.id) {
      // Registration successful, display message
      setSuccessMessage(
        "Registration successful! Your account is under review. You will be notified once an admin approves your account."
      );
    } else if (result?.error) {
      setErrorMsg("E-mail already exists. Please try with a different email.");
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #EFDA2F )",
        height: "80vh",
      }}
    >
      <div className={headerStyles.headerDiv}>
        <div>
          <img src={imagePath} style={{ width: "50px", height: "auto" }} alt="Logo" />
        </div>

        <div
          style={{
            textAlign: "center",
            marginLeft: "10px",
            borderLeft: "2px solid gray",
            paddingLeft: "10px",
            color: "#4f6f4a",
          }}
        >
          <h6>
          AgriNet: An Open Network for Global Agriculture
          </h6>
        </div>
      </div>

      <div className={styles.formDiv}>
        <form
          className="card-body form-floating mt-3 mx-1"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className="container mb-3">
            <div className="h2" style={{ color: "#3E6139" }}>
              Sign up
            </div>
          </div>

          {/* Display error message in red and success message in green above buttons */}
         

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                placeholder="Name"
                {...register("name")}
              />
              <label className="form-label">Name</label>
              {errors.name && <p>{errors.name.message}</p>}
            </div>
          </div>

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                placeholder="Email"
                {...register("email")}
              />
              <label className="form-label">Email</label>
              {errors.email && <p>{errors.email.message}</p>}
            </div>
          </div>

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                style={{ paddingRight: "30px" }}
              />
              <div onClick={togglePassword} className={iconstyles.icon}>
                {passwordShown ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </div>
              <label className="form-label">Password</label>
              {errors.password && <p>{errors.password.message}</p>}
            </div>
          </div>

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="hidden"
                placeholder="Role"
                {...register("role")}
                value="provider"
                readOnly
              />
              {errors.role && <p>{errors.role.message}</p>}
            </div>
          </div>

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                placeholder="Organization"
                {...register("organization")}
              />
              <label className="form-label">Organization</label>
              {errors.organization && <p>{errors.organization.message}</p>}
            </div>
          </div>

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                placeholder="Secret Code"
                {...register("source_code")}
              />
              <label className="form-label">Secret Code</label>
              {errors.source_code && <p>{errors.source_code.message}</p>}
            </div>
          </div>

          {/* Flexbox for buttons */}
          <div
            className="container mb-3"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                backgroundColor: "#3E6139",
                borderColor: "#3E6139",
              }}
            >
              Submit
            </button>

            <Button
              onClick={() => navigate("/login")}
              className={styles.loginButton}
              style={{
                backgroundColor: "#3E6139",
                borderColor: "#3E6139",
              }}
            >
              Login to your account
            </Button>
          </div>
        </form>
        
      </div>
      {errorMsg && <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>}
        {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}

      <Footer />
    </div>
  );
}

export default Register;
