import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Layout from "../components/Layout";
import styles from "../styles/HomePage.module.css";
import { useForm, Controller } from "react-hook-form";
import Footer from "../components/Footer";

function ShowServices() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Handle the file upload here
    console.log("Uploaded file:", data.file[0]);
  };

  return (
    <div>
      <div>
        <Layout />
      </div>
      <div
        className={styles.container}
        style={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div>
              <b>
                <label htmlFor="file">Work in Progress </label>
              </b>
              {"  "}
            </div>
          </div>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default ShowServices;
