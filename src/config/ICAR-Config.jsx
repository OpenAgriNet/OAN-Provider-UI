// ICAR-Config.jsx
import AppLogoImg from "../assets/Oan-logo.png";
import Avatar from "../assets/aavtar.jpeg";

export const siteConfig = {
  siteName: "AgriNet: An Open Network for Global Agriculture",
};

export const colors = {
  primaryButtonColor: {
    default: "#3e6139",
    hover: "#5f815b",
    text: "#fff",
  },
  secondaryButtonColor: {
    default: "#ffffff",
    hover: "#f1f1f1",
    borderColor: "#3e6139",
    text: "#3e6139",
  },
  editModalButtonColors: {
    cancelButton: {
      default: "#6c757d",
      hover: "#5c636a",
      borderColor: "none",
      text: "#fff",
    },
    deleteButton: {
      default: "#ff4d4f",
      hover: "#ff7875",
      text: "#fff",
    },
    saveChangesButton: {
      default: "#0d6efd",
      hover: "#3989ff",
      borderColor: "none",
      text: "#fff",
    },
  },
  backButton: {
    title: "← Back",
    default: "#3e6139",
    hover: "#5f815b",
    text: "#fff",
  },
};

export const header = {
  headerContent: {
    appLogo: AppLogoImg,
    avatar: Avatar,
    appName: "AgriNet: An Open Network for Global Agriculture",
    appNameColor: "#4f6f4a",
  },
  button: {
    title: "Content",
    link: "/content",
  },
  dropdown: {
    menu1: "Reset my Password",
    menu2: "Logout",
  },
};

export const footer = {
  text: "Developed by",
  linkText: "Tekdi Technologies",
  linkUrl: "https://www.tekdi.net",
  linkColor: "#3e6139",
};

export const home = {
  heading1: "Hi,",
  heading2:
    "Welcome to the AgriNet network. You can Tag & Publish the Contents to the Network using this interface.",
  button: {
    button1: "PUBLISH CONTENT",
    button2: "LIST CONTENT",
  },
};

export const publishContent = {
  titles: {
    mainTitle:
      "Fill in the below details to register your content with AgriNet",
    formTitle: "Create a new Content Form",
  },
  formFields: {
    id: {
      label: "ID",
      placeholder: "Enter unique ID",
      validation: "id",
      type: "text",
    },
    provider_id: {
      label: "Provider ID",
      options: [
        { value: "", label: "Select Provider" },
        { value: "p1", label: "p1" },
      ],
      validation: "provider_id",
      type: "select",
    },
    title: {
      label: "Content Name",
      placeholder: "Enter content name",
      validation: "title",
      type: "text",
    },
    short_desc: {
      label: "Short Description",
      placeholder: "Enter short description",
      validation: "short_desc",
      type: "textarea",
    },
    long_desc: {
      label: "Long Description",
      placeholder: "Enter long description",
      validation: "long_desc",
      type: "textarea",
    },
    // item_img: {
    //   label: "Item Image",
    //   validation: "item_img",
    //   type: "file",
    // },
    item_img: {
      label: "Item Image",
      validation: "item_img",
      type: "text",
    },
    media_url: {
      label: "Media URL",
      placeholder: "Enter Media URL",
      validation: "url",
      type: "text",
    },
    item_medias: {
      label: "Media Type",
      options: [
        { value: "", label: "Select a Media Type" },
        { value: "application/pdf", label: "Pdf" },
      ],
      validation: "item_medias",
      type: "select",
    },
    item_categories: {
      label: "Select a Category",
      validation: "item_categories",
      type: "selectDynamic",
      options: [],
    },
    item_fulfillments: {
      label: "Select a Fulfillment",
      validation: "item_fulfillments",
      type: "selectDynamic",
      options: [],
    },
    item_location_state: {
      label: "Select State",
      validation: "item_location_state",
      type: "selectDynamic",
      options: [],
    },
    item_location_city: {
      label: "Select City",
      validation: "item_location_city",
      type: "selectDynamic",
      options: [],
    },
    tags: {
      label: "Tags",
      validation: "tags",
      type: "tags",
      options: [],
    },
  },
  buttons: {
    submit: {
      label: "Submit",
    },
    reset: {
      label: "Reset",
    },
  },
};

export const contentList = {
  button: {
    button1: "New",
    button3: "Actions",
  },
  editModal: {
    title: "Edit Modal",
    subTitle:
      "To initiate edits, interact with the requisite fields and execute a 'Submit' action to preserve your alterations.",
    formFields: {
      id: {
        label: "ID",
        placeholder: "Enter unique ID",
        validation: "id",
        type: "text",
      },
      provider_id: {
        label: "Provider ID",
        options: [
          { value: "p1", label: "p1" },
        ],
        validation: "provider_id",
        type: "select",
      },
      content_name: {
        label: "Content Name",
        placeholder: "Enter content name",
        validation: "title",
        type: "text",
      },
      item_short_desc: {
        label: "Short Description",
        placeholder: "Enter short description",
        validation: "short_desc",
        type: "textarea",
      },
      item_long_desc: {
        label: "Long Description",
        placeholder: "Enter long description",
        validation: "long_desc",
        type: "textarea",
      },
      // item_img: {
      //   label: "Item Image",
      //   validation: "item_img",
      //   type: "file",
      // },
      item_img: {
        label: "Item Image",
        validation: "item_img",
        type: "text",
      },
      media_url: {
        label: "Media URL",
        placeholder: "Enter Media URL",
        validation: "url",
        type: "text",
      },
      item_medias: {
        label: "Media Type",
        options: [
          { value: "application/pdf", label: "Pdf" },
        ],
        validation: "item_medias",
        type: "select",
      },
      item_categories: {
        label: "Select a Category",
        type: "select",
        options: [], // This can be empty initially
      },
      item_fulfillments: {
        label: "Select a Fulfillment",
        type: "select",
        options: [],
      },
      item_location_state: {
        label: "Select State",
        type: "select",
        options: [],
      },
      item_location_city: {
        label: "Select City",
        type: "select",
        options: [],
      },      
      tags: {
        label: "Tags",
        validation: "tags",
        type: "tags",
        options: [],
      },
    },
    buttons: {
      cancelButton: "Cancel",
      deleteButton: "Delete",
      saveChangesButton: "Save Changes",
    },
  },
};

export const uploadCsv = {
  sampleCsv: {
    sampleCsvLinkText: "Sample CSV Format",
    sampleCsvLinkColor: "#ff0000",
    sampleCsvLink:
      "https://drive.usercontent.google.com/u/0/uc?id=1Gx4q2GgtCqSVWZS2sYEkCezlmBYPfi8k&export=download",
  },
  button: {
    uploadbutton: {
      title: "Upload",
      buttonColor: "#007bff",
      buttonHoverColor: "#1b89ff",
      buttonTextColor: "#ffffff",
    },
  },
};

export const api = {
  endpoints: {
    createContent: "provider/addContent",
    getContent: "provider/content",
    updateContent: "provider/editContent",
    getCollectionList: "provider/content",
    createNewContentCollection: "provider/contentCollection",
    getCollectionInfo: "provider/collection",
    uploadImage: "provider/uploadImage",
    uploadCSV: "provider/createBulkContent",
    getContentById: "provider/contentById",
    deleteContentById: "provider/deleteContent",
    resetPassword: "provider/resetPassword",
  },
};
