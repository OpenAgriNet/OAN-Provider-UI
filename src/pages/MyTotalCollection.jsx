import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import {
  deleteCurrentContentCollection,
  getCollectionInfo,
  getCollectionList,
  getContent,
  deleteCollection,
  uploadImage,
  updateCollection,
} from "../api/Adminapi";
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
  Image,
  Popover,
} from "antd";
import styles from "../styles/HomePage.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CollectionSchema from "../schema/CollectionSchema";
import getDropdownValues from "../api/getApi";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import moment from "moment";

function MyTotalCollection() {
  const navigate = useNavigate();

  const [collectionLists, setcollectionLists] = useState([]);
  const [myContentData, setmyContentData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [selectCollection, setSelectCollection] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [collectionId, setcollectionId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(false);
  const [successMessage, setsuccessMessage] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [domain, setDomain] = useState();
  const [curricular, setCurricular] = useState();
  const [competency, setCompetency] = useState();
  const [learningOutcome, setLearningOutcome] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showMyContent, setShowMyContent] = useState(false);

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
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    control,
  } = useForm({
    defaultValues: {
      icon: formData?.icon,
      domain: formData?.domain,
      description: formData?.description,
      curricularGoals: formData?.curricularGoals,
      language: formData?.language,
      learningObjectives: formData?.learningObjectives,
      maxAge: formData?.maxAge,
      minAge: formData?.minAge,
      publisher: formData?.publisher,
      themes: formData?.themes,
      title: formData?.title,
      provider_id: formData?.provider_id,
      competency: formData?.competency,
      author: formData?.author,
      category: formData?.category,
    },
  });
  // console.log(formData, "formData");
  useEffect(() => {
    collectionListData();
    MyContent();
  }, []);

  const showAlert = () => {
    setAlertMessage(true);

    setTimeout(() => {
      setAlertMessage(false);
    }, 2000);
  };

  const showSuccessAlert = () => {
    setsuccessMessage(true);

    setTimeout(() => {
      setsuccessMessage(false);
    }, 2000);
  };
  const handleShowAlert = () => {
    showAlert();
  };
  const handleShowSuccessAlert = () => {
    showSuccessAlert();
  };

  const onSubmitCollection = async (data) => {
    try {
      const formdata = new FormData();

      if (selectedFile) {
        formdata.append("file", selectedFile);
        const imageUploadResponse = await uploadImage(formdata);
        data.icon = imageUploadResponse?.key;
        data.mimeType = imageUploadResponse?.mimetype;
        setSelectedFile(null);
      } else {
        data.icon = formData?.icon;
      }

      let response = await updateCollection(collectionId, data);
      if (response?.data?.update_collection) {
        // alert("Collection Created successfully");

        setCollectionOpen(false);
        reset2();
        collectionListData();
        handleShowSuccessAlert();
        setFormData(response?.data?.update_collection?.returning[0]);
        // alert("Success");
      } else {
        alert("Try Again");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handledelete = async (user) => {
    let response = await deleteCurrentContentCollection(user?.id);
    if (response?.delete_contents) {
      handleShowAlert();
      let response = await getCollectionInfo(collectionId);
      setSelectCollection(response?.collectionContentRelation);
    }
  };
  const handleSelectChange = async (event) => {
    try {
      const selectedId = event?.id;
      setcollectionId(selectedId);
      let response = await getCollectionInfo(selectedId);
      setFormData(response);
      setSelectCollection(response?.collectionContentRelation);
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = async (event) => {
    try {
      const selectedId = event?.id;
      setCollectionOpen(true);
      setcollectionId(selectedId);
      let response = await getCollectionInfo(selectedId);
      setFormData(response);
      setSelectCollection(response?.collectionContentRelation);
    } catch (error) {
      throw error;
    }
  };
  const deleteCollectionData = async () => {
    try {
      if (collectionId) {
        let response = await deleteCollection(collectionId);
        if (response?.data) {
          collectionListData();
          setCollectionOpen(false);
          handleShowAlert();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
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
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => b.id < a.id,
      sortOrder: "descend",
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
      render: (value, record) => (
        <span>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            size="xs"
            onClick={() => {
              handleEdit(record);
            }}
          >
            {value}
          </button>
        </span>
      ),
    },
    {
      title: "Domain",
      dataIndex: "domain",
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
              placeholder="Search by domain"
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
        return record?.domain?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    {
      title: "Language",
      dataIndex: "language",
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
              placeholder="Search by language"
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
        return record?.language?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        if (!text) {
          return <span>{""}</span>;
        }
        const formattedDate = moment(text).format("DD-MM-YYYY");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "View",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <span>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            size="xs"
            onClick={() => {
              handleSelectChange(value);
              setShowMyContent(true);
            }}
          >
            View
          </button>
        </span>
      ),
    },
  ];

  let collectiontableData = [
    {
      title: "Title",
      dataIndex: ["contentFlncontentRelation", "title"],

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
        return record?.contentFlncontentRelation?.title
          ?.toLowerCase()
          .includes(value?.toLowerCase());
      },
    },

    {
      title: "Domain",
      dataIndex: ["contentFlncontentRelation", "domain"],

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
              placeholder="Search by Domain"
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
        return record?.contentFlncontentRelation?.domain
          ?.toLowerCase()
          .includes(value?.toLowerCase());
      },
    },
    {
      title: "Language",
      dataIndex: ["contentFlncontentRelation", "language"],

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
              placeholder="Search by language"
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
        return record?.contentFlncontentRelation?.language
          ?.toLowerCase()
          .includes(value?.toLowerCase());
      },
    },
    {
      title: "Goal",
      dataIndex: ["contentFlncontentRelation", "goal"],

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
              placeholder="Search by goal"
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
        return record?.contentFlncontentRelation?.goal
          ?.toLowerCase()
          .includes(value?.toLowerCase());
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <span>
          {/* <Button
            size="xs"
            color="blue.600"
            // onClick={() => {
            //   showUsers(value);
            //   setshowEditModal(true);
            // }}
          >
            Edit
          </Button> */}

          <Popconfirm
            placement="top"
            title="Are you sure delete?"
            onConfirm={() => {
              handledelete(value);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleOptionClick = (option) => {
    if (option === "add") {
      // setIsModalOpen(true);
    } else if (option === "delete") {
      // Handle the "Delete" action
    }
  };
  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <Button
        type="primary"
        onClick={() => {
          handleOptionClick("add");
          if (collectionId) {
            setCollectionOpen(true);
          } else {
            alert("Please select a collection to edit");
          }
        }}
      >
        Edit this collection
      </Button>
      <Popconfirm
        placement="top"
        title="Are you sure delete?"
        onConfirm={() => {
          handleOptionClick("delete");
          if (collectionId) {
            deleteCollectionData();
          } else {
            alert("Please select a collection to delete");
          }
        }}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" danger>
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
  return (
    <div>
      <div>
        <Header />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "120px",
          justifyContent: "flex-end",
        }}
      >
        {/* <select
          className="form-select"
          name="collections"
          id="collections"
          onChange={handleSelectChange}
          style={{ fontSize: "14px", width: "40%" }}
        >
          <option value="">Choose a Collection</option>
          {collectionLists?.map((options, index) => {
            return (
              <option value={options?.id} key={index}>
                {options?.title}
              </option>
            );
          })}
        </select> */}

        <div>
          <a
            className={styles.anchor}
            onClick={() => {
              navigate("/collection");
            }}
          >
            New
          </a>
        </div>
        {/* <div>
          {collectionOpen ? null : (
            <Popover
              placement="bottom"
              content={content}
              title="Actions"
              trigger="click"
            >
              <a className={styles.anchor}>Actions ⬇️ </a>
            </Popover>
          )}
        </div> */}
      </div>
      <div
        className={styles.collectionContainer}
        style={{
          marginTop: "20px",
        }}
      >
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
                message="Deleted successfully"
                type="success"
                showIcon
                closable
              />
            </Space>
          ) : null}
          {successMessage ? (
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
                message="Updated successfully"
                type="success"
                showIcon
                closable
              />
            </Space>
          ) : null}
        </div>
        <div>
          <Table columns={columns} dataSource={collectionLists} />
        </div>
        <div>
          <Modal
            title="Create a collection"
            open={collectionOpen}
            onCancel={() => {
              setCollectionOpen(false);
              reset2();
            }}
            footer={false}
            width={1000}
          >
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
                          defaultValue={formData?.title}
                        ></input>
                        <label className="form-label" htmlFor="title">
                          Collection Name
                        </label>
                        {errors2.title && <p>{errors2.title.message}</p>}
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
                          defaultValue={formData?.description}
                        ></input>
                        <input
                          className="form-control"
                          type="text"
                          name="provider_id"
                          id="provider_id"
                          placeholder="provider_id"
                          {...register2("provider_id")}
                          defaultValue={formData?.provider_id}
                          hidden
                        ></input>
                        <label className="form-label" htmlFor="description">
                          Collection Description
                        </label>
                        {errors2.description && (
                          <p>{errors2.description.message}</p>
                        )}
                      </div>
                      <br />

                      <div className="container mb-3">
                        <div className="form-floating">
                          {formData?.icon ? (
                            <div>
                              <p>Previously uploaded file: {formData?.icon}</p>
                              <input
                                type="text"
                                className="form-control"
                                name="file"
                                id="file"
                                defaultValue={formData?.icon}
                                hidden
                                style={{ border: "1px solid black" }}
                              />
                              <input
                                type="file"
                                className="form-control"
                                name="file"
                                id="file"
                                onChange={(e) => {
                                  setSelectedFile(e.target.files[0]);
                                }}
                                style={{ border: "1px solid black" }}
                              />
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                className="form-control"
                                name="file"
                                id="file"
                                onChange={(e) => {
                                  setSelectedFile(e.target.files[0]);
                                }}
                                style={{ border: "1px solid black" }}
                              />
                              <label className="form-label" htmlFor="icon">
                                Icon
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <Controller
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
                        {errors2.image && <p>{errors2.image.message}</p>} */}
                      <br />
                      <div className="form-floating">
                        <input
                          className="form-control"
                          type="text"
                          name="publisher"
                          id="publisher"
                          placeholder="Publisher"
                          {...register2("publisher")}
                          defaultValue={formData?.publisher}
                        ></input>
                        <label className="form-label" htmlFor="publisher">
                          Publisher
                        </label>
                        {errors2.publisher && (
                          <p>{errors2.publisher.message}</p>
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
                          defaultValue={formData?.author}
                        ></input>
                        <label className="form-label" htmlFor="author">
                          Author
                        </label>
                        {errors2.author && <p>{errors2.author.message}</p>}
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
                          defaultValue={formData?.minAge}
                        ></input>
                        <label className="form-label" htmlFor="minAge">
                          Min Age
                        </label>
                        {errors2.minAge && <p>{errors2.minAge.message}</p>}
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
                          defaultValue={formData?.maxAge}
                        ></input>
                        <label className="form-label" htmlFor="maxAge">
                          Max Age
                        </label>
                        {errors2.maxAge && <p>{errors2.maxAge.message}</p>}
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
                          <option value={formData?.language}>
                            {formData?.language}
                          </option>
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Assamese">Assamese</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Marathi">Marathi</option>
                          <option value="Kannada">Kannada</option>
                        </select>
                        {errors2.language && <p>{errors2.language.message}</p>}
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
                          <option value={formData?.category}>
                            {formData?.category}
                          </option>
                          <option value="Toy">Toy</option>
                          <option value="Games">Games</option>
                          <option value="Audio">Audio</option>
                          <option value="Video">Video</option>
                        </select>
                        {errors2.category && <p>{errors2.category.message}</p>}
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
                          <option value={formData?.themes}>
                            {formData?.themes}
                          </option>
                          <option value="Animals">Animals</option>
                          <option value="Birds">Birds</option>
                          <option value="Vegetables">Vegetables</option>
                          <option value="Nature">Nature</option>
                          <option value="Relations">Relations</option>
                          <option value="Food">Food</option>
                          <option value="Others">Others</option>
                        </select>
                        {errors2.themes && <p>{errors2.themes.message}</p>}
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
                          <option value={formData?.domain}>
                            {formData?.domain}
                          </option>
                          {domain?.map((options, index) => {
                            return (
                              <option value={options?.name} key={index}>
                                {options?.description}
                              </option>
                            );
                          })}
                        </select>
                        {errors2.domain && <p>{errors2.domain.message}</p>}
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
                          <option value={formData?.curricularGoals}>
                            {formData?.curricularGoals}
                          </option>
                          {curricular?.map((options, index) => {
                            return (
                              <option value={options?.name} key={index}>
                                {options?.description}
                              </option>
                            );
                          })}
                        </select>
                        {errors2.curricularGoals && (
                          <p>{errors2.curricularGoals.message}</p>
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
                          <option value={formData?.competency}>
                            {formData?.competency}
                          </option>
                          {competency?.map((options, index) => {
                            return (
                              <option value={options?.name} key={index}>
                                {options?.description}
                              </option>
                            );
                          })}
                        </select>
                        {errors2.competency && (
                          <p>{errors2.competency.message}</p>
                        )}
                        <label className="form-label" htmlFor="domain">
                          Competency
                        </label>
                      </div>
                      <div className={styles.formFieldInline}>
                        <a
                          href="http://20.219.197.218/explore/"
                          target="_blank"
                        >
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
                          <option value={formData?.learningObjectives}>
                            {formData?.learningObjectives}
                          </option>
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
                          <p>{errors2.learningObjectives.message}</p>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className={styles.formbuttonupdate}>
                  <div>
                    <Button
                      className="btn btn-secondary"
                      style={{ width: "100px", height: "40px" }}
                      onClick={() => {
                        setCollectionOpen(false);
                        reset2();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div>
                    <Popconfirm
                      placement="top"
                      title="Are you sure delete?"
                      onConfirm={() => {
                        deleteCollectionData();
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        danger
                        style={{ width: "100px", height: "40px" }}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        </div>
        <div>
          <Modal
            title="Contents"
            open={showMyContent}
            onCancel={() => {
              setShowMyContent(false);
            }}
            footer={false}
            width={1000}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              {/* <div>
                <a
                  className={styles.anchor}
                  onClick={() => {
                    navigate("/collection");
                  }}
                >
                  Add Content
                </a>
              </div> */}
            </div>
            <Table
              columns={collectiontableData}
              dataSource={selectCollection}
            />
          </Modal>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default MyTotalCollection;
