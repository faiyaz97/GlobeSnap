import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Autocomplete,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countries from "data/countries.json";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  location: yup.mixed().required("required"),
  picture: yup.mixed().test("fileSelected", "Picture is required", (value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    } else {
      return !!value;
    }
  }),
  email: yup
    .string()
    .email("Invalid email address")
    .required("required")
    .test("emailComplete", "Enter the complete email", (value) => {
      if (value) {
        const [username, domain] = value.split("@");
        return !!username && !!domain && domain.includes(".");
      } else {
        return false;
      }
    }),
  password: yup
    .string()
    .required("required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])/,
      "Password must include at least one uppercase letter, one number, and one special character"
    ),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: null,
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [pageType, setPageType] = useState("login");
  useEffect(() => console.log(pageType), [pageType]);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      if (value === "location") {
        formData.append(value, JSON.stringify(values[value]));
      } else {
        formData.append(value, values[value]);
      }
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/register`,
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setImageUrl("");
      setPageType("login");
      toast.success(
        "Registration successful! Please login with your credentials."
      );
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const loggedIn = await loggedInResponse.json();
    console.log("loggedIn: ", loggedIn);
    onSubmitProps.resetForm();
    if (loggedIn.msg === "Success") {
      console.log("sempre?");
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    } else {
      toast.error(loggedIn.msg);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Box>
      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
          validateField,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <Box
                    gridColumn="span 4"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                        validateField("picture");
                        const fileUrl = URL.createObjectURL(acceptedFiles[0]);
                        setImageUrl(fileUrl);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          height="130px"
                          width="130px"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "&:hover": { cursor: "pointer" },
                          }}
                        >
                          <input {...getInputProps()} />
                          {!imageUrl ? (
                            <Typography>Add Picture</Typography>
                          ) : (
                            <img src={imageUrl} alt="uploaded" height="120" />
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>

                  {touched.picture && errors.picture && (
                    <Box
                      gridColumn="span 4"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      mt="-30px"
                    >
                      <Typography color="error" variant="caption">
                        {errors.picture}
                      </Typography>
                    </Box>
                  )}

                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <Box sx={{ gridColumn: "span 4" }}>
                    <Autocomplete
                      options={countries}
                      getOptionLabel={(option) => option.name}
                      value={values.location || null}
                      onChange={(event, value) => {
                        setFieldValue("location", value);
                      }}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            alt={`${option.name} flag`}
                          />
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country"
                          name="location"
                          onBlur={handleBlur}
                          error={Boolean(touched.location && errors.location)}
                          helperText={touched.location && errors.location}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: values.location ? (
                              <img
                                src={`https://flagcdn.com/w20/${values.location.code.toLowerCase()}.png`}
                                alt={`${values.location.name} flag`}
                              />
                            ) : null,
                          }}
                        />
                      )}
                    />
                  </Box>
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Register here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>

      <ToastContainer />
    </Box>
  );
};

export default Form;
