import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Modal,
  Table,
  Popconfirm,
  Divider,
  Col,
  Row,
  Alert,
  Space,
} from "antd";
import { yupResolver } from "@hookform/resolvers/yup";

import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Layout from "../components/Layout";
import styles from "../styles/HomePage.module.css";
import { useForm, Controller } from "react-hook-form";
import Footer from "../components/Footer";
import { useNavigate } from "react-roter-dom";
import getDropdownValues from "../api/getApi";
import {
  createNewCollection,
  createNewContentCollection,
  getCollectionList,
  getContent,
  getCollectionInfo,
  deleteCurrentContentCollection,
  uploadImage,
} from "../api/Adminapi";
import CollectionSchema from "../schema/CollectionSchema";
import Header from "../components/Header";

function MyCollection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [success, setSuccess] = useState(false); //for re rendering/refresh after adding content successfully
  const [domain, setDomain] = useState();
  const [dataFetched, setDataFetched] = useState(false);
  const [curricular, setCurricular] = useState();
  const [competency, setCompetency] = useState();
  const [learningOutcome, setLearningOutcome] = useState();
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionLists, setcollectionLists] = useState([]);
  const [myContentData, setmyContentData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectCollection, setSelectCollection] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [collectionId, setcollectionId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(false);
  let filteredArray = [];

  const navigate = useNavigate();
  useEffect(() => {
    collectionListData();
    MyContent();
  }, []);

  const MyContent = async () => {
    try {
      let response = await getContent();
      if (response) {
        let data = response?.map((item, index) => ({
          ...item,
          key: index + 1,
        }));
        setmyContentData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const collectionListData = async () => {
    let response = await getCollectionList();
    setcollectionLists(response);
  };
  const handleSelectChange = async (event) => {
    try {
      const selectedId = event.target.value;
      setcollectionId(selectedId);
      let response = await getCollectionInfo(selectedId);
      setSelectCollection(response?.collectionContentRelation);
    } catch (error) {
      throw error;
    }
  };

  if (selectCollection) {
    filteredArray = myContentData.filter((item) => {
      return !selectCollection.some((row) => row?.content_id === item?.id);
    });
  } else {
    filteredArray = myContentData;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    control,
  } = useForm({ resolver: yupResolver(CollectionSchema) });

  useEffect(() => {
    getValues();
  }, []);

  const getValues = async () => {
    const result = await getDropdownValues();
    // console.log(result?.data?.result?.framework?.categories, "res");
    setDomain(result?.data?.result?.framework?.categories[0]?.terms);
    setCurricular(result?.data?.result?.framework?.categories[1]?.terms);
    setCompetency(result?.data?.result?.framework?.categories[2]?.terms);
    setLearningOutcome(result?.data?.result?.framework?.categories[3]?.terms);
  };

  const showAlert = () => {
    setAlertMessage(true);

    setTimeout(() => {
      setAlertMessage(false);
    }, 2000);
  };

  const handleShowAlert = () => {
    showAlert();
  };
  const onSubmit = async (data) => {
    try {
      const collection_id = data?.collection_id;
      const content_id = data?.content_id;
      const dataArray = content_id?.map((contentId) => ({
        collection_id: collection_id,
        content_id: contentId,
      }));

      let promises = [];
      dataArray.forEach((item) => {
        promises.push(createNewContentCollection(item));
      });

      const results = await Promise.all(promises);

      if (results.every((result) => result?.data?.insert_contents)) {
        // alert("Content collection created Successfully");
        setSelectedRowKeys([]);
        setIsModalOpen(false);
        reset();
        handleShowAlert();
      } else {
        alert("Please select the options");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Please select one options");
    }
  };

  const onSubmitCollection = async (data) => {
    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("file", selectedFile);
        const imageUploadResponse = await uploadImage(formData);
        data.icon = imageUploadResponse?.key;
        data.mimeType = imageUploadResponse?.mimetype;
      }

      let response = await createNewCollection(data);
      if (response?.data?.insert_collection) {
        // alert("Collection Created successfully");
        setCollectionOpen(false);
        reset2();
        collectionListData();
        handleShowAlert();
      } else {
        alert("Try Again");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let tableData = [
    {
      title: "Content Id",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Search by title"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record?.title?.toLowerCase().includes(value?.toLowerCase());
      },
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #FCF8F5)",
      }}
    >
      <div className={styles.headerDiv}>
        <Header />
      </div>

      <div className="container" style={{ marginTop: "120px" }}>
        <div className={styles.outerdiv}>
          <Button
            type="primary"
            onClick={() => {
              navigate("/collections");
            }}
            style={{ background: "#ffa500" }}
          >
            ← Back
          </Button>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
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
                message="Created Sucessfully"
                type="success"
                showIcon
                closable
              />
            </Space>
          ) : null}
        </div>

        <div
          className="card mb-2"
          style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
        >
          {" "}
          <h6 style={{ color: "gray" }}>Create a new Collection</h6>
          <form
            className=" card-body form-floating mt-3 mx-1"
            onSubmit={handleSubmit2(onSubmitCollection)}
            autoComplete="off"
          >
            <div className="mb-3">
              <Row>
                <Col span={12}>
                  <div className="container mb-3">
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="text"
                        name="title"
                        id="title"
                        placeholder="title"
                        {...register2("title")}
                      ></input>
                      <label className="form-label" htmlFor="title">
                        Collection Name
                      </label>
                      {errors2.title && (
                        <p style={{ color: "red" }}>{errors2.title.message}</p>
                      )}
                    </div>
                    <br />
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Description"
                        {...register2("description")}
                      ></input>
                      <label className="form-label" htmlFor="description">
                        Collection Description
                      </label>
                      {errors2.description && (
                        <p style={{ color: "red" }}>
                          {errors2.description.message}
                        </p>
                      )}
                    </div>
                    <br />

                    <div className="form-floating">
                      <Controller
                        name="file"
                        control={control}
                        render={({ field }) => (
                          <input
                            className="form-control"
                            type="file"
                            id="file"
                            {...field}
                            onChange={(e) => {
                              setSelectedFile(e.target.files[0]);
                            }}
                            style={{ border: "1px solid black" }}
                          />
                        )}
                      />
                      <label className="form-label" htmlFor="icon">
                        Icon
                      </label>
                      {errors.image && (
                        <p style={{ color: "red" }}>{errors.image.message}</p>
                      )}
                    </div>
                    <br />
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="text"
                        name="publisher"
                        id="publisher"
                        placeholder="Publisher"
                        {...register2("publisher")}
                      ></input>
                      <label className="form-label" htmlFor="publisher">
                        Publisher
                      </label>
                      {errors2.publisher && (
                        <p style={{ color: "red" }}>
                          {errors2.publisher.message}
                        </p>
                      )}
                    </div>
                    <br />
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="text"
                        name="author"
                        id="author"
                        placeholder="Author"
                        {...register2("author")}
                      ></input>
                      <label className="form-label" htmlFor="author">
                        Author
                      </label>
                      {errors2.author && (
                        <p style={{ color: "red" }}>{errors2.author.message}</p>
                      )}
                    </div>
                    <br />
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="number"
                        name="minAge"
                        id="minAge"
                        placeholder="minAge"
                        {...register2("minAge")}
                      ></input>
                      <label className="form-label" htmlFor="minAge">
                        Min Age
                      </label>
                      {errors2.minAge && (
                        <p style={{ color: "red" }}>{errors2.minAge.message}</p>
                      )}
                    </div>
                    <br />
                    <div className="form-floating">
                      <input
                        className="form-control"
                        type="number"
                        name="maxAge"
                        id="maxAge"
                        placeholder="maxAge"
                        {...register2("maxAge")}
                      ></input>
                      <label className="form-label" htmlFor="maxAge">
                        Max Age
                      </label>
                      {errors2.maxAge && (
                        <p style={{ color: "red" }}>{errors2.maxAge.message}</p>
                      )}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="container mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="language"
                        id="language"
                        {...register2("language")}
                        style={{ marginTop: "0px" }}
                      >
                        <option value="">Select a Language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Assamese">Assamese</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Kannada">Kannada</option>
                      </select>
                      {errors2.language && (
                        <p style={{ color: "red" }}>
                          {errors2.language.message}
                        </p>
                      )}
                      <label className="form-label" htmlFor="language">
                        Language
                      </label>
                    </div>
                    <br />
                    <div className="form-floating ">
                      <select
                        className="form-select"
                        name="category"
                        id="category"
                        {...register2("category")}
                      >
                        <option value="">Select a category</option>
                        <option value="Toys and puppets">
                          Toys and puppets
                        </option>
                        <option value="Puzzles and games">
                          Puzzles and games
                        </option>
                        <option value="Stories and poems">
                          Stories and poems
                        </option>
                        <option value="Flashcards and sequence cards">
                          Flashcards and sequence cards
                        </option>
                        <option value="Activity Sheets">Activity Sheets</option>
                        <option value="Manuals and Guidebooks">
                          Manuals and Guidebooks
                        </option>
                      </select>
                      {errors2.category && (
                        <p style={{ color: "red" }}>
                          {errors2.category.message}
                        </p>
                      )}
                      <label className="form-label" htmlFor="category">
                        Category
                      </label>
                    </div>
                    <br />
                    <div className="form-floating ">
                      <select
                        className="form-select"
                        name="themes"
                        id="themes"
                        {...register2("themes")}
                      >
                        <option value="">Select a Theme</option>
                        <option value="Audio">Audio</option>
                        <option value="Video">Video</option>
                        <option value="Read">Read</option>
                        <option value="Others">Others</option>
                      </select>
                      {errors2.themes && (
                        <p style={{ color: "red" }}>{errors2.themes.message}</p>
                      )}
                      <label className="form-label" htmlFor="themes">
                        Themes
                      </label>
                    </div>

                    <br />
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="domain"
                        id="domain"
                        {...register2("domain")}
                      >
                        <option value="">Choose a Domain</option>
                        {domain?.map((options, index) => {
                          return (
                            <option value={options?.name} key={index}>
                              {options?.description}
                            </option>
                          );
                        })}
                      </select>
                      {errors2.domain && (
                        <p style={{ color: "red" }}>{errors2.domain.message}</p>
                      )}
                      <label className="form-label" htmlFor="domain">
                        Domain
                      </label>
                    </div>
                    <br />
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="goal"
                        id="goal"
                        {...register2("curricularGoals")}
                      >
                        <option value="">Select a Curricular Goal</option>
                        {curricular?.map((options, index) => {
                          return (
                            <option value={options?.name} key={index}>
                              {options?.description}
                            </option>
                          );
                        })}
                      </select>
                      {errors2.goal && (
                        <p style={{ color: "red" }}>{errors2.goal.message}</p>
                      )}
                      <label className="form-label" htmlFor="goal">
                        Curricular Goals
                      </label>
                    </div>
                  </div>
                  <br />

                  <div className="container mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="competency"
                        id="competency"
                        {...register2("competency")}
                      >
                        <option value="">Select a Competency</option>
                        {competency?.map((options, index) => {
                          return (
                            <option value={options?.name} key={index}>
                              {options?.description}
                            </option>
                          );
                        })}
                      </select>
                      {errors2.competency && (
                        <p style={{ color: "red" }}>
                          {errors2.competency.message}
                        </p>
                      )}
                      <label className="form-label" htmlFor="domain">
                        Competency
                      </label>
                    </div>
                    <div className={styles.formFieldInline}>
                      <a href="http://20.219.197.218/explore/" target="_blank">
                        Click here to know about competencies
                      </a>
                    </div>
                  </div>
                  <br />
                  <div className="container mb-3">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="learningObjectives"
                        id="learningObjectives"
                        {...register2("learningObjectives")}
                      >
                        <option value="">Choose a Learning Objective</option>
                        {learningOutcome?.map((options, index) => {
                          return (
                            <option value={options?.name} key={index}>
                              {options?.description}
                            </option>
                          );
                        })}
                      </select>

                      <label
                        className="form-label"
                        htmlFor="learningObjectives"
                      >
                        {" "}
                        Learning objectives
                      </label>
                      {errors2.learningObjectives && (
                        <p style={{ color: "red" }}>
                          {errors2.learningObjectives.message}
                        </p>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              <div className={styles.formbutton}>
                <div>
                  <Button
                    className="btn btn-secondary"
                    onClick={() => {
                      setCollectionOpen(false);
                      reset2();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    className="btn btn-danger"
                    onClick={() => {
                      reset2();
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
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
                message="Created Sucessfully"
                type="success"
                showIcon
                closable
              />
            </Space>
          ) : null}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default MyCollection;
