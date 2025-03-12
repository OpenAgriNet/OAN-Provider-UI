import * as yup from "yup";

const UserRegisterSchema = yup.object().shape({
  name: yup.string().required("*Field required"),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: yup.string().required("*Field required"),
  role: yup.string().required("*Field required"),
  organization: yup.string().required("*Field required"),
  source_code: yup.string().required("*Field required"),
});

export default UserRegisterSchema;
