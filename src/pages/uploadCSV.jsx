import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/HomePage.module.css";
import { useForm, Controller } from "react-hook-form";
import Footer from "../components/Footer";
import { uploadCSV } from "../api/Adminapi";
import { Alert, Button, Space } from "antd";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { colors, uploadCsv } from "../config/ICAR-Config";

function CsvUploadForm() {
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm();
  const [alertMessage, setAlertMessage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const showAlert = () => {
    setAlertMessage(true);

    setTimeout(() => {
      setAlertMessage(false);
    }, 2000);
  };

  const handleShowAlert = () => {
    showAlert();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedFile) {
        const response = await uploadCSV({ file: selectedFile });
        if (response[0]?.data) {
          handleShowAlert();
          reset();
        } else {
          alert(response?.error || response[0]?.errors[0]?.message);
        }
      }
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div
        style={{
          marginTop: "120px",
          display: "flex",
          marginLeft: "20px",
          justifyContent: "flex-start",
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            navigate("/content");
          }}
          style={{
            backgroundColor: colors.backButton.default,
            color: colors.backButton.text,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.backButton.hover;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.backButton.default;
          }}
        >
          {colors.backButton.title}
        </Button>
      </div>
      <div
        className={styles.container}
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {alertMessage ? (
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                  zIndex: "999",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Alert
                  message="Uploaded Successfully"
                  type="success"
                  showIcon
                  closable
                />
              </Space>
            ) : null}
          </div>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <div>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <input
                    className="form-control"
                    type="file"
                    id="file"
                    {...field}
                    onChange={handleFileChange}
                    style={{ border: "1px solid black" }}
                  />
                )}
              />
            </div>
            <div style={{ marginLeft: "50px" }}>
              <button
                style={{
                  padding: "5px 5px",
                  backgroundColor: uploadCsv.button.uploadbutton.buttonColor,
                  color: uploadCsv.button.uploadbutton.buttonTextColor,
                  border: `1px solid ${uploadCsv.button.uploadbutton.buttonColor}`,
                  borderRadius: "5px",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor =
                    uploadCsv.button.uploadbutton.buttonHoverColor;
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor =
                    uploadCsv.button.uploadbutton.buttonColor;
                }}
                type="submit"
              >
                {uploadCsv.button.uploadbutton.title}
              </button>
            </div>
            <div
              style={{
                marginLeft: "50px",
              }}
            >
              <a
                href={`${uploadCsv.sampleCsv.sampleCsvLink}`}
                download="sample.csv"
                style={{ color: uploadCsv.sampleCsv.sampleCsvLinkColor }}
              >
                {uploadCsv.sampleCsv.sampleCsvLinkText}
              </a>
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

export default CsvUploadForm;
