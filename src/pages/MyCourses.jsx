import React, { useState, useRef, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "../styles/tagContent.module.css";

import getDropdownValues from "../api/getApi";
// import Modal from "react-modal";
import { Controller, useForm } from "react-hook-form";
import Footer from "../components/Footer";
import {
  createNewContentCollection,
  getCollectionInfo,
  getCollectionList,
  getContent,
  getContentById,
  updateContent,
  uploadImage,
  deleteContentbyId,
} from "../api/Adminapi";
import Layout from "../components/Layout";
import {
  Button,
  Divider,
  Input,
  Popconfirm,
  Popover,
  Table,
  Modal,
  Space,
  Alert,
  Row,
  Col,
} from "antd";

import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { contentList, colors } from "../config/ICAR-Config";

const customStyles = {
  content: {
    maxHeight: "90%",
    maxWidth: "90%",
    margin: 0,
    padding: "20",
    backgroundColor: "#fff",
  },
  scrollableContent: {
    maxHeight: "90%",
    overflowY: "auto",
  },
};

const MyCourses = () => {

  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [domain, setDomain] = useState();
  const [curricular, setCurricular] = useState();
  const [competency, setCompetency] = useState();
  const [learningOutcome, setLearningOutcome] = useState();
  const [imageUploadData, setimageUploadData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectCollection, setSelectCollection] = useState([]);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionLists, setcollectionLists] = useState([]);
  const [collectionId, setcollectionId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(false);
  const [updatealertMessage, setupdateAlertMessage] = useState(false);
  const [myContentData, setmyContentData] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  let filteredArray = [];

  useEffect(() => {
    collectionListData();
    getValues();
    getMyCourses();
  }, []);

  const showAlert = () => {
    setAlertMessage(true);

    setTimeout(() => {
      setAlertMessage(false);
    }, 3000);
  };

  const handleShowAlert = () => {
    showAlert();
  };

  const updateshowAlert = () => {
    setupdateAlertMessage(true);

    setTimeout(() => {
      setupdateAlertMessage(false);
    }, 3000);
  };

  const handleupdateShowAlert = () => {
    updateshowAlert();
  };
  const handleOptionClick = (option) => {
    setIsPopoverOpen(false);
    if (option === "add") {
      setIsModalOpen(true);
    } else if (option === "delete") {
      deleteContent(selectedRows.map((row) => row.id));
    }
  };

  const deleteContent = async (data) => {
    try {
      // Ensure data is always an array
      const dataArray = Array.isArray(data) ? data : [data];

      const deletePromises = dataArray.map((id) => deleteContentbyId(id));

      const results = await Promise.all(deletePromises);

      if (results.every((result) => result)) {
        getMyCourses();
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setIsOpen(false);
      } else {
        console.error("Failed to delete some content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleEdit = async (params) => {
    try {
      let response = await getContentById(params?.id);
      if (response) {
        openModal();
        setFormData(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const combinedFunction = () => {
    handleEdit(params);
  };

  const collectionListData = async () => {
    let response = await getCollectionList();
    console.log("data", response);
    setcollectionLists(response);
  };

  const handleSelectChange = async (event) => {
    const selectedId = event.target.value;
    setcollectionId(selectedId);
    let response = await getCollectionInfo(selectedId);
    setSelectCollection(response);
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
      title: "Crop",
      dataIndex: "crop",
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
              placeholder="Search by crop"
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
      dataIndex: "publishDate",
      key: "publishDate",
      render: (text) => {
        if (!text) {
          return <span>{""}</span>;
        }
        const formattedDate = moment(text).format("DD-MM-YYYY");
        return <span>{formattedDate}</span>;
      },
    },

    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "x",
    //   render: (value) => (
    //     <span>
    //       <Button
    //         style={{ backgroundColor: "green", color: "white" }}
    //         size="xs"
    //         onClick={() => {
    //           handleEdit(value);
    //         }}
    //       >
    //         Edit
    //       </Button>
    //       <Divider type="vertical" />
    //     </span>
    //   ),
    // },
  ];

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* <Button type="primary" onClick={() => handleOptionClick("add")}>
        Add to Collection
      </Button> */}

      <Button type="primary" danger onClick={() => handleOptionClick("delete")}>
        Delete
      </Button>
    </div>
  );

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    setValue,
  } = useForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      contentType: formData?.contentType,
      crop: formData?.crop,
      description: formData?.description,
      expiryDate: formData?.expiryDate,
      fileType: formData?.fileType,
      icon: formData?.icon || "",
      id: formData?.id,
      monthOrSeason: formData?.monthOrSeason,
      publishDate: formData?.publishDate,
      publisher: formData?.publisher,
      region: formData?.region,
      state: formData?.state,
      target_users: formData?.target_users,
      title: formData?.title,
      url: formData?.url,
      branch: formData?.branch,
    },
  });

  const onSubmit = async (data) => {
    try {
      const formdata = new FormData();
      // Exclude unexpected fields
      const { content_id, link, ...filteredData } = data;
      setFormData(filteredData);

      // Check if a new file is selected and upload it
      if (selectedFile) {
        formdata.append("file", selectedFile);
        const imageUploadResponse = await uploadImage(formdata);
        setimageUploadData(imageUploadResponse);

        // Update the filteredData object with the uploaded file's details
        filteredData.icon = imageUploadResponse?.key;

        // Clear the selected file state
        setSelectedFile(null);
      } else {
        // If no new file is selected, keep the existing icon
        filteredData.icon = formData?.icon;
      }

      const result = await updateContent(filteredData?.id, filteredData);
      if (result?.data?.icar_?.update_Content) {
        handleupdateShowAlert();
        const updatedContent = await getContentById(filteredData?.id);
        setFormData(updatedContent);
        getMyCourses();
        setIsOpen(false);
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmitCollection = async (data) => {
    try {
      // const record = { ...data, content_id };
      const collection_id = data?.collection_id;
      const content_id = selectedRows?.map((row) => row?.id) || [];
      const dataArray = content_id?.map((contentId) => ({
        collection_id: collection_id,
        content_id: contentId,
      }));
      let promises = [];
      dataArray.forEach((item) => {
        promises.push(createNewContentCollection(item));
      });
      const results = await Promise.all(promises);
      if (
        results.length > 0 &&
        results.every((result) => result?.data?.insert_contents)
      ) {
        // alert("Content collection created Successfully");
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setIsModalOpen(false);
        reset();
        handleShowAlert();
      } else if (content_id.length === 0) {
        alert("Please select content to add to collection");
      } else {
        alert("Please select a collection");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Please select one options");
    }
  };

  const getValues = async () => {
    const result = await getDropdownValues();
    setDomain(result?.data?.result?.framework?.categories[0]?.terms);
    setCurricular(result?.data?.result?.framework?.categories[1]?.terms);
    setCompetency(result?.data?.result?.framework?.categories[2]?.terms);
    setLearningOutcome(result?.data?.result?.framework?.categories[3]?.terms);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const getMyCourses = async () => {
    try {
      let response = await getContent();
      if (response?.Content) {
        setRowData(response.Content);
        setmyContentData(response.Content);
      } else {
        console.error("Error: Response does not contain expected 'Content'");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  // if (selectCollection) {
  //   filteredArray = myContentData.filter((item) => {
  //     return !selectCollection.some((row) => row?.content_id === item?.id);
  //   });
  // } else {
  //   filteredArray = myContentData;
  // }

  // Split the Fields into Two Columns
  const splitFormFields = () => {
    const fieldsArray = Object.entries(contentList.editModal.formFields);
    const halfLength = Math.ceil(fieldsArray.length / 2); // Calculate half of the fields

    const firstColumnFields = fieldsArray.slice(0, halfLength); // First half
    const secondColumnFields = fieldsArray.slice(halfLength); // Second half

    return { firstColumnFields, secondColumnFields };
  };

  // Render the Fields in Two Columns
  const renderFormFieldsInColumns = () => {
    const { firstColumnFields, secondColumnFields } = splitFormFields();

    const renderFields = (fields) => {
      return fields.map(([key, field]) => {
        const { label, placeholder, type, options } = field;

        switch (type) {
          case "text":
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating">
                  <input
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`}
                    type="text"
                    name={key}
                    id={key}
                    placeholder={placeholder}
                    defaultValue={formData[key]}
                    {...register(key, {
                      required:
                        key === "title" || key === "url" || key === "description"
                          ? "This field is required"
                          : false,
                    })}
                  />
                  <label className="form-label" htmlFor={key}>
                    {label}
                  </label>
                  {errors[key] && (
                    <div className="invalid-feedback">
                      {errors[key].message}
                    </div>
                  )}
                </div>
              </div>
            );
          case "textarea":
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating mb-3">
                  <textarea
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`}
                    name={key}
                    id={key}
                    defaultValue={formData[key]}
                    {...register(key, {
                      required:
                        key === "description"
                          ? "This field is required"
                          : false,
                    })}
                    style={{ height: "150px" }}
                  ></textarea>
                  <label className="form-label" htmlFor={key}>
                    {label}
                  </label>
                  {errors[key] && (
                    <div className="invalid-feedback">
                      {errors[key].message}
                    </div>
                  )}
                </div>
              </div>
            );
          case "file":
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating">
                  {formData?.icon ? (
                    <div>
                      <p>Previously uploaded file: {formData?.icon}</p>
                      <input
                        type="text"
                        className="form-control"
                        name={key}
                        id={key}
                        defaultValue={formData[key]}
                        hidden
                        style={{ border: "1px solid #d9d9d9" }}
                      />
                      <input
                        type="file"
                        className={`form-control ${
                          errors[key] ? "is-invalid" : ""
                        }`}
                        name={key}
                        id={key}
                        onChange={(e) => {
                          setSelectedFile(e.target.files[0]);
                        }}
                        style={{ border: "1px solid #d9d9d9" }}
                        {...register(key, {
                          required:
                            key === "icon" && !formData.icon
                              ? "Please upload an icon"
                              : false,
                        })}
                      />
                      {errors[key] && (
                        <div className="invalid-feedback">
                          {errors[key].message}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        className={`form-control ${
                          errors[key] ? "is-invalid" : ""
                        }`}
                        name={key}
                        id={key}
                        onChange={(e) => {
                          setSelectedFile(e.target.files[0]);
                        }}
                        style={{ border: "1px solid black" }}
                        {...register(key, {
                          required:
                            key === "icon" && !formData.icon
                              ? "Please upload an icon"
                              : false,
                        })}
                      />
                      <label className="form-label" htmlFor={key}>
                        {label}
                      </label>
                      {errors[key] && (
                        <div className="invalid-feedback">
                          {errors[key].message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          case "select":
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name={key}
                    id={key}
                    defaultValue={formData[key]}
                    {...register(key)}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label className="form-label" htmlFor={key}>
                    {label}
                  </label>
                </div>
              </div>
            );
          case "date":
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    name={key}
                    id={key}
                    placeholder={label}
                    defaultValue={formData[key]}
                    {...register(key)}
                  />
                  <label className="form-label" htmlFor={key}>
                    {label}
                  </label>
                </div>
              </div>
            );
          default:
            return null;
        }
      });
    };

    return (
      <Row>
        <Col span={12}>{renderFields(firstColumnFields)}</Col>
        <Col span={12}>{renderFields(secondColumnFields)}</Col>
      </Row>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #EFDA2F)",
      }}
    >
      <div className={styles.headerDiv}>
        <Header />
      </div>

      <div
        style={{
          marginTop: "120px",
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "20px",
        }}
      >
        <div>
          <a
            className={styles.anchor}
            style={{
              backgroundColor: colors.primaryButtonColor.default,
              borderColor: colors.primaryButtonColor.default,
              color: colors.primaryButtonColor.text,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryButtonColor.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                colors.primaryButtonColor.default;
            }}
            onClick={() => {
              navigate("/tagcontent");
            }}
          >
            {contentList.button.button1}
          </a>
        </div>
        <div>
          <a
            className={styles.anchor}
            style={{
              backgroundColor: colors.primaryButtonColor.default,
              borderColor: colors.primaryButtonColor.default,
              color: colors.primaryButtonColor.text,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryButtonColor.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                colors.primaryButtonColor.default;
            }}
            onClick={() => {
              navigate("/uploadCSV");
            }}
          >
            {contentList.button.button2}
          </a>
        </div>
        <div>
          <Popover
            content={content}
            trigger="click"
            placement="bottom"
            open={isPopoverOpen}
            onOpenChange={(open) => setIsPopoverOpen(open)}
          >
            <a
              className={styles.anchor}
              style={{
                backgroundColor: colors.primaryButtonColor.default,
                borderColor: colors.primaryButtonColor.default,
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
              {contentList.button.button3}
            </a>
          </Popover>
        </div>
      </div>
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
              message="Created Sucessfully"
              type="success"
              showIcon
              closable
            />
          </Space>
        ) : null}
      </div>
      <div>
        {updatealertMessage ? (
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
              message="Updated Sucessfully"
              type="success"
              showIcon
              closable
            />
          </Space>
        ) : null}
      </div>
      <div style={{ width: "100%", height: "100vh", marginTop: "5px" }}>
        {/* <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
      /> */}
        <Table
          columns={columns}
          dataSource={rowData}
          rowKey="id"
          scroll={{ x: "max-content" }}
          bordered={true}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys, selectedRows) => {
              setSelectedRowKeys(selectedKeys);
              setSelectedRows(selectedRows);
            },
            onSelect: (record, selected) => {
              if (selected) {
                let updatedSelectedRowKeys = [
                  ...selectedRows?.map((row) => row?.id),
                  record?.id,
                ];
                // setValue("content_id", updatedSelectedRowKeys);
              } else {
                let updatedSelectedRowKeys = selectedRowKeys.filter(
                  (id) => id !== record.id
                );
                // setValue("content_id", updatedSelectedRowKeys);
              }
            },
            type: "checkbox",
          }}
        />
      </div>
      <div>
        <Modal
          open={isOpen}
          onCancel={closeModal}
          title={contentList.editModal.title}
          footer={null}
          width={1000}
        >
          <form
            className="card-body form-floating mt-3 mx-1"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3" style={customStyles.scrollableContent}>
              <div className="container mb-3">
                <div className="h6" style={{ color: "#0F75BC" }}>
                  {contentList.editModal.subTitle}
                </div>
                <input
                  type="text"
                  name="id"
                  id="id"
                  placeholder="id"
                  defaultValue={formData?.id}
                  {...register("id")}
                  hidden
                />
              </div>
              {renderFormFieldsInColumns()}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Button
                  className="btn btn-secondary"
                  style={{
                    width: "100px",
                    height: "40px",
                    backgroundColor:
                      colors.editModalButtonColors.cancelButton.default,
                    color: colors.editModalButtonColors.cancelButton.text,
                    border:
                      colors.editModalButtonColors.cancelButton.borderColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      colors.editModalButtonColors.cancelButton.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor =
                      colors.editModalButtonColors.cancelButton.default;
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                >
                  {contentList.editModal.buttons.cancelButton}
                </Button>
                <Popconfirm
                  placement="top"
                  title="Are you sure delete?"
                  onConfirm={() => {
                    deleteContent(formData?.id);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    danger
                    style={{
                      width: "100px",
                      height: "40px",
                      backgroundColor:
                        colors.editModalButtonColors.deleteButton.default,
                      color: colors.editModalButtonColors.deleteButton.text,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        colors.editModalButtonColors.deleteButton.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor =
                        colors.editModalButtonColors.deleteButton.default;
                    }}
                    onClick={() => {
                      setIsOpen(false);
                      reset();
                    }}
                  >
                    {contentList.editModal.buttons.deleteButton}
                  </Button>
                </Popconfirm>
                <button
                  className="btn btn-primary"
                  style={{
                    backgroundColor:
                      colors.editModalButtonColors.saveChangesButton.default,
                    color: colors.editModalButtonColors.saveChangesButton.text,
                    border:
                      colors.editModalButtonColors.cancelButton.borderColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      colors.editModalButtonColors.saveChangesButton.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor =
                      colors.editModalButtonColors.saveChangesButton.default;
                  }}
                >
                  {contentList.editModal.buttons.saveChangesButton}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
      <div>
        <Modal
          title="Add collection"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          footer={false}
          width={1000}
        >
          <form
            className=" card-body form-floating mt-3 mx-1"
            onSubmit={handleSubmit2(onSubmitCollection)}
            autoComplete="off"
          >
            <div>
              <label className="form-label" htmlFor="collection_id">
                <strong> Select a Collection</strong>
              </label>
              {/* <select
                className="form-select"
                name="collection_id"
                id="collection_id"
                {...register2("collection_id")}
                onChange={handleSelectChange}
                style={{ fontSize: "14px" }}
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
            </div>
            <br />
            <br />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                <Button
                  className="btn btn-secondary"
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => {
                    setIsModalOpen(false);
                    reset2();
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                  }}
                >
                  Cancel
                </Button>
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MyCourses;
