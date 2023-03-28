import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Autocomplete
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  location: yup.mixed().required("required"),
  picture: yup
  .mixed()
  .test("fileSelected", "Picture is required", (value) => {
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
      if (value === 'location') {
        formData.append(value, JSON.stringify(values[value]));
      } else {
        formData.append(value, values[value]);
      }
    }
    formData.append("picturePath", values.picture.name);
  
    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();
  
    if (savedUser) {
      setImageUrl("")
      setPageType("login");
      toast.success("Registration successful! Please login with your credentials.");
    }
  };
  

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    console.log("loggedIn: ", loggedIn);
    onSubmitProps.resetForm();
    if (loggedIn.msg === "Success") {
      console.log("sempre?")
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    } else{
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
          validateField
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
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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
                          height= "130px"
                          width="130px"
                          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!imageUrl  ? (
                            <Typography>
                            Add Picture
                            </Typography>
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
                      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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
                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
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
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
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
                              <img src={`https://flagcdn.com/w20/${values.location.code.toLowerCase()}.png`} alt={`${values.location.name} flag`} />
                            ) : null
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


const countries = [
  {
    id: 'ALB',
    name: 'Albania',
    coordinates: [ '41.1533', '20.1683' ],
    code: 'al'
  },
  {
    id: 'AND',
    name: 'Andorra',
    coordinates: [ '42.5063', '1.5218' ],
    code: 'ad'
  },
  {
    id: 'AGO',
    name: 'Angola',
    coordinates: [ '-11.2027', '17.8739' ],
    code: 'ao'
  },
  {
    id: 'ATG',
    name: 'Antigua and Barbuda',
    coordinates: [ '17.0608', '-61.7964' ],
    code: 'ag'
  },
  {
    id: 'ARG',
    name: 'Argentina',
    coordinates: [ '-38.4161', '-63.6167' ],
    code: 'ar'
  },
  {
    id: 'ARM',
    name: 'Armenia',
    coordinates: [ '40.0691', '45.0382' ],
    code: 'am'
  },
  {
    id: 'AUS',
    name: 'Australia',
    coordinates: [ '-25.2744', '133.7751' ],
    code: 'au'
  },
  {
    id: 'AUT',
    name: 'Austria',
    coordinates: [ '47.5162', '14.5501' ],
    code: 'at'
  },
  {
    id: 'AZE',
    name: 'Azerbaijan',
    coordinates: [ '40.1431', '47.5769' ],
    code: 'az'
  },
  {
    id: 'BHS',
    name: 'Bahamas',
    coordinates: [ '25.0343', '-77.3963' ],
    code: 'bs'
  },
  {
    id: 'BHR',
    name: 'Bahrain',
    coordinates: [ '26.0667', '50.5577' ],
    code: 'bh'
  },
  {
    id: 'BGD',
    name: 'Bangladesh',
    coordinates: [ '23.6850', '90.3563' ],
    code: 'bd'
  },
  {
    id: 'BRB',
    name: 'Barbados',
    coordinates: [ '13.1939', '-59.5432' ],
    code: 'bb'
  },
  {
    id: 'BLR',
    name: 'Belarus',
    coordinates: [ '53.7098', '27.9534' ],
    code: 'by'
  },
  {
    id: 'BEL',
    name: 'Belgium',
    coordinates: [ '50.5039', '4.4699' ],
    code: 'be'
  },
  {
    id: 'BLZ',
    name: 'Belize',
    coordinates: [ '17.1899', '-88.4976' ],
    code: 'bz'
  },
  {
    id: 'BEN',
    name: 'Benin',
    coordinates: [ '9.3077', '2.3158' ],
    code: 'bj'
  },
  {
    id: 'BTN',
    name: 'Bhutan',
    coordinates: [ '27.5142', '90.4336' ],
    code: 'bt'
  },
  {
    id: 'BOL',
    name: 'Bolivia',
    coordinates: [ '-16.2902', '-63.5887' ],
    code: 'bo'
  },
  {
    id: 'BIH',
    name: 'Bosnia and Herzegovina',
    coordinates: [ '43.9159', '17.6791' ],
    code: 'ba'
  },
  {
    id: 'BWA',
    name: 'Botswana',
    coordinates: [ '-22.3285', '24.6849' ],
    code: 'bw'
  },
  {
    id: 'BRA',
    name: 'Brazil',
    coordinates: [ '-14.2350', '-51.9253' ],
    code: 'br'
  },
  {
    id: 'BRN',
    name: 'Brunei',
    coordinates: [ '4.5353', '114.7277' ],
    code: 'bn'
  },
  {
    id: 'BGR',
    name: 'Bulgaria',
    coordinates: [ '42.7339', '25.4858' ],
    code: 'bg'
  },
  {
    id: 'BFA',
    name: 'Burkina Faso',
    coordinates: [ '12.2383', '-1.5616' ],
    code: 'bf'
  },
  {
    id: 'BDI',
    name: 'Burundi',
    coordinates: [ '-3.3731', '29.9189' ],
    code: 'bi'
  },
  {
    id: 'KHM',
    name: 'Cambodia',
    coordinates: [ '12.5657', '104.9910' ],
    code: 'kh'
  },
  {
    id: 'CMR',
    name: 'Cameroon',
    coordinates: [ '7.3697', '12.3547' ],
    code: 'cm'
  },
  {
    id: 'CAN',
    name: 'Canada',
    coordinates: [ '56.1304', '-106.3468' ],
    code: 'ca'
  },
  {
    id: 'CPV',
    name: 'Cape Verde',
    coordinates: [ '15.1111', '-23.6167' ],
    code: 'cv'
  },
  {
    id: 'CAF',
    name: 'Central African Republic',
    coordinates: [ '6.6111', '20.9394' ],
    code: 'cf'
  },
  {
    id: 'TCD',
    name: 'Chad',
    coordinates: [ '15.4542', '18.7322' ],
    code: 'td'
  },
  {
    id: 'CHL',
    name: 'Chile',
    coordinates: [ '-35.6751', '-71.5430' ],
    code: 'cl'
  },
  {
    id: 'CHN',
    name: 'China',
    coordinates: [ '35.8617', '104.1954' ],
    code: 'cn'
  },
  {
    id: 'COL',
    name: 'Colombia',
    coordinates: [ '4.5709', '-74.2973' ],
    code: 'co'
  },
  {
    id: 'COM',
    name: 'Comoros',
    coordinates: [ '-11.6455', '43.3333' ],
    code: 'km'
  },
  {
    id: 'COG',
    name: 'Congo',
    coordinates: [ '-0.2280', '15.8277' ],
    code: 'cg'
  },
  {
    id: 'CRI',
    name: 'Costa Rica',
    coordinates: [ '9.7489', '-83.7534' ],
    code: 'cr'
  },
  {
    id: 'CIV',
    name: "Cote d'Ivoire",
    coordinates: [ '7.5399', '-5.5471' ],
    code: 'ci'
  },
  {
    id: 'HRV',
    name: 'Croatia',
    coordinates: [ '45.1000', '15.2000' ],
    code: 'hr'
  },
  {
    id: 'CUB',
    name: 'Cuba',
    coordinates: [ '21.5218', '-77.7812' ],
    code: 'cu'
  },
  {
    id: 'CUW',
    name: 'Curacao',
    coordinates: [ '12.1696', '-68.9900' ],
    code: 'cw'
  },
  {
    id: 'CYP',
    name: 'Cyprus',
    coordinates: [ '35.1264', '33.4299' ],
    code: 'cy'
  },
  {
    id: 'CZE',
    name: 'Czechia',
    coordinates: [ '49.8175', '15.4730' ],
    code: 'cz'
  },
  {
    id: 'COD',
    name: 'Democratic Republic of Congo',
    coordinates: [ '-4.0383', '21.7587' ],
    code: 'cd'
  },
  {
    id: 'DNK',
    name: 'Denmark',
    coordinates: [ '56.2639', '9.5018' ],
    code: 'dk'
  },
  {
    id: 'DJI',
    name: 'Djibouti',
    coordinates: [ '11.8251', '42.5903' ],
    code: 'dj'
  },
  {
    id: 'DMA',
    name: 'Dominica',
    coordinates: [ '15.4150', '-61.3710' ],
    code: 'dm'
  },
  {
    id: 'DOM',
    name: 'Dominican Republic',
    coordinates: [ '18.7357', '-70.1627' ],
    code: 'do'
  },
  {
    id: 'ECU',
    name: 'Ecuador',
    coordinates: [ '-1.8312', '-78.1834' ],
    code: 'ec'
  },
  {
    id: 'EGY',
    name: 'Egypt',
    coordinates: [ '26.8206', '30.8025' ],
    code: 'eg'
  },
  {
    id: 'SLV',
    name: 'El Salvador',
    coordinates: [ '13.7942', '-88.8965' ],
    code: 'sv'
  },
  {
    id: 'GNQ',
    name: 'Equatorial Guinea',
    coordinates: [ '1.6508', '10.2679' ],
    code: 'gq'
  },
  {
    id: 'ERI',
    name: 'Eritrea',
    coordinates: [ '15.1794', '39.7823' ],
    code: 'er'
  },
  {
    id: 'EST',
    name: 'Estonia',
    coordinates: [ '58.5953', '25.0136' ],
    code: 'ee'
  },
  {
    id: 'SWZ',
    name: 'Eswatini',
    coordinates: [ '-26.5225', '31.4659' ],
    code: 'sz'
  },
  {
    id: 'ETH',
    name: 'Ethiopia',
    coordinates: [ '9.1450', '40.4897' ],
    code: 'et'
  },
  {
    id: 'FJI',
    name: 'Fiji',
    coordinates: [ '17.7134', '178.0650' ],
    code: 'fj'
  },
  {
    id: 'FIN',
    name: 'Finland',
    coordinates: [ '61.9241', '25.7482' ],
    code: 'fi'
  },
  {
    id: 'FRA',
    name: 'France',
    coordinates: [ '46.2276', '2.2137' ],
    code: 'fr'
  },
  {
    id: 'GUF',
    name: 'French Guiana',
    coordinates: [ '3.9339', '-53.1258' ],
    code: 'gf'
  },
  {
    id: 'ATF',
    name: 'French Southern Territories',
    coordinates: [ '-49.2803', '69.3486' ],
    code: 'tf'
  },
  {
    id: 'GAB',
    name: 'Gabon',
    coordinates: [ '0.8037', '11.6094' ],
    code: 'ga'
  },
  {
    id: 'GMB',
    name: 'Gambia',
    coordinates: [ '13.4432', '-15.3101' ],
    code: 'gm'
  },
  {
    id: 'GEO',
    name: 'Georgia',
    coordinates: [ '42.3154', '43.3569' ],
    code: 'us-ga'
  },
  {
    id: 'DEU',
    name: 'Germany',
    coordinates: [ '51.1657', '10.4515' ],
    code: 'de'
  },
  {
    id: 'GHA',
    name: 'Ghana',
    coordinates: [ '7.9465', '-1.0232' ],
    code: 'gh'
  },
  {
    id: 'GRC',
    name: 'Greece',
    coordinates: [ '39.0742', '21.8243' ],
    code: 'gr'
  },
  {
    id: 'GRL',
    name: 'Greenland',
    coordinates: [ '71.7069', '-42.6043' ],
    code: 'gl'
  },
  {
    id: 'GRD',
    name: 'Grenada',
    coordinates: [ '12.1165', '-61.6789' ],
    code: 'gd'
  },
  {
    id: 'GLP',
    name: 'Guadeloupe',
    coordinates: [ '16.2500', '-61.5833' ],
    code: 'gp'
  },
  {
    id: 'GUM',
    name: 'Guam',
    coordinates: [ '13.4443', '144.7937' ],
    code: 'gu'
  },
  {
    id: 'GTM',
    name: 'Guatemala',
    coordinates: [ '15.7835', '-90.2308' ],
    code: 'gt'
  },
  {
    id: 'GGY',
    name: 'Guernsey',
    coordinates: [ '49.4482', '-2.5895' ],
    code: 'gg'
  },
  {
    id: 'GIN',
    name: 'Guinea',
    coordinates: [ '9.9456', '-9.6966' ],
    code: 'gn'
  },
  {
    id: 'GNB',
    name: 'Guinea-Bissau',
    coordinates: [ '11.8037', '-15.1804' ],
    code: 'gw'
  },
  {
    id: 'GUY',
    name: 'Guyana',
    coordinates: [ '4.8604', '-58.9302' ],
    code: 'gy'
  },
  {
    id: 'HTI',
    name: 'Haiti',
    coordinates: [ '18.9712', '-72.2852' ],
    code: 'ht'
  },
  {
    id: 'HND',
    name: 'Honduras',
    coordinates: [ '15.2000', '-86.2419' ],
    code: 'hn'
  },
  {
    id: 'HUN',
    name: 'Hungary',
    coordinates: [ '47.1625', '19.5033' ],
    code: 'hu'
  },
  {
    id: 'ISL',
    name: 'Iceland',
    coordinates: [ '64.9631', '-19.0208' ],
    code: 'is'
  },
  {
    id: 'IND',
    name: 'India',
    coordinates: [ '20.5937', '78.9629' ],
    code: 'in'
  },
  {
    id: 'IDN',
    name: 'Indonesia',
    coordinates: [ '-0.7893', '113.9213' ],
    code: 'id'
  },
  {
    id: 'IRN',
    name: 'Iran',
    coordinates: [ '32.4279', '53.6880' ],
    code: 'ir'
  },
  {
    id: 'IRQ',
    name: 'Iraq',
    coordinates: [ '33.2232', '43.6793' ],
    code: 'iq'
  },
  {
    id: 'ISR',
    name: 'Israel',
    coordinates: [ '31.0461', '34.8516' ],
    code: 'il'
  },
  {
    id: 'ITA',
    name: 'Italy',
    coordinates: [ '41.8719', '12.5674' ],
    code: 'it'
  },
  {
    id: 'JAM',
    name: 'Jamaica',
    coordinates: [ '18.1096', '-77.2975' ],
    code: 'jm'
  },
  {
    id: 'JPN',
    name: 'Japan',
    coordinates: [ '36.2048', '138.2529' ],
    code: 'jp'
  },
  {
    id: 'JOR',
    name: 'Jordan',
    coordinates: [ '30.5852', '36.2384' ],
    code: 'jo'
  },
  {
    id: 'KAZ',
    name: 'Kazakhstan',
    coordinates: [ '48.0196', '66.9237' ],
    code: 'kz'
  },
  {
    id: 'KEN',
    name: 'Kenya',
    coordinates: [ '-0.0236', '37.9062' ],
    code: 'ke'
  },
  {
    id: 'KIR',
    name: 'Kiribati',
    coordinates: [ '-3.3704', '-168.7340' ],
    code: 'ki'
  },
  {
    id: 'KWT',
    name: 'Kuwait',
    coordinates: [ '29.3117', '47.4818' ],
    code: 'kw'
  },
  {
    id: 'KGZ',
    name: 'Kyrgyzstan',
    coordinates: [ '41.2044', '74.7661' ],
    code: 'kg'
  },
  {
    id: 'LAO',
    name: 'Laos',
    coordinates: [ '19.8563', '102.4955' ],
    code: 'la'
  },
  {
    id: 'LVA',
    name: 'Latvia',
    coordinates: [ '56.8796', '24.6032' ],
    code: 'lv'
  },
  {
    id: 'LBN',
    name: 'Lebanon',
    coordinates: [ '33.8547', '35.8623' ],
    code: 'lb'
  },
  {
    id: 'LSO',
    name: 'Lesotho',
    coordinates: [ '-29.6099', '28.2336' ],
    code: 'ls'
  },
  {
    id: 'LBR',
    name: 'Liberia',
    coordinates: [ '6.4281', '-9.4295' ],
    code: 'lr'
  },
  {
    id: 'LBY',
    name: 'Libya',
    coordinates: [ '26.3351', '17.2283' ],
    code: 'ly'
  },
  {
    id: 'LIE',
    name: 'Liechtenstein',
    coordinates: [ '47.1660', '9.5554' ],
    code: 'li'
  },
  {
    id: 'LTU',
    name: 'Lithuania',
    coordinates: [ '55.1694', '23.8813' ],
    code: 'lt'
  },
  {
    id: 'LUX',
    name: 'Luxembourg',
    coordinates: [ '49.8153', '6.1296' ],
    code: 'lu'
  },
  {
    id: 'MDG',
    name: 'Madagascar',
    coordinates: [ '18.7669', '46.8691' ],
    code: 'mg'
  },
  {
    id: 'MWI',
    name: 'Malawi',
    coordinates: [ '13.2543', '34.3015' ],
    code: 'mw'
  },
  {
    id: 'MYS',
    name: 'Malaysia',
    coordinates: [ '4.2105', '101.9758' ],
    code: 'my'
  },
  {
    id: 'MDV',
    name: 'Maldives',
    coordinates: [ '3.2028', '73.2207' ],
    code: 'mv'
  },
  {
    id: 'MLI',
    name: 'Mali',
    coordinates: [ '17.5707', '-3.9962' ],
    code: 'ml'
  },
  {
    id: 'MLT',
    name: 'Malta',
    coordinates: [ '35.9375', '14.3754' ],
    code: 'mt'
  },
  {
    id: 'MHL',
    name: 'Marshall Islands',
    coordinates: [ '7.1315', '171.1845' ],
    code: 'mh'
  },
  {
    id: 'MRT',
    name: 'Mauritania',
    coordinates: [ '21.0079', '-10.9408' ],
    code: 'mr'
  },
  {
    id: 'MUS',
    name: 'Mauritius',
    coordinates: [ '-20.3484', '57.5522' ],
    code: 'mu'
  },
  {
    id: 'MEX',
    name: 'Mexico',
    coordinates: [ '23.6345', '-102.5528' ],
    code: 'mx'
  },
  {
    id: 'FSM',
    name: 'Micronesia',
    coordinates: [ '6.8874', '158.2151' ],
    code: 'fm'
  },
  {
    id: 'MDA',
    name: 'Moldova',
    coordinates: [ '47.4116', '28.3699' ],
    code: 'md'
  },
  {
    id: 'MCO',
    name: 'Monaco',
    coordinates: [ '43.7384', '7.4246' ],
    code: 'mc'
  },
  {
    id: 'MNG',
    name: 'Mongolia',
    coordinates: [ '46.8625', '103.8467' ],
    code: 'mn'
  },
  {
    id: 'MNE',
    name: 'Montenegro',
    coordinates: [ '42.7087', '19.3744' ],
    code: 'me'
  },
  {
    id: 'MAR',
    name: 'Morocco',
    coordinates: [ '31.7917', '-7.0926' ],
    code: 'ma'
  },
  {
    id: 'MOZ',
    name: 'Mozambique',
    coordinates: [ '18.6657', '35.5296' ],
    code: 'mz'
  },
  {
    id: 'MMR',
    name: 'Myanmar',
    coordinates: [ '21.9162', '95.9560' ],
    code: 'mm'
  },
  {
    id: 'NAM',
    name: 'Namibia',
    coordinates: [ '22.9576', '18.4904' ],
    code: 'na'
  },
  {
    id: 'NRU',
    name: 'Nauru',
    coordinates: [ '-0.5228', '166.9315' ],
    code: 'nr'
  },
  {
    id: 'NPL',
    name: 'Nepal',
    coordinates: [ '28.3949', '84.1240' ],
    code: 'np'
  },
  {
    id: 'NLD',
    name: 'Netherlands',
    coordinates: [ '52.1326', '5.2913' ],
    code: 'nl'
  },
  {
    id: 'NCL',
    name: 'New Caledonia',
    coordinates: [ '20.9043', '165.6180' ],
    code: 'nc'
  },
  {
    id: 'NZL',
    name: 'New Zealand',
    coordinates: [ '-40.9006', '174.8860' ],
    code: 'nz'
  },
  {
    id: 'NIC',
    name: 'Nicaragua',
    coordinates: [ '12.8654', '-85.2072' ],
    code: 'ni'
  },
  {
    id: 'NER',
    name: 'Niger',
    coordinates: [ '17.6078', '8.0817' ],
    code: 'ne'
  },
  {
    id: 'NGA',
    name: 'Nigeria',
    coordinates: [ '9.0820', '8.6753' ],
    code: 'ng'
  },
  {
    id: 'PRK',
    name: 'North Korea',
    coordinates: [ '40.3399', '127.5101' ],
    code: 'kp'
  },
  {
    id: 'MKD',
    name: 'North Macedonia',
    coordinates: [ '41.6086', '21.7453' ],
    code: 'mk'
  },
  {
    id: 'NOR',
    name: 'Norway',
    coordinates: [ '60.4720', '8.4689' ],
    code: 'no'
  },
  {
    id: 'OMN',
    name: 'Oman',
    coordinates: [ '21.4735', '55.9754' ],
    code: 'om'
  },
  {
    id: 'PAK',
    name: 'Pakistan',
    coordinates: [ '30.3753', '69.3451' ],
    code: 'pk'
  },
  {
    id: 'PLW',
    name: 'Palau',
    coordinates: [ '7.5149', '134.5825' ],
    code: 'pw'
  },
  {
    id: 'PAN',
    name: 'Panama',
    coordinates: [ '8.5375', '-80.7821' ],
    code: 'pa'
  },
  {
    id: 'PNG',
    name: 'Papua New Guinea',
    coordinates: [ '-6.3149', '143.9555' ],
    code: 'pg'
  },
  {
    id: 'PRY',
    name: 'Paraguay',
    coordinates: [ '25.2637', '-57.5759' ],
    code: 'py'
  },
  {
    id: 'PER',
    name: 'Peru',
    coordinates: [ '-9.1900', '-75.0152' ],
    code: 'pe'
  },
  {
    id: 'PHL',
    name: 'Philippines',
    coordinates: [ '12.8797', '121.7740' ],
    code: 'ph'
  },
  {
    id: 'POL',
    name: 'Poland',
    coordinates: [ '51.9194', '19.1451' ],
    code: 'pl'
  },
  {
    id: 'PRT',
    name: 'Portugal',
    coordinates: [ '38.7369', '-9.1424' ],
    code: 'pt'
  },
  {
    id: 'PRI',
    name: 'Puerto Rico',
    coordinates: [ '18.2208', '-66.5901' ],
    code: 'pr'
  },
  {
    id: 'QAT',
    name: 'Qatar',
    coordinates: [ '25.3548', '51.1839' ],
    code: 'qa'
  },
  {
    id: 'ROU',
    name: 'Romania',
    coordinates: [ '44.4268', '26.1025' ],
    code: 'ro'
  },
  {
    id: 'RUS',
    name: 'Russia',
    coordinates: [ '61.5240', '105.3188' ],
    code: 'ru'
  },
  {
    id: 'RWA',
    name: 'Rwanda',
    coordinates: [ '-1.9403', '29.8739' ],
    code: 'rw'
  },
  {
    id: 'KNA',
    name: 'Saint Kitts and Nevis',
    coordinates: [ '17.3578', '-62.7822' ],
    code: 'kn'
  },
  {
    id: 'LCA',
    name: 'Saint Lucia',
    coordinates: [ '13.9094', '-60.9789' ],
    code: 'lc'
  },
  {
    id: 'VCT',
    name: 'Saint Vincent and the Grenadines',
    coordinates: [ '13.2528', '-61.1971' ],
    code: 'vc'
  },
  {
    id: 'WSM',
    name: 'Samoa',
    coordinates: [ '-13.7590', '-172.1046' ],
    code: 'ws'
  },
  {
    id: 'SMR',
    name: 'San Marino',
    coordinates: [ '43.9424', '12.4578' ],
    code: 'sm'
  },
  {
    id: 'STP',
    name: 'Sao Tome and Principe',
    coordinates: [ '0.18636', '6.61308' ],
    code: 'st'
  },
  {
    id: 'SAU',
    name: 'Saudi Arabia',
    coordinates: [ '24.7136', '46.6753' ],
    code: 'sa'
  },
  {
    id: 'SEN',
    name: 'Senegal',
    coordinates: [ '14.7167', '-17.4677' ],
    code: 'sn'
  },
  {
    id: 'SRB',
    name: 'Serbia',
    coordinates: [ '44.0165', '21.0059' ],
    code: 'rs'
  },
  {
    id: 'SYC',
    name: 'Seychelles',
    coordinates: [ '-4.6796', '55.4920' ],
    code: 'sc'
  },
  {
    id: 'SLE',
    name: 'Sierra Leone',
    coordinates: [ '8.4606', '-11.7799' ],
    code: 'sl'
  },
  {
    id: 'SGP',
    name: 'Singapore',
    coordinates: [ '1.3521', '103.8198' ],
    code: 'sg'
  },
  {
    id: 'SVK',
    name: 'Slovakia',
    coordinates: [ '48.6690', '19.6990' ],
    code: 'sk'
  },
  {
    id: 'SVN',
    name: 'Slovenia',
    coordinates: [ '46.1512', '14.9955' ],
    code: 'si'
  },
  {
    id: 'SLB',
    name: 'Solomon Islands',
    coordinates: [ '-9.6457', '160.1562' ],
    code: 'sb'
  },
  {
    id: 'SOM',
    name: 'Somalia',
    coordinates: [ '2.0469', '45.3182' ],
    code: 'so'
  },
  {
    id: 'ZAF',
    name: 'South Africa',
    coordinates: [ '-30.5595', '22.9375' ],
    code: 'za'
  },
  {
    id: 'KOR',
    name: 'South Korea',
    coordinates: [ '35.9078', '127.7669' ],
    code: 'kr'
  },
  {
    id: 'SSD',
    name: 'South Sudan',
    coordinates: [ '4.8517', '31.5825' ],
    code: 'ss'
  },
  {
    id: 'ESP',
    name: 'Spain',
    coordinates: [ '40.4637', '-3.7492' ],
    code: 'es'
  },
  {
    id: 'LKA',
    name: 'Sri Lanka',
    coordinates: [ '7.8731', '80.7718' ],
    code: 'lk'
  },
  {
    id: 'SDN',
    name: 'Sudan',
    coordinates: [ '15.5007', '32.5599' ],
    code: 'sd'
  },
  {
    id: 'SUR',
    name: 'Suriname',
    coordinates: [ '5.8232', '-55.1679' ],
    code: 'sr'
  },
  {
    id: 'SWE',
    name: 'Sweden',
    coordinates: [ '59.6749', '14.5207' ],
    code: 'se'
  },
  {
    id: 'CHE',
    name: 'Switzerland',
    coordinates: [ '46.8182', '8.2275' ],
    code: 'ch'
  },
  {
    id: 'SYR',
    name: 'Syria',
    coordinates: [ '33.5138', '36.2765' ],
    code: 'sy'
  },
  {
    id: 'TWN',
    name: 'Taiwan',
    coordinates: [ '23.6978', '120.9605' ],
    code: 'tw'
  },
  {
    id: 'TJK',
    name: 'Tajikistan',
    coordinates: [ '38.8610', '71.2761' ],
    code: 'tj'
  },
  {
    id: 'TZA',
    name: 'Tanzania',
    coordinates: [ '6.3690', '34.8888' ],
    code: 'tz'
  },
  {
    id: 'THA',
    name: 'Thailand',
    coordinates: [ '15.8700', '100.9925' ],
    code: 'th'
  },
  {
    id: 'TLS',
    name: 'Timor-Leste',
    coordinates: [ '8.8740', '125.7275' ],
    code: 'tl'
  },
  {
    id: 'TGO',
    name: 'Togo',
    coordinates: [ '8.6195', '0.8248' ],
    code: 'tg'
  },
  {
    id: 'TON',
    name: 'Tonga',
    coordinates: [ '-21.1351', '-175.2049' ],
    code: 'to'
  },
  {
    id: 'TTO',
    name: 'Trinidad and Tobago',
    coordinates: [ '10.6918', '-61.2225' ],
    code: 'tt'
  },
  {
    id: 'TUN',
    name: 'Tunisia',
    coordinates: [ '33.8869', '9.5375' ],
    code: 'tn'
  },
  {
    id: 'TUR',
    name: 'Turkey',
    coordinates: [ '38.9637', '35.2433' ],
    code: 'tr'
  },
  {
    id: 'TKM',
    name: 'Turkmenistan',
    coordinates: [ '38.9697', '59.5563' ],
    code: 'tm'
  },
  {
    id: 'TUV',
    name: 'Tuvalu',
    coordinates: [ '-7.4782', '178.6799' ],
    code: 'tv'
  },
  {
    id: 'UGA',
    name: 'Uganda',
    coordinates: [ '1.3733', '32.2903' ],
    code: 'ug'
  },
  {
    id: 'UKR',
    name: 'Ukraine',
    coordinates: [ '48.3794', '31.1656' ],
    code: 'ua'
  },
  {
    id: 'ARE',
    name: 'United Arab Emirates',
    coordinates: [ '23.4241', '53.8478' ],
    code: 'ae'
  },
  {
    id: 'GBR',
    name: 'United Kingdom',
    coordinates: [ '55.3781', '3.4360' ],
    code: 'gb'
  },
  {
    id: 'USA',
    name: 'United States',
    coordinates: [ '37.0902', '-95.7129' ],
    code: 'us'
  },
  {
    id: 'URY',
    name: 'Uruguay',
    coordinates: [ '-32.5228', '-55.7658' ],
    code: 'uy'
  },
  {
    id: 'UZB',
    name: 'Uzbekistan',
    coordinates: [ '41.3775', '64.5853' ],
    code: 'uz'
  },
  {
    id: 'VUT',
    name: 'Vanuatu',
    coordinates: [ '-15.3767', '166.9592' ],
    code: 'vu'
  },
  {
    id: 'VEN',
    name: 'Venezuela',
    coordinates: [ '6.4238', '-66.5897' ],
    code: 've'
  },
  {
    id: 'VNM',
    name: 'Vietnam',
    coordinates: [ '14.0583', '108.2772' ],
    code: 'vn'
  },
  {
    id: 'ESH',
    name: 'Western Sahara',
    coordinates: [ '24.2155', '-12.8858' ],
    code: 'eh'
  },
  {
    id: 'YEM',
    name: 'Yemen',
    coordinates: [ '15.5527', '48.5164' ],
    code: 'ye'
  },
  {
    id: 'ZMB',
    name: 'Zambia',
    coordinates: [ '-13.1339', '27.8493' ],
    code: 'zm'
  },
  {
    id: 'ZWE',
    name: 'Zimbabwe',
    coordinates: [ '-19.0154', '29.1549' ],
    code: 'zw'
  }
]