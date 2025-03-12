import React, { useState } from "react";
import Header from "./Header";
import styles from "../styles/HomePage.module.css";
import headerStyles from "./header.module.css";
import { useLocation, useNavigate } from "react-router-dom";
function Layout() {
  const navigate = useNavigate();

  const location = useLocation();
  const path = location?.pathname;

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
  const myCollections = () => {
    navigate("/collections");
  };

  return (
    <div>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div style={{ marginTop: "80px", marginBottom: "-5%" }}>
        <div className={headerStyles.layoutMenuDiv}>
          <div className="column">
            <button
              className={
                path.includes("/home")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={myHome}
            >
              Home
            </button>
            <button
              className={
                path.includes("/services")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={services}
            >
              Show Services
            </button>
          </div>
          <div className="column">
            <button
              className={
                path.includes("/tagcontent")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={myTag}
            >
              Add content
            </button>
            <button
              className={
                path.includes("/collection")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={myCollection}
            >
              Create Collection
            </button>
          </div>
          <div className="column">
            <button
              className={
                path.includes("/uploadCSV")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={uploadCSV}
            >
              Add content via CSV
            </button>
            <button
              className={
                path.includes("/content")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={myCourses}
            >
              My Content
            </button>
          </div>
          <div className="column">
            <button
              className={
                path.includes("/collections")
                  ? headerStyles.selected
                  : headerStyles.anchor
              }
              onClick={myCollections}
            >
              My Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
