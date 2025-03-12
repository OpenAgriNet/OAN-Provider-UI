import axios from "axios";
import { create } from "../routes/links";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const deleteApi = async (data) => {
  console.log(data);

  const id = data;

  let result;
  await axios
    .delete(`${baseUrl}/fln-contents/` + id, {
      data: {
        id: id,
      },
    })
    .then((res) => {
      console.log(res);
      console.log(res.data);

      if (res.status === 200) {
        result = true;
      } else {
        result = false;
      }
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      let err = 0;
      return err;
    });

  return result;
};

export default deleteApi;
