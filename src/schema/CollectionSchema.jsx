import * as yup from "yup";

const CollectionSchema = yup.object().shape({
  title: yup.string().required("*Field required"),
  description: yup.string().required("*Field required"),
  language: yup.string().required("*Field required"),
  themes: yup.string().required("*Field required"),
  publisher: yup.string().required("*Field required"),
  author: yup.string().required("*Field required"),
  minAge: yup.string().required("*Field required"),
  maxAge: yup.string().required("*Field required"),
  domain: yup.string().required("*Field required"),
  // goal: yup.string().required("*Field required"),
  learningObjectives: yup.string().required("*Field required"),
});

export default CollectionSchema;
