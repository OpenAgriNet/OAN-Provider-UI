import React, { useEffect, useState } from "react";
import headerStyles from "../components/header.module.css";
import styles from "../styles/register.module.css";
import imagePath from "../assets/Oan-logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UserLoginSchema from "../schema/UserLoginSchema";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { userLoginApi } from "../api/userLoginApi";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import iconstyles from "./Login.module.css";
import { Button } from "antd";

function Login() {
  const [passwordShown, setPasswordShown] = useState(false);

  const navigate = useNavigate();
  const login = () => {
    localStorage.setItem("login", true);
    navigate("/");
  };
  useEffect(() => {
    let login = localStorage.getItem("token");
    if (login) {
      navigate("/");
    }
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserLoginSchema) });

  const onSubmit = async (data) => {
    const result = await userLoginApi(data);
    if (result?.data?.user?.role === "admin") {
      let token = localStorage.setItem("token", result?.data?.token);
      let user = localStorage.setItem("user", result?.data?.user?.name);

      navigate("/admin-home");
    } else if (result?.data?.user?.role === "provider") {
      let token = localStorage.setItem("token", result?.data?.token);
      let user = localStorage.setItem("user", result?.data?.user?.name);
      navigate("/home");
    } else {
      alert("Please check Email and Password");
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(to bottom, #FFFFFF, #EFDA2F )",
          height: "80vh",
        }}
      >
        <div className={headerStyles.headerDiv}>
          <div>
            <img src={imagePath} style={{ width: "72px", height: "auto", cursor: "pointer", marginLeft:'1rem' }} />
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
            <h6>
            AgriNet: An Open Network for Global Agriculture
            </h6>
          </div>
        </div>

        <div className={styles.formDiv}>
          <form
            className=" card-body form-floating mt-3 mx-1"
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
                  name="contentName"
                  id="contentName"
                  placeholder="Email"
                  {...register("username")}
                ></input>
                <label className="form-label" htmlFor="contentName">
                  {" "}
                  Email
                </label>
                {errors.username && <p>{errors.username.message}</p>}
              </div>
            </div>
            <div className="container mb-3">
              <div className="form-floating input-with-icon">
                <input
                  className="form-control"
                  type={passwordShown ? "text" : "password"}
                  name="contentName"
                  id="contentName"
                  placeholder="Name of the content"
                  {...register("password")}
                  style={{ paddingRight: "30px" }} // Add padding to accommodate the icon
                />
                <div onClick={togglePassword} className={iconstyles.icon}>
                  {passwordShown ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                {errors.password && <p>{errors.password.message}</p>}
              </div>
            </div>
            <div className="container mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="role"
                  id="role"
                  placeholder="role"
                  {...register("role")}
                  defaultValue={"provider"}
                  hidden
                >
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
                {/* <label className="form-label" htmlFor="role">
                  Role
                </label> */}
                {errors.role && <p>{errors.role.message}</p>}
              </div>
            </div>
            <div className="container mb-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <div style={{ marginTop: '25px' }}>
    <button
      className="btn btn-primary"
      style={{
        backgroundColor: '#3E6139',
        borderColor: '#3E6139',
      }}
      onClick={login}
    >
      Sign In
    </button>
  </div>
  <div style={{ marginTop: '25px', marginLeft: '10px' }}>
    <button
      className="btn btn-primary"
      style={{
        backgroundColor: '#3E6139',
        borderColor: '#3E6139',
        paddingLeft: '10px',
      }}
      onClick={() => {
        navigate('/register');
      }}
    >
      Register
    </button>
  </div>
</div>

          </form>
          <br />
          {/* <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <div>
              <Button
                className={styles.loginButton}
                onClick={() => {
                  navigate("/register");
                }}
                title="Register as Provider"
              >
                Register as Provider
              </Button>
            </div>
            <br />
            <div>
              <Button className={styles.loginButton}>
                <a
                  href="https://onest-fs-seeker.tekdinext.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register as Seeker
                </a>
              </Button>
            </div>
          </div> */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Login;
