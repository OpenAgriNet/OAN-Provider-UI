import React, { useEffect } from "react";
import Header from "../components/Header";
import headerStyles from "../styles/tagContent.module.css";
import styles from "../styles/HomePage.module.css";
import imagePath from "../assets/landing-image.png";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { home, colors } from "../config/ICAR-Config";

function HomePage() {
  const userName = localStorage.getItem("user");

  const navigate = useNavigate();
  const myTag = () => {
    navigate("/tagcontent");
  };
  const myList = () => {
    navigate("/content");
  };
  return (
    <div>
      <div className={headerStyles.headerDiv}>
        <Header />
      </div>
      {/* <div>
        <Layout />
      </div> */}
      <div className={styles.container} style={{ marginTop: "70px" }}>
        <div>
          <div>
            <h2 className={styles.welcomeName}>{home.heading1}</h2>
          </div>
          <div>
            <h3 className={styles.register}>{home.heading2}</h3>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "10px" }}>
              <button
                className={styles.registerButton}
                onClick={myTag}
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
                {home.button.button1}
              </button>
            </div>
            <div>
              <button
                className={styles.registerButton}
                onClick={myList}
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
                {home.button.button2}
              </button>
            </div>
          </div>
        </div>
        <div>
          {/* <img src={imagePath} style={{ width: "700px", height: "auto" }} /> */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
