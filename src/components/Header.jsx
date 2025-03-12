import React, { useState } from "react";
import styles from "./header.module.css";
import imagePath from "../assets/school_logo.png";
import profilePath from "../assets/profile-image.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover, Menu, Modal, Alert, Space, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import iconstyles from "../pages/Login.module.css";
import { useForm } from "react-hook-form";
import { resetPassword } from "../api/Adminapi";
import { useAlert } from "react-alert";
import avatar from "../assets/aavtar.jpeg";
import { header, colors } from "../config/ICAR-Config";

function Header() {
  const navigate = useNavigate();
  const alert = useAlert();

  const location = useLocation();
  const path = location?.pathname;
  const [menuVisible, setMenuVisible] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const userName = localStorage.getItem("user");
  const onSubmit = async (data) => {
    const result = await resetPassword(data);

    if (result?.data?.update_User_by_pk) {
      setIsModalOpen(false);
      reset();
      alert.success(
        <div
          style={{
            textTransform: "initial",
          }}
        >
          <span>Password Changed</span>
        </div>,
        {
          timeout: 3000,
        }
      );
    } else {
      alert.error(
        <div
          style={{
            textTransform: "initial",
          }}
        >
          <span>Error</span>
        </div>,
        {
          timeout: 3000,
        }
      );
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const handleMenuClick = (e) => {
    setMenuVisible(false);
  };

  const myCourses = () => {
    navigate("/content");
  };

  const services = () => {
    navigate("/services");
  };
  const myHome = () => {
    navigate("/home");
  };
  const myTag = () => {
    navigate("/tagcontent");
  };
  const myCollection = () => {
    navigate("/collection");
  };
  const uploadCSV = () => {
    navigate("/uploadCSV");
  };
  const MapSchema = () => {
    navigate("#");
  };
  const myCollections = () => {
    navigate("/collections");
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="home"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {header.dropdown.menu1}
      </Menu.Item>
      <Menu.Item
        key="home"
        onClick={() => {
          navigate("/");
          localStorage.clear();
        }}
      >
        {header.dropdown.menu2}
      </Menu.Item>
    </Menu>
  );
  return (
    <React.Fragment>
      <div className={styles.mainHead}>
        <div className={styles.logodiv}>
          <div>
            <img
              src={header.headerContent.appLogo}
              style={{ width: "72px", height: "auto", cursor: "pointer", marginLeft:'1rem' }}
              onClick={() => {
                navigate("/home");
              }}
            />
          </div>

          <div className={styles.TextStyle} style={{ color: header.headerContent.appNameColor }}>
            <h6>{header.headerContent.appName}</h6>
          </div>
        </div>
        <div className={styles.menuDiv}>
          <a
            className={
              path.includes("/content") ? styles.selected : styles.anchor
            }
            onClick={myCourses}
            style={{
              backgroundColor: colors.primaryButtonColor.default,
              color: colors.primaryButtonColor.text,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryButtonColor.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.primaryButtonColor.default;
            }}
          >
            {header.button.title}
          </a>
          {/* <a
            className={
              path.includes("/collections") ? styles.selected1 : styles.anchor1
            }
            // onClick={myCollections}
          >
            Collection
          </a> */}
          {/* <a
            className={
              path.includes("/uploadCSV") ? styles.selected1 : styles.anchor1
            }
           
            // onClick={MapSchema}
          >
            Map Schema
          </a> */}
          <div className={styles.profile}>
            <Popover
              content={menu}
              trigger="click"
              open={menuVisible}
              onOpenChange={(visible) => setMenuVisible(visible)}
            >
              <Button
                style={{ marginRight: "15px", cursor: "pointer" }}
                className={styles.userButton}
                id="userButton"
              >
                <img
                  src={header.headerContent.avatar}
                  alt="User Profile"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "101%",
                  }}
                />
              </Button>
            </Popover>
          </div>
        </div>

        <div>
          <Modal
            title="Reset my password"
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
            }}
            footer={null}
          >
            <div>
              <div className={styles.formDiv}>
                <form
                  className=" card-body form-floating mt-3 mx-1"
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="off"
                >
                  <div className="container mb-3">
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="text"
                        name="currentPassword"
                        id="currentPassword"
                        placeholder="Current Password "
                        {...register("currentPassword")}
                      ></input>
                      <label className="form-label" htmlFor="currentPassword">
                        {" "}
                        Current Password
                      </label>
                      {errors.currentPassword && (
                        <p>{errors.currentPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="container mb-3">
                    <div className="form-floating ">
                      <input
                        className="form-control"
                        type={passwordShown ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        placeholder="newPassword"
                        {...register("newPassword")}
                        style={{ paddingRight: "30px" }}
                      />
                      <div onClick={togglePassword} className={iconstyles.icon}>
                        {passwordShown ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </div>
                      <label className="form-label" htmlFor="newPassword">
                        New Password
                      </label>
                      {errors.newPassword && (
                        <p>{errors.newPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="container mb-3">
                    <div
                      style={{
                        marginTop: "50px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button className="btn btn-primary">Submit</button>
                    </div>
                  </div>
                </form>
                <br />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Header;