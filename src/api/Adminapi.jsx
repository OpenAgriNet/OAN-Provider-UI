// Adminapi.jsx
import axios from "axios";
import { create } from "../routes/links";
import {
  get,
  post,
  update as coreUpdate,
  patch,
  distory,
  handleResponseException,
} from "./index";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

import {api} from '../config/ICAR-Config'

export const adminRegisterApi = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/admin/registerAdmin`, params, {
      headers,
    });
    if (result.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const userApprove = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await patch(`${baseUrl}/admin/approval/${id}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getAllProviderList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}/admin/getProviderList`, {
      headers,
    });

    if (result?.data) {
      // const response = await filterUserData(result?.data?.data?.User);
      return result?.data?.data?.User;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const createContentApi = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}${api.endpoints.createContent}`, params, { headers });
    if (result.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const userEnableDisable = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await patch(`${baseUrl}/admin/enable/${id}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getProviderInfo = async (id, params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}/admin/getProviderInfo/${id}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.Provider[0];
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};


export const getContent = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}${api.endpoints.getContent}`, {
      headers,
    });

    if (result?.data) {
      return result.data; 
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};


export const updateContent = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await patch(`${baseUrl}${api.endpoints.updateContent}/${id}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const resetPassword = async (params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await patch(`${baseUrl}/${api.endpoints.resetPassword}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getAllSeekerList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}/admin/getSeekerList`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.User;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const createNewCollection = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/provider/collection`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};
export const getCollectionList = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}${api.endpoints.getCollectionList}`, {
      headers,
    });

    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const createNewContentCollection = async (params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/${api.endpoints.createNewContentCollection}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getCollectionInfo = async (id, params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}/${api.endpoints.getCollectionInfo}/${id}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.collection[0];
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const deleteCurrentContentCollection = async (
  id,
  params = {},
  header = {}
) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await distory(
      `${baseUrl}/provider/contentCollection/${id}`,
      {},
      {
        headers: headers ? headers : {},
      }
    );

    if (result?.data?.data) {
      return result.data?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const uploadImage = async (params = {}, header = {}) => {
  let headers = {
    "Content-Type": "multipart/form-data",
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}${api.endpoints.uploadImage}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const uploadCSV = async (params = {}, header = {}) => {
  let headers = {
    "Content-Type": "multipart/form-data",
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  try {
    const result = await post(`${baseUrl}/${api.endpoints.uploadCSV}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const deleteCollection = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await distory(
      `${baseUrl}/provider/collection/${id}`,
      {},
      {
        headers: headers ? headers : {},
      }
    );

    if (result?.data) {
      return result.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const updateCollection = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await patch(`${baseUrl}/provider/collection/${id}`, params, {
      headers,
    });
    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getContentById = async (item_id, params = {}, header = {}) => {
  let headers = {
    ...header,
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  try {
    const result = await get(`${baseUrl}${api.endpoints.getContentById}/${item_id}`, {
      headers,
    });

    if (result?.data) {
      return result?.data?.data?.icar_?.Content[0];
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const deleteContentbyId = async (id, params = {}, header = {}) => {
  try {
    let headers = {
      ...header,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const result = await distory(
      `${baseUrl}${api.endpoints.deleteContentById}/${id}`,
      {},
      {
        headers: headers ? headers : {},
      }
    );

    if (result?.data?.data) {
      return result.data?.data;
    } else {
      return {};
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};

export const getImageUrl = async (params = {}, header = {}) => {
  let headers = {
    ...header,
  };

  try {
    const result = await get(`${baseUrl}/provider/getImageUrl/${params}`, {
      headers,
    });

    if (result?.data) {
      return result?.data;
    } else {
      return [];
    }
  } catch ({ response, message }) {
    return {
      status: response?.status ? response?.status : 404,
      error: response?.data?.message ? response?.data?.message : message,
    };
  }
};
