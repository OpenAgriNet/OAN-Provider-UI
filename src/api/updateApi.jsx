import axios from "axios";
import { create } from "../routes/links";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const updateApi = async (data, id) => {
  const title = data.title;
  const language = data.language;
  const theme = data.themes;
  const contentType = data.contentType;
  const contentLink = data.link;
  const description = data.description;
  const competency = data.competency;
  const domain = data.domain;
  const goal = data.goal;

  let result;
  await axios
    .put(`${baseUrl}/fln-contents/` + id, {
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
      },
    })
    .then((res) => {
      if (res.status === 200) {
        result = true;
      } else {
        result = false;
      }
    })
    .catch(function (error) {
      console.log(error?.response);
      let err = 0;
      return err;
    });

  return result;
};

export default updateApi;
