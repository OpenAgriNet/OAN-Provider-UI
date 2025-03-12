import axios from "axios";
import { create } from "../routes/links";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const uploadApi = async (data, id) => {
  console.log("Data in upload API");
  console.log(data, "data", id);

  const title = data.contentName;
  const language = data.language;
  const theme = data.theme;
  const contentType = data.contentType;
  const contentLink = data.contentLink;
  const description = data.description;
  const competency = data.compentencies;
  const domain = data.contentDomain;
  const goal = data.contentGoal;

  let result = true;
  await axios
    .post(`${baseUrl}/fln-contents`, {
      data: {
        title: title,
        description: description,
        language: language,
        link: contentLink,
        contentType: contentType,
        domain: domain,
        goal: goal,
        competency: competency,
        themes: theme,
        sourceOrganisation: "Tekdi",
        user_id: id,
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

export default uploadApi;
