import styles from "../styles/tagContent.module.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { createContentApi, uploadImage } from "../api/Adminapi";
import Layout from "../components/Layout";
import { Button, Col, Row } from "antd";
import Select from "react-select";
import * as yup from "yup";
import { publishContent, colors } from "../config/ICAR-Config";
import Swal from "sweetalert2";
import { getCategoriesApi } from "../api/CategoryApi";
import { getFulfillmentsApi } from "../api/FulfillmentApi";
import { getLocationsApi } from "../api/LocationApi";

const TagContent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fulfillments, setFulfillments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesApi();
        // data.categories is the array returned by your API
        const dropdownOptions = data.categories.map((cat) => ({
          value: cat.id, // Using 'id' as the value
          label: cat.name, // Using 'name' as the display label
        }));
        setCategories(dropdownOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch fulfillments
    const fetchFulfillments = async () => {
      try {
        const data = await getFulfillmentsApi();
        // data.fulfillments is the array returned by your API
        const dropdownOptions = data.fulfillments.map((ful) => ({
          value: ful.id,
          label: ful.type,
        }));
        setFulfillments(dropdownOptions);
      } catch (error) {
        console.error("Error fetching fulfillments:", error);
      }
    };
    const fetchLocations = async () => {
      try {
        const data = await getLocationsApi();
        // data.locations is the array returned by the API
        setLocations(data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchCategories();
    fetchFulfillments();
    fetchLocations();
  }, []);

  const navigate = useNavigate();

  // Compute distinct states from locations
  const distinctStates = useMemo(() => {
    const stateSet = new Set();
    locations.forEach((loc) => stateSet.add(loc.state_name));
    return [...stateSet].map((state) => ({
      value: state,
      label: state,
    }));
  }, [locations]);

  // Compute city options based on the selected state
  const cityOptions = useMemo(() => {
    if (!selectedState) return [];
    const cityMap = new Map();
    locations.forEach((loc) => {
      if (loc.state_name === selectedState) {
        if (!cityMap.has(loc.city_name)) {
          cityMap.set(loc.city_name, {
            value: loc.id, // we use the location id
            label: loc.city_name,
          });
        }
      }
    });
    return Array.from(cityMap.values());
  }, [locations, selectedState]);

  // Updated validation schema with new required fields
  const validationSchema = yup.object().shape({
    id: yup.string().required("ID is required"),
    provider_id: yup.string().required("Provider ID is required"),
    title: yup.string().required("Title is required"),
    // Use the correct field names here:
    short_desc: yup.string().required("Short Description is required"),
    long_desc: yup.string().required("Long Description is required"),
    item_img: yup.mixed().required("Item image is required"),
    media_url: yup
      .string()
      .url("Enter a valid URL")
      .required("Media URL is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    try {
      // Construct the payload
      const payload = {
        items: {
          id: data.id,
          provider_id: data.provider_id,
          name: data.title,
          short_desc: data.short_desc,
          long_desc: data.long_desc,
        },
        item_categories: [
          {
            category_id: data.item_categories,
          },
        ],
        item_fulfillments: [
          {
            fulfillment_id: data.item_fulfillments,
          },
        ],
        item_locations: [
          {
            location_id: data.item_location_city,
          },
        ],
        item_images: [{}],
        item_medias: [
          {
            mimetype: data.item_medias,
            url: data.media_url,
          },
        ],
      };

      // If user uploads an image:
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const imageUploadResponse = await uploadImage(formData);
        payload.item_images[0].url = imageUploadResponse?.key || "";
        payload.item_images.url = imageUploadResponse?.key;
      }
      // Make the API call
      const result = await createContentApi(payload);

      // Check if the API indicates success or failure
      // (Adjust the condition based on your API's actual response format)
      if (result?.status && result.status !== 200) {
        // Show an error popup
        Swal.fire({
          title: "Error!",
          text: result.error || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#3e6139",
        });
      } else {
        // Show a success popup
        Swal.fire({
          title: "Content Created!",
          text: "Your content has been successfully created.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3e6139",
        }).then((swalResult) => {
          if (swalResult.isConfirmed) {
            navigate("/content");
          }
        });
      }
    } catch (error) {
      console.error("Error creating content:", error);
      Swal.fire({
        title: "Error!",
        text: error?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3e6139",
      });
    }
  };

  // Get all allowed field keys from config (includes new fields)
  const allowedFields = Object.keys(publishContent.formFields);

  // Split the allowedFields array into two parts for two columns
  const middleIndex = Math.ceil(allowedFields.length / 2);
  const firstColumnFields = allowedFields.slice(0, middleIndex);
  const secondColumnFields = allowedFields.slice(middleIndex);

  const renderField = (fieldKey, fieldConfig) => {
    const fieldError = errors[fieldKey];

    switch (fieldConfig.type) {
      case "text":
      case "date":
        return (
          <div className="container mb-3" key={fieldKey}>
            <div className="form-floating">
              <input
                className={`form-control ${fieldError ? "is-invalid" : ""}`}
                type={fieldConfig.type}
                name={fieldKey}
                id={fieldKey}
                placeholder={fieldConfig.placeholder}
                {...register(fieldKey)}
              />
              <label className="form-label" htmlFor={fieldKey}>
                {fieldConfig.label}
              </label>
              {fieldError && (
                <p style={{ color: "red" }}>{fieldError.message}</p>
              )}
            </div>
          </div>
        );
      case "textarea":
        return (
          <div className="container mb-3" key={fieldKey}>
            <div className="form-floating mb-3">
              <textarea
                className={`form-control ${fieldError ? "is-invalid" : ""}`}
                name={fieldKey}
                id={fieldKey}
                {...register(fieldKey)}
                style={{ height: "150px" }}
                placeholder={fieldConfig.placeholder}
              ></textarea>
              <label className="form-label" htmlFor={fieldKey}>
                {fieldConfig.label}
              </label>
              {fieldError && (
                <p style={{ color: "red" }}>{fieldError.message}</p>
              )}
            </div>
          </div>
        );
      case "file":
        return (
          <div className="container mb-3" key={fieldKey}>
            <div className="form-floating">
              <Controller
                name={fieldKey}
                control={control}
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <input
                    className={`form-control ${fieldError ? "is-invalid" : ""}`}
                    type="file"
                    id={fieldKey}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0]);
                      onChange(e.target.files[0]);
                    }}
                    style={{
                      border: fieldError
                        ? "1px solid red"
                        : "1px solid #d9d9d9",
                    }}
                  />
                )}
              />
              <label className="form-label" htmlFor={fieldKey}>
                {fieldConfig.label}
              </label>
              {fieldError && (
                <p style={{ color: "red" }}>{fieldError.message}</p>
              )}
            </div>
          </div>
        );
      case "select":
        return (
          <div className="container mb-3" key={fieldKey}>
            <div className="form-floating">
              <select
                className={`form-select ${fieldError ? "is-invalid" : ""}`}
                name={fieldKey}
                id={fieldKey}
                {...register(fieldKey)}
              >
                {fieldConfig.options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label className="form-label" htmlFor={fieldKey}>
                {fieldConfig.label}
              </label>
              {fieldError && (
                <p style={{ color: "red" }}>{fieldError.message}</p>
              )}
            </div>
          </div>
        );
      case "selectDynamic":
        if (fieldKey === "item_categories") {
          return (
            <div className="container mb-3" key={fieldKey}>
              <div className="form-floating">
                <select
                  className={`form-select ${fieldError ? "is-invalid" : ""}`}
                  name={fieldKey}
                  id={fieldKey}
                  {...register(fieldKey)}
                >
                  <option value="">Select a Category</option>
                  {categories.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor={fieldKey}>
                  {fieldConfig.label}
                </label>
                {fieldError && (
                  <p style={{ color: "red" }}>{fieldError.message}</p>
                )}
              </div>
            </div>
          );
        }
        if (fieldKey === "item_fulfillments") {
          return (
            <div className="container mb-3" key={fieldKey}>
              <div className="form-floating">
                <select
                  className={`form-select ${fieldError ? "is-invalid" : ""}`}
                  name={fieldKey}
                  id={fieldKey}
                  {...register(fieldKey)}
                >
                  <option value="">Select a Fulfillment</option>
                  {fulfillments.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor={fieldKey}>
                  {fieldConfig.label}
                </label>
                {fieldError && (
                  <p style={{ color: "red" }}>{fieldError.message}</p>
                )}
              </div>
            </div>
          );
        }
        if (fieldKey === "item_location_state") {
          return (
            <div className="container mb-3" key={fieldKey}>
              <div className="form-floating">
                <select
                  className={`form-select ${fieldError ? "is-invalid" : ""}`}
                  name={fieldKey}
                  id={fieldKey}
                  // Capture the state selection change and update selectedState
                  {...register(fieldKey, {
                    onChange: (e) => {
                      setSelectedState(e.target.value);
                      // Also, reset city field value if needed
                      setValue("item_location_city", "");
                    },
                  })}
                >
                  <option value="">Select State</option>
                  {distinctStates.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor={fieldKey}>
                  {fieldConfig.label}
                </label>
                {fieldError && (
                  <p style={{ color: "red" }}>{fieldError.message}</p>
                )}
              </div>
            </div>
          );
        }
        if (fieldKey === "item_location_city") {
          return (
            <div className="container mb-3" key={fieldKey}>
              <div className="form-floating">
                <select
                  className={`form-select ${fieldError ? "is-invalid" : ""}`}
                  name={fieldKey}
                  id={fieldKey}
                  {...register(fieldKey)}
                >
                  <option value="">Select City</option>
                  {cityOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor={fieldKey}>
                  {fieldConfig.label}
                </label>
                {fieldError && (
                  <p style={{ color: "red" }}>{fieldError.message}</p>
                )}
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, #FFFFFF, #EFDA2F)" }}>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className="container" style={{ marginTop: "120px" }}>
        <div className={styles.outerdiv}>
          <Button
            type="primary"
            onClick={() => navigate("/content")}
            style={{
              backgroundColor: colors.primaryButtonColor.default,
              color: colors.primaryButtonColor.text,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryButtonColor.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                colors.primaryButtonColor.default;
            }}
          >
            ← Back
          </Button>
        </div>
        <div>
          <h6 style={{ color: "#3E6139", fontSize: "14px" }}>
            {publishContent.titles.mainTitle}
          </h6>
        </div>
        <div
          className="card mb-2"
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: "10px",
          }}
        >
          <h6 style={{ color: "gray", fontSize: "14px" }}>
            {publishContent.titles.formTitle}
          </h6>
          <form
            className="card-body form-floating mt-3 mx-1"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Row>
              <Col span={12}>
                {firstColumnFields.map((fieldKey) => (
                  <div key={fieldKey}>
                    {renderField(fieldKey, publishContent.formFields[fieldKey])}
                  </div>
                ))}
              </Col>
              <Col span={12}>
                {secondColumnFields.map((fieldKey) => (
                  <div key={fieldKey}>
                    {renderField(fieldKey, publishContent.formFields[fieldKey])}
                  </div>
                ))}
              </Col>
            </Row>
            <div className="mb-3">
              <div className={styles.formbutton}>
                <div className={styles.submit}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      borderColor: "#3e6139",
                      backgroundColor: colors.primaryButtonColor.default,
                      color: colors.primaryButtonColor.text,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        colors.primaryButtonColor.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor =
                        colors.primaryButtonColor.default;
                    }}
                  >
                    {publishContent.buttons.submit.label}
                  </button>
                </div>
                <div className={styles.submit}>
                  <Button
                    style={{
                      height: "100%",
                      backgroundColor: colors.secondaryButtonColor.default,
                      borderColor: colors.secondaryButtonColor.borderColor,
                      color: colors.secondaryButtonColor.text,
                    }}
                    className="btn btn-danger"
                    onClick={() => reset()}
                  >
                    {publishContent.buttons.reset.label}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default TagContent;
