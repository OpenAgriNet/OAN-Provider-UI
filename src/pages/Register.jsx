import React, { useState } from "react";
import headerStyles from "../components/header.module.css";
import styles from "../styles/register.module.css";
import imagePath from "../assets/school_logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterApi } from "../api/userLoginApi";
import UserRegisterSchema from "../schema/UserRegisterSchema";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Button, Modal, Space } from "antd";

import iconstyles from "./Login.module.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

function Register() {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserRegisterSchema) });

  const onSubmit = async (data) => {
    const result = await userRegisterApi(data);
    if (result?.data) {
      setisModalOpen(true);
      // navigate("/login");
    } else if (result?.error) {
      alert("E-mail already exists");
    }
  };
  const login = () => {
    navigate("/");
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
          <img src={imagePath} style={{ width: "50px", height: "auto" }} />
        </div>

        <div
          style={{
            textAlign: "center",
            marginLeft: "10px",
            borderLeft: "2px solid gray",
            paddingLeft: "10px",
            color: "white",
          }}
        >
          <h6>
            ONEST as SAAS - Giving Providers an easy gateway to publish to the
            network
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
              Sign up 
            </div>
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                placeholder="Name "
                {...register("name")}
              ></input>
              <label className="form-label" htmlFor="name">
                {" "}
                Name
              </label>
              {errors.userName && <p>{errors.userName.message}</p>}
            </div>
          </div>

          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                {...register("email")}
              ></input>
              <label className="form-label" htmlFor="email">
                {" "}
                Email
              </label>
              {errors.userEmail && <p>{errors.userEmail.message}</p>}
            </div>
          </div>
          <div className="container mb-3">
            <div className="form-floating ">
              <input
                className="form-control"
                type={passwordShown ? "text" : "password"}
                name="password"
                id="password"
                placeholder="password"
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
              {/* <select
                {...register("role", { required: true })}
                placeholder="Select a Role"
                className="form-select"
              >
                <option value="" color="grey">
                  Select a role
                </option>

                <option value="provider">Provider</option>
                <option value="admin">Admin</option>
              </select> */}
              <input
                className="form-control"
                type="hidden"
                name="role"
                id="role"
                placeholder="Role"
                {...register("role")}
                value="provider"
                defaultValue={"provider"}
                readOnly
              ></input>
              {/* <label className="form-label" htmlFor="role">
                {" "}
                Role
              </label> */}
              {errors.role && <p>{errors.role.message}</p>}
            </div>
          </div>
        <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                name="organization"
                id="organization"
                placeholder="Name of the organization"
                {...register("organization")}
              ></input>
              <label className="form-label" htmlFor="organization">
                {" "}
                Organization
              </label>
              {errors.organization && <p>{errors.organization.message}</p>}
            </div>
          </div>
          <div className="container mb-3">
            <div className="form-floating">
              <input
                className="form-control"
                type="text"
                name="source_code"
                id="source_code"
                placeholder="Secret Code"
                {...register("source_code")}
              ></input>
              <label className="form-label" htmlFor="source_code">
                {" "}
                Secret Code
              </label>
              {errors.secretCode && <p>{errors.secretCode.message}</p>}
            </div>
            <div style={{ marginTop: "25px" }}>
              <button className="btn btn-primary"  style={{
        backgroundColor: '#3E6139',
        borderColor: '#3E6139',
      }}>Submit</button>
            </div>
          </div> 
        </form>
        <br />
        <div>
          <Button onClick={login} className={styles.loginButton}  style={{
        backgroundColor: '#3E6139',
        borderColor: '#3E6139',
      }}>
            Login to your account
          </Button>{" "}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Modal
          open={isModalOpen}
          onOk={() => {
            setisModalOpen(false);
            navigate("/login");
          }}
          onCancel={() => {
            setisModalOpen(false);
            navigate("/login");
          }}
          okText="ok"
          cancelText="cancel"
        >
          <p>Thank you!</p>
          <p>for your interset in participating in the onest network</p>
          <p>
            We will review your request and get back to you with and update
            soon!
          </p>
        </Modal>
      </div>
      <div >
        <Footer />
      </div>
    </div>
  );
}

export default Register;
