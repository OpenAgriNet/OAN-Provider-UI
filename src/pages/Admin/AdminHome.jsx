import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import headerStyles from "../../styles/tagContent.module.css";
import styles from "../../styles/HomePage.module.css";
import Footer from "../../components/Footer";
import {
  Button,
  Divider,
  Input,
  Popconfirm,
  Table,
  Modal,
  Typography,
  Tabs,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AdminRegisterSchema from "../../schema/AdminRegisterSchema";
import gridStyles from "../Login.module.css";
import iconstyles from "../Login.module.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import {
  adminRegisterApi,
  getAllProviderList,
  userApprove,
  userEnableDisable,
  getProviderInfo,
  getAllSeekerList,
} from "../../api/Adminapi";

const { Text } = Typography;

const AdminHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [providerList, setproviderList] = useState([]);
  const [singleUserData, setSingleUserData] = useState({});
  const [seekerList, setSeekerList] = useState([]);
  useEffect(() => {
    getProviderList();
    getSeekerList();
  }, []);

  const getProviderInfoData = async (user) => {
    let id = user?.id;

    let response = await getProviderInfo(id);
    setSingleUserData(response);
    setInfoModal(true);
  };

  const providerApprove = async (user) => {
    let id = user?.id;

    const body = {
      approved: true,
      reason: "Approved",
    };
    let result = await userApprove(id, body);
    getProviderList();
    getSeekerList();
  };

  const providerRejected = async (user) => {
    let id = user?.id;

    const body = {
      approved: false,
      reason: "Rejected",
    };
    let result = await userApprove(id, body);
    getProviderList();
    getSeekerList();
  };

  const userStatusEnable = async (user) => {
    let id = user?.id;

    const body = {
      enable: true,
    };
    let result = await userEnableDisable(id, body);
    getProviderList();
  };

  const userStatusdisable = async (user) => {
    let id = user?.id;

    const body = {
      enable: false,
    };
    let result = await userEnableDisable(id, body);
    getProviderList();
  };

  const getProviderList = async () => {
    let response = await getAllProviderList();
    setproviderList(response);
  };

  const getSeekerList = async () => {
    let response = await getAllSeekerList();
    setSeekerList(response);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(AdminRegisterSchema) });

  const onSubmit = async (data) => {
    const result = await adminRegisterApi(data);
    if (result?.id) {
      alert("Registered successfully.");
      setIsModalOpen(false);
      reset();
      getProviderList();
    } else if (result?.error) {
      alert("E-mail already exists");
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const providerColumns = [
    {
      title: "Name",
      dataIndex: "name",
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
              placeholder="Search by Name"
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
        return record?.name?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    {
      title: "Role",
      dataIndex: "role",
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
              placeholder="Search by role"
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
        return record?.role?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    {
      title: "Email",
      dataIndex: "email",
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
              placeholder="Search by email"
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
        return record?.email?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    // {
    //   title: "Approver Type",
    //   dataIndex: "type",
    // },
    // {
    //   title: "Date of Request",
    //   dataIndex: "doReq",
    // },
    // {
    //   title: "Date of Approval",
    //   dataIndex: "doApp",
    // },
    {
      title: "Approval Status",
      dataIndex: "approved",
      render: (value) => {
        if (value === true) {
          return <Text>Approved</Text>;
        } else if (value === false) {
          return <Text>Pending</Text>;
        } else {
          return <Text>Rejected</Text>;
        }
      },
    },

    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (value) => (
        <span>
          <Button
            size="xs"
            style={{ backgroundColor: "#0D89FE", color: "white" }}
            onClick={() => {
              getProviderInfoData(value);
            }}
          >
            View
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            placement="top"
            title="Are you sure to Approve?"
            onConfirm={() => {
              providerApprove(value);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              size="xs"
            >
              Approve
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            placement="top"
            title="Are you sure to Reject?"
            onConfirm={() => {
              providerRejected(value);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              size="xs"
            >
              Reject
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          {value?.enable === true ? (
            <Popconfirm
              placement="top"
              title="Are you sure to disable?"
              onConfirm={() => {
                userStatusdisable(value);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ backgroundColor: "orange", color: "white" }}
                size="xs"
              >
                Disable
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              placement="top"
              title="Are you sure to enable?"
              onConfirm={() => {
                userStatusEnable(value);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ backgroundColor: "lightgreen", color: "white" }}
                size="xs"
              >
                Enable
              </Button>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];

  const seekerColumns = [
    {
      title: "Name",
      dataIndex: "name",
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
              placeholder="Search by Name"
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
        return record?.name?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    {
      title: "Role",
      dataIndex: "role",
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
              placeholder="Search by role"
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
        return record?.role?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    {
      title: "Email",
      dataIndex: "email",
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
              placeholder="Search by email"
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
        return record?.email?.toLowerCase().includes(value?.toLowerCase());
      },
    },
    // {
    //   title: "Approver Type",
    //   dataIndex: "type",
    // },
    // {
    //   title: "Date of Request",
    //   dataIndex: "doReq",
    // },
    // {
    //   title: "Date of Approval",
    //   dataIndex: "doApp",
    // },
    {
      title: "Approval Status",
      dataIndex: "approved",
      render: (value) => {
        if (value === true) {
          return <Text>Approved</Text>;
        } else if (value === false) {
          return <Text>Pending</Text>;
        } else {
          return <Text>Rejected</Text>;
        }
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
            style={{ backgroundColor: "#0D89FE", color: "white" }}
            onClick={() => {
              getProviderInfoData(value);
            }}
          >
            View
          </Button>
          <Divider type="vertical" /> */}
          <Popconfirm
            placement="top"
            title="Are you sure to Approve?"
            onConfirm={() => {
              providerApprove(value);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              size="xs"
            >
              Approve
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            placement="top"
            title="Are you sure to Reject?"
            onConfirm={() => {
              providerRejected(value);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              size="xs"
            >
              Reject
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          {/* {value?.enable === true ? (
            <Popconfirm
              placement="top"
              title="Are you sure to disable?"
              onConfirm={() => {
                userStatusdisable(value);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ backgroundColor: "orange", color: "white" }}
                size="xs"
              >
                Disable
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              placement="top"
              title="Are you sure to enable?"
              onConfirm={() => {
                userStatusEnable(value);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ backgroundColor: "lightgreen", color: "white" }}
                size="xs"
              >
                Enable
              </Button>
            </Popconfirm>
          )} */}
        </span>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Provider Requests",
      children: (
        <div className={styles.adminContainer}>
          <Table
            columns={providerColumns}
            dataSource={providerList}
            rowKey="id"
            scroll={{ x: "max-content" }}
            bordered={true}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Seeker Requests",
      children: (
        <div className={styles.adminContainer}>
          <Table
            columns={seekerColumns}
            dataSource={seekerList}
            rowKey="id"
            scroll={{ x: "max-content" }}
            bordered={true}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className={headerStyles.headerDiv}>
        <AdminHeader />
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "95px",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Add a new Admin
        </button>
      </div>
      <div>
        <Space
          style={{
            marginBottom: 24,
          }}
        >
          <Tabs defaultActiveKey="1" items={items} tabPosition="left" />
        </Space>
      </div>
      {/* <div className={styles.adminContainer}>
        <Table
          columns={columns}
          dataSource={providerList}
          rowKey="id"
          scroll={{ x: "max-content" }}
          bordered={true}
        />
      </div> */}
      <div>
        <Footer />
      </div>
      <div>
        <Modal
          title="Add a admin"
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
                      name="name"
                      id="name"
                      placeholder="Name "
                      {...register("name")}
                    ></input>
                    <label className="form-label" htmlFor="name">
                      {" "}
                      Name
                    </label>
                    {errors.name && <p>{errors.name.message}</p>}
                  </div>
                </div>

                <div className="container mb-3">
                  <div className="form-floating">
                    <input
                      className={"form-control"}
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email"
                      {...register("email")}
                    ></input>
                    <label className="form-label" htmlFor="email">
                      {" "}
                      Email
                    </label>
                    {errors.email && <p>{errors.email.message}</p>}
                  </div>
                </div>
                <div className="container mb-3">
                  <div className="form-floating ">
                    <input
                      className="form-control"
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="password"
                      {...register("password")}
                      style={{ paddingRight: "30px" }} // Add padding to accommodate the icon
                    />
                    <div onClick={togglePassword} className={iconstyles.icon}>
                      {passwordShown ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </div>
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    {errors.password && <p>{errors.password.message}</p>}
                  </div>
                </div>
                <div className="container mb-3">
                  <div className="form-floating">
                    <input
                      className="form-control"
                      type="hidden"
                      name="role"
                      id="role"
                      placeholder="Role"
                      {...register("role")}
                      value="admin"
                      defaultValue={"admin"}
                      readOnly
                    ></input>
                    {/* <label className="form-label" htmlFor="role">
                {" "}
                Role
              </label> */}
                    {errors.role && <p>{errors.role.message}</p>}
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
      <div>
        <Modal
          title="Provider Info"
          open={infoModal}
          onCancel={() => {
            setInfoModal(false);
          }}
          footer={null}
        >
          <div>
            {singleUserData && (
              <div className={gridStyles.gridContainer}>
                <div className={gridStyles.gridItem}>
                  <strong>Name:</strong>{" "}
                  {singleUserData?.provideruserRelation?.name
                    ? singleUserData?.provideruserRelation?.name
                    : "-"}
                  <br />
                  <br />
                  <strong>Email:</strong>{" "}
                  {singleUserData?.provideruserRelation?.email
                    ? singleUserData?.provideruserRelation?.email
                    : "-"}
                  <br />
                  <br />
                  <strong>Mobile:</strong>{" "}
                  {singleUserData?.provideruserRelation?.mobile
                    ? singleUserData?.provideruserRelation?.mobile
                    : "-"}
                  <br />
                  <br />
                  <strong>Role:</strong>{" "}
                  {singleUserData?.provideruserRelation?.role
                    ? singleUserData?.provideruserRelation?.role
                    : "-"}
                </div>
                <div className={gridStyles.gridItem}>
                  <strong>AddressLine1:</strong>{" "}
                  {singleUserData?.addressLine1
                    ? singleUserData?.addressLine1
                    : "-"}
                  <br />
                  <br />
                  <strong>Organization:</strong>
                  {"  "}
                  {singleUserData?.organization
                    ? singleUserData?.organization
                    : "-"}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminHome;
