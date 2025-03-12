import axios from "axios";
import { create } from "../routes/links";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const userRegisterApi = async (data) => {
  console.log(data);

  localStorage.setItem("userName", data.userName);

  const username = data.userName;
  const email = data.userEmail;
  const password = data.password;
  const organization = data.organization;
  const secret = data.secretCode;
  const role = 1;

  let result;
  await axios
    .post(
      `${baseUrl}/auth/local/register/`,

      {
        username: username,
        email: email,
        password: password,
        organization: organization,
        role: role,
        secret: secret,
      }
    )
    .then((res) => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.jwt);

      localStorage.setItem("registerJwt", res.data.jwt);

      if (res.status === 200) {
        result = true;
      } else if (res.status === 400) {
        result = false;
      }
    })
    .catch(function (error) {
      console.log(error.response.data.error.message);
      let err = 0;
      alert(error.response.data.error.message);
      return err;
    });

  return result;
};

export default userRegisterApi;
