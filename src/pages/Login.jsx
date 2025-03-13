import React, { useEffect, useState } from "react";
import headerStyles from "../components/header.module.css";
import styles from "../styles/register.module.css";
import imagePath from "../assets/Oan-logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UserLoginSchema from "../schema/UserLoginSchema";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { userLoginApi } from "../api/userLoginApi";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import iconstyles from "./Login.module.css";

function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Check for an existing token and redirect if found
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserLoginSchema) });

  const onSubmit = async (data) => {
    setErrorMsg(""); // Clear any previous error
    const result = await userLoginApi(data);

    if (result.error) {
      setErrorMsg(result.error);
      return;
    }

    if (result?.user) {
      localStorage.setItem("token", result?.token);
      localStorage.setItem("user", result?.user?.name);
      navigate("/home");
    } else {
      setErrorMsg("Invalid credentials. Please check your email and password.");
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to bottom, #FFFFFF, #EFDA2F)",
          height: "80vh",
        }}
      >
        <div className={headerStyles.headerDiv}>
          <div>
            <img
              src={imagePath}
              alt="Logo"
              style={{
                width: "72px",
                height: "auto",
                cursor: "pointer",
                marginLeft: "1rem",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              marginLeft: "10px",
              borderLeft: "2px solid gray",
              paddingLeft: "10px",
              color: "#4F6F4A",
            }}
          >
            <h6>AgriNet: An Open Network for Global Agriculture</h6>
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
                Log In
              </div>
            </div>

            <div className="container mb-3">
              <div className="form-floating">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email"
                  {...register("username")}
                />
                <label className="form-label">Email</label>
                {errors.username && <p>{errors.username.message}</p>}
              </div>
            </div>

            <div className="container mb-3">
              <div className="form-floating input-with-icon">
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
                <select
                  className="form-select"
                  {...register("role")}
                  defaultValue={"provider"}
                  hidden
                >
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p>{errors.role.message}</p>}
              </div>
            </div>

            <div
              className="container mb-3"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {errorMsg && (
                <span style={{ color: "red", marginBottom: "10px" }}>
                  {errorMsg}
                </span>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#3E6139",
                    borderColor: "#3E6139",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
          <br />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
