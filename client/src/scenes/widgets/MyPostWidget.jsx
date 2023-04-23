import { DeleteOutlined, AddPhotoAlternateOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Autocomplete,
  TextField,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setUser } from "state";
import countries from "data/countries.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyPostWidget = ({ picturePath }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    if (isImage) setIsImage(!isImage);
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    if (selectedCountry) {
      formData.append("location", JSON.stringify(selectedCountry));
    }

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const { posts, updatedUser } = await response.json();
      dispatch(setPosts({ posts }));
      dispatch(setUser({ user: updatedUser }));

      setImage(null);
      setImageUrl(null);
      setPost("");
      setSelectedCountry(null);

      toast.success("Post created successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("Post not created. Try again later.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <WidgetWrapper>
      {isImage && (
        <Box mb="1.5rem">
          <Dropzone
            acceptedFiles={["image/*"]}
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
              const fileUrl = URL.createObjectURL(acceptedFiles[0]);
              setImageUrl(fileUrl);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                {image ? (
                  <IconButton
                    onClick={() => {
                      setImage(null);
                      setImageUrl(null);
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                ) : (
                  <></>
                )}
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover": { cursor: "pointer" },
                  }}
                >
                  <input {...getInputProps()} accept="image/*" />
                  {!imageUrl ? (
                    <Typography>Add Picture</Typography>
                  ) : (
                    <img src={imageUrl} alt="uploaded" height="200px" />
                  )}
                </Box>
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <FlexBetween>
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          multiline
          sx={{
            width: "100%",
            minHeight: "6rem",
            backgroundColor: palette.neutral.light,
            borderRadius: "2px",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mt: "1rem",
          gap: "1rem",
        }}
      >
        <Box sx={{ flexGrow: 1, mr: "0" }}>
          <Autocomplete
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light, // Add any style you want here
              "& .MuiOutlinedInput-root": {
                borderRadius: "100px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
            options={countries}
            getOptionLabel={(option) => option.name}
            value={selectedCountry}
            onChange={(event, newValue) => {
              setSelectedCountry(newValue);
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
                label="Post location"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: selectedCountry ? (
                    <img
                      src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                      alt={`${selectedCountry.name} flag`}
                    />
                  ) : null,
                }}
              />
            )}
          />
        </Box>
        <Box>
          <AddPhotoAlternateOutlined
            sx={{
              fontSize: "2rem",
              color: mediumMain,
              "&:hover": { cursor: "pointer", color: medium },
            }}
            onClick={() => {
              setIsImage(!isImage);
              if (isImage) {
                setImage(null);
                setImageUrl(null);
              }
            }}
          />
        </Box>
        <Box>
          <Button
            disabled={!post || !selectedCountry}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </Box>
      </Box>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </WidgetWrapper>
  );
};

export default MyPostWidget;
