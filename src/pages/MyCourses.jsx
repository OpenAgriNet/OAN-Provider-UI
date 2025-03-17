import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Modal,
  Popover,
  Button,
  Popconfirm,
  Alert,
  Space,
  Row,
  Col,
} from "antd";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  getContent,
  getContentById,
  deleteContentbyId,
  updateContent,
  uploadImage,
  createNewContentCollection,
  getCollectionInfo,
  getCollectionList,
} from "../api/Adminapi";
import { getCategoriesApi } from "../api/CategoryApi";
import { getFulfillmentsApi } from "../api/FulfillmentApi";
import { getLocationsApi } from "../api/LocationApi";
import getDropdownValues from "../api/getApi";

import styles from "../styles/tagContent.module.css";
import { contentList, colors } from "../config/ICAR-Config";
import { SearchOutlined } from "@ant-design/icons";

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

  // ====== State ======
  const [rowData, setRowData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [imageUploadData, setimageUploadData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionLists, setCollectionLists] = useState([]);
  const [collectionId, setCollectionId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(false);
  const [updateAlertMessage, setUpdateAlertMessage] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // For dynamic dropdowns
  const [categories, setCategories] = useState([]);
  const [fulfillments, setFulfillments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  // ====== Hooks ======
  useEffect(() => {
    collectionListData();
    getValues();
    getMyCourses();
  }, []);

  // ====== Alert Handlers ======
  const showAlert = () => {
    setAlertMessage(true);
    setTimeout(() => setAlertMessage(false), 3000);
  };
  const handleShowAlert = () => showAlert();
  const updateshowAlert = () => {
    setUpdateAlertMessage(true);
    setTimeout(() => setUpdateAlertMessage(false), 3000);
  };
  const handleupdateShowAlert = () => updateshowAlert();

  // ====== API: Fetch Main Table Data ======
  const getMyCourses = async () => {
    try {
      const response = await getContent();
      if (Array.isArray(response) && response.length > 0) {
        const dataWithCreatedDate = response.map((item) => ({
          ...item,
          createdDate: new Date(),
        }));
        setRowData(dataWithCreatedDate);
      } else {
        console.error("API response is empty or not an array");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  // ====== API: Fetch Collections ======
  const collectionListData = async () => {
    try {
      const response = await getCollectionList();
      setCollectionId(response);
      setCollectionLists(response);
    } catch (error) {
      console.error("Error fetching collection list:", error);
    }
  };

  // ====== API: Fetch Dropdown Data ======
  const getValues = async () => {
    try {
      await getDropdownValues();
      const categoryData = await getCategoriesApi();
      const fulfillmentData = await getFulfillmentsApi();
      const locationData = await getLocationsApi();

      setCategories(
        categoryData.categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))
      );
      setFulfillments(
        fulfillmentData.fulfillments.map((ful) => ({
          value: ful.id,
          label: ful.type,
        }))
      );
      setLocations(locationData.locations);
    } catch (error) {
      console.error("Error in getValues:", error);
    }
  };

  // ====== Row Click: Fetch & Show Modal ======
  const handleRowClick = async (record) => {
    try {
      const contentData = await getContentById(record.item_id);

      // Map API fields to our formData.
      // Note: We use our form field keys that match our configuration.
      const mappedData = {
        ...contentData,
        id: contentData.item_id,
        content_name: contentData.item_name,
        item_short_desc: contentData.item_short_desc,
        item_long_desc: contentData.item_long_desc,
        item_categories:
          contentData.item_category_ids && contentData.item_category_ids.length > 0
            ? contentData.item_category_ids[0]
            : "",
        item_fulfillments:
          contentData.item_fulfillment_ids && contentData.item_fulfillment_ids.length > 0
            ? contentData.item_fulfillment_ids[0]
            : "",
      };

      // Map media data.
      if (
        Array.isArray(contentData.item_media) &&
        contentData.item_media.length > 0
      ) {
        mappedData.media_url = contentData.item_media[0].url;
        mappedData.item_medias = contentData.item_media[0].mimetype;
      } else {
        mappedData.media_url = "";
        mappedData.item_medias = "";
      }

      // Map item image data.
      if (
        Array.isArray(contentData.item_images) &&
        contentData.item_images.length > 0
      ) {
        mappedData.item_img = contentData.item_images[0].url;
      } else {
        mappedData.item_img = "";
      }

      // Map location data.
      if (
        contentData.item_location_ids &&
        contentData.item_location_ids.length > 0 &&
        locations.length > 0
      ) {
        const locId = contentData.item_location_ids[0];
        const selectedLocation = locations.find((loc) => loc.id === locId);
        if (selectedLocation) {
          mappedData.item_location_state = selectedLocation.state_name;
          mappedData.item_location_city = selectedLocation.city_name;
          // Update selected state so city dropdown options are recalculated.
          setSelectedState(selectedLocation.state_name);
        } else {
          mappedData.item_location_state = "";
          mappedData.item_location_city = "";
        }
      } else {
        mappedData.item_location_state = "";
        mappedData.item_location_city = "";
      }

      // Populate form fields with mappedData.
      Object.keys(mappedData).forEach((key) => {
        setValue(key, mappedData[key] || "");
      });
      setFormData(mappedData);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching content details:", error);
    }
  };

  // ====== Delete Content ======
  const deleteContent = async (data) => {
    try {
      const dataArray = Array.isArray(data) ? data : [data];
      const deletePromises = dataArray.map((id) => deleteContentbyId(id));
      const results = await Promise.all(deletePromises);
      if (results.every((res) => res)) {
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

  // ====== Popover Actions (Add or Delete) ======
  const handleOptionClick = (option) => {
    setIsPopoverOpen(false);
    if (option === "add") {
      setIsModalOpen(true);
    } else if (option === "delete") {
      deleteContent(selectedRows.map((row) => row.item_id));
    }
  };

  // ====== react-hook-form Setup ======
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

  // ====== Submit: Edit Modal ======
  const onSubmit = async (data) => {
    try {
      // Handle file upload if needed.
      if (selectedFile) {
        const formdata = new FormData();
        formdata.append("file", selectedFile);
        const imageUploadResponse = await uploadImage(formdata);
        setimageUploadData(imageUploadResponse);
        data.icon = imageUploadResponse?.key;
        setSelectedFile(null);
      } else {
        data.icon = formData?.icon;
      }

      // Rebuild media data.
      data.item_media = [
        {
          url: data.media_url || "",
          mimetype: data.item_medias || "",
        },
      ];

      // Rebuild category and fulfillment arrays.
      data.item_category_ids = [data.item_categories];
      data.item_fulfillment_ids = [data.item_fulfillments];

      // For location, find the matching location using the selected state and city.
      const selectedLoc = locations.find(
        (loc) =>
          loc.state_name === data.item_location_state &&
          loc.city_name === data.item_location_city
      );
      if (selectedLoc) {
        data.item_location_ids = [selectedLoc.id];
      } else {
        data.item_location_ids = [];
      }

      // IMPORTANT: Build a clean payload that only includes the keys your API expects.
      // For example, if your updateContent API expects only the following keys:
      // provider_id, item_name, item_short_desc, item_long_desc, icon,
      // item_category_ids, item_fulfillment_ids, and item_location_ids,
      // then construct a new object accordingly.
      const payload = {
        provider_id: data.provider_id,
        item_name: data.content_name,
        item_short_desc: data.item_short_desc,
        item_long_desc: data.item_long_desc,
        icon: data.icon,
        item_category_ids: data.item_category_ids,
        item_fulfillment_ids: data.item_fulfillment_ids,
        item_location_ids: data.item_location_ids,
      };

      const result = await updateContent(data.id, payload);
      if (result?.data?.icar_?.update_Content) {
        handleupdateShowAlert();
        const updatedContent = await getContentById(data.id);
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

  // ====== Submit: Add to Collection Modal ======
  const onSubmitCollection = async (data) => {
    try {
      const collection_id = data?.collection_id;
      const content_id = selectedRows?.map((row) => row?.id) || [];
      const dataArray = content_id.map((contentId) => ({
        collection_id,
        content_id: contentId,
      }));
      const results = await Promise.all(
        dataArray.map((item) => createNewContentCollection(item))
      );
      if (
        results.length > 0 &&
        results.every((result) => result?.data?.insert_contents)
      ) {
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setIsModalOpen(false);
        reset2();
        handleShowAlert();
      } else if (content_id.length === 0) {
        alert("Please select content to add to collection");
      } else {
        alert("Please select a collection");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Please select one option");
    }
  };

  // ====== Modal Close ======
  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  // ====== Table Columns ======
  const columns = [
    { title: "Item Name", dataIndex: "item_name", key: "item_name" },
    { title: "Provider Name", dataIndex: "provider_name", key: "provider_name" },
    { title: "Short Description", dataIndex: "provider_short_desc", key: "provider_short_desc" },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : ""),
    },
  ];

  const popoverContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <Button type="primary" danger onClick={() => handleOptionClick("delete")}>
        Delete
      </Button>
    </div>
  );

  // ====== Dynamic Location Dropdowns ======
  const distinctStates = useMemo(() => {
    const stateSet = new Set();
    locations.forEach((loc) => stateSet.add(loc.state_name));
    return [...stateSet].map((state) => ({
      value: state,
      label: state,
    }));
  }, [locations]);

  const cityOptions = useMemo(() => {
    if (!selectedState) return [];
    return locations
      .filter((loc) => loc.state_name === selectedState)
      .map((loc) => ({
        value: loc.city_name, // using city name as value
        label: loc.city_name,
      }));
  }, [locations, selectedState]);

  // ====== Splitting Form Fields (Two-Column Layout) ======
  const splitFormFields = () => {
    const fieldsArray = Object.entries(contentList.editModal.formFields);
    const halfLength = Math.ceil(fieldsArray.length / 2);
    const firstColumnFields = fieldsArray.slice(0, halfLength);
    const secondColumnFields = fieldsArray.slice(halfLength);
    return { firstColumnFields, secondColumnFields };
  };

  // ====== Render Fields with Floating Labels ======
  const renderFormFieldsInColumns = () => {
    const { firstColumnFields, secondColumnFields } = splitFormFields();
    const renderFields = (fields) =>
      fields.map(([key, field]) => {
        if (!field) return null;
        switch (field.type) {
          case "text":
          case "date":
          case "textarea":
          case "file":
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating">
                  {field.type === "textarea" ? (
                    <>
                      <textarea
                        className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                        id={key}
                        placeholder={field.label}
                        {...register(key)}
                        style={{ height: "150px" }}
                        readOnly={key === "id"}
                      />
                      <label htmlFor={key}>{field.label}</label>
                    </>
                  ) : field.type === "file" ? (
                    <>
                      <input
                        className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                        type="file"
                        id={key}
                        placeholder={field.label}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        {...register(key)}
                      />
                      <label htmlFor={key}>{field.label}</label>
                    </>
                  ) : (
                    <>
                      <input
                        className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                        type={field.type}
                        id={key}
                        placeholder={field.label}
                        {...register(key)}
                        readOnly={key === "id"}
                      />
                      <label htmlFor={key}>{field.label}</label>
                    </>
                  )}
                  {errors[key] && <p style={{ color: "red" }}>{errors[key].message}</p>}
                </div>
              </div>
            );
          case "select":
            let dropdownOptions = field.options || [];
            if (key === "item_categories") {
              dropdownOptions = categories;
            } else if (key === "item_fulfillments") {
              dropdownOptions = fulfillments;
            } else if (key === "item_location_state") {
              dropdownOptions = distinctStates;
            } else if (key === "item_location_city") {
              dropdownOptions = cityOptions;
            }
            return (
              <div key={key} className="container mb-3">
                <div className="form-floating">
                  <select
                    className={`form-select ${errors[key] ? "is-invalid" : ""}`}
                    id={key}
                    placeholder={field.label}
                    {...register(key, {
                      onChange: (e) => {
                        if (key === "item_location_state") {
                          setSelectedState(e.target.value);
                        }
                      },
                    })}
                  >
                    <option value="">Select {field.label}</option>
                    {dropdownOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor={key}>{field.label}</label>
                  {errors[key] && <p style={{ color: "red" }}>{errors[key].message}</p>}
                </div>
              </div>
            );
          default:
            return null;
        }
      });
    return (
      <Row>
        <Col span={12}>{renderFields(firstColumnFields)}</Col>
        <Col span={12}>{renderFields(secondColumnFields)}</Col>
      </Row>
    );
  };

  // ====== Render Component ======
  return (
    <div style={{ background: "linear-gradient(to bottom, #FFFFFF, #EFDA2F)" }}>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div style={{ marginTop: "120px", display: "flex", justifyContent: "flex-end", marginRight: "20px" }}>
        <div>
          <a
            className={styles.anchor}
            style={{
              backgroundColor: colors.primaryButtonColor.default,
              borderColor: colors.primaryButtonColor.default,
              color: colors.primaryButtonColor.text,
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primaryButtonColor.hover; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = colors.primaryButtonColor.default; }}
            onClick={() => { navigate("/tagcontent"); }}
          >
            {contentList.button.button1}
          </a>
        </div>
        <div>
          <Popover
            content={popoverContent}
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
              onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primaryButtonColor.hover; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = colors.primaryButtonColor.default; }}
            >
              {contentList.button.button3}
            </a>
          </Popover>
        </div>
      </div>
      {alertMessage && (
        <Space direction="vertical" style={{ width: "100%", zIndex: "999", justifyContent: "center", alignItems: "center" }}>
          <Alert message="Created Successfully" type="success" showIcon closable />
        </Space>
      )}
      {updateAlertMessage && (
        <Space direction="vertical" style={{ width: "100%", zIndex: "999", justifyContent: "center", alignItems: "center" }}>
          <Alert message="Updated Successfully" type="success" showIcon closable />
        </Space>
      )}
      <div style={{ width: "100%", height: "100vh", marginTop: "5px" }}>
        <Table
          columns={columns}
          dataSource={rowData}
          rowKey="item_id"
          scroll={{ x: "max-content" }}
          bordered={true}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys, rows) => {
              setSelectedRowKeys(selectedKeys);
              setSelectedRows(rows);
            },
            type: "checkbox",
          }}
        />
      </div>
      <Modal open={isOpen} onCancel={closeModal} title={contentList.editModal.title} footer={null} width={1000}>
        <form className="card-body form-floating mt-3 mx-1" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3" style={customStyles.scrollableContent}>
            <div className="container mb-3">
              <div className="h6" style={{ color: "#0F75BC" }}>
                {contentList.editModal.subTitle}
              </div>
            </div>
            {renderFormFieldsInColumns()}
            <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
              <Button
                className="btn btn-secondary"
                style={{
                  width: "100px",
                  height: "40px",
                  backgroundColor: colors.editModalButtonColors.cancelButton.default,
                  color: colors.editModalButtonColors.cancelButton.text,
                  border: colors.editModalButtonColors.cancelButton.borderColor,
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = colors.editModalButtonColors.cancelButton.hover; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = colors.editModalButtonColors.cancelButton.default; }}
                onClick={() => { setIsOpen(false); reset(); }}
              >
                {contentList.editModal.buttons.cancelButton}
              </Button>
              <Popconfirm
                placement="top"
                title="Are you sure delete?"
                onConfirm={() => { deleteContent(formData?.item_id); }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  style={{
                    width: "100px",
                    height: "40px",
                    backgroundColor: colors.editModalButtonColors.deleteButton.default,
                    color: colors.editModalButtonColors.deleteButton.text,
                  }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = colors.editModalButtonColors.deleteButton.hover; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = colors.editModalButtonColors.deleteButton.default; }}
                  onClick={() => { setIsOpen(false); reset(); }}
                >
                  {contentList.editModal.buttons.deleteButton}
                </Button>
              </Popconfirm>
              <button
                className="btn btn-primary"
                style={{
                  backgroundColor: colors.editModalButtonColors.saveChangesButton.default,
                  color: colors.editModalButtonColors.saveChangesButton.text,
                  border: colors.editModalButtonColors.cancelButton.borderColor,
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = colors.editModalButtonColors.saveChangesButton.hover; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = colors.editModalButtonColors.saveChangesButton.default; }}
              >
                {contentList.editModal.buttons.saveChangesButton}
              </button>
            </div>
          </div>
        </form>
      </Modal>
      <Modal
        title="Add collection"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); }}
        footer={false}
        width={1000}
      >
        <form className="card-body form-floating mt-3 mx-1" onSubmit={handleSubmit2(onSubmitCollection)} autoComplete="off">
          <div>
            <label className="form-label" htmlFor="collection_id">
              <strong>Select a Collection</strong>
            </label>
          </div>
          <br />
          <div className="container mb-3">
            <div className="form-floating">
              <select className="form-select" id="collection_id" {...register2("collection_id")}>
                <option value="">-- Select Collection --</option>
                {collectionLists.map((coll) => (
                  <option key={coll.id} value={coll.id}>
                    {coll.name}
                  </option>
                ))}
              </select>
              <label htmlFor="collection_id">Collection</label>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      <Footer />
    </div>
  );
};

export default MyCourses;
