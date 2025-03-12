import axios from "axios";
const baseUrl = import.meta.env.VITE_SUNBIRD_DROPDOWN_VALUES_URL;

const getDropdownValues = async () => {
  let response = null;
  await axios
    .get(baseUrl)
    .then((res) => {
      response = res;
    })
    .catch((error) => {
      response = error;
    });
  return response;
};

export default getDropdownValues;
