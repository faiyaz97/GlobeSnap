import {
    MoreHorizIcon ,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    AddPhotoAlternateOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
    Autocomplete,
    TextField 
  } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  import countries from 'data/countries.json';
  
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
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    
  
    const handlePost = async () => {
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
    
  
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);
      setImageUrl(null)
      setPost("");
      setSelectedCountry(null);

    };
  
    return (
      <WidgetWrapper>
        {isImage && (
          <Box mb="1.5rem">
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
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
                        setImage(null)
                        setImageUrl(null)
                      }}
                      sx={{mr: "40px"}}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  ) : (
                    <FlexBetween sx={{mr: "74px"}}>
                    </FlexBetween>
                    
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
                      "&:hover": { cursor: "pointer" }  
                    }}
                  >
                    <input {...getInputProps()} />
                    {!imageUrl  ? (
                            <Typography>
                            Add Picture
                            </Typography>
                          ) : (
                            <img src={imageUrl} alt="uploaded" height="200px" />
                          )}
                  </Box>
                
                </FlexBetween>
              )}
            </Dropzone>
            
          </Box>
        )}
        

      
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
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
            justifyContent: "space-between",
            alignItems: "center",
            pl: "74px",
            pt: "1rem"
          }}
        >
          <FlexBetween
            
            sx={{ gap: "1.5rem" }}
          >

            <Autocomplete
            sx={{
              backgroundColor: palette.neutral.light, // Add any style you want here
              '& .MuiOutlinedInput-root': {
                borderRadius: "100px",
                width:"12rem",
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
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
                <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
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
                  label= "Country"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: selectedCountry ? (
                      <img src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} alt={`${selectedCountry.name} flag`} />
                    ) : null,
                  }}
                />
              )}
            />


            <AddPhotoAlternateOutlined 
              sx={{ fontSize: '2rem', color: mediumMain, "&:hover": { cursor: "pointer", color: medium } }} 
              onClick={() => {
                setIsImage(!isImage)
                if(isImage){
                  setImage(null)
                  setImageUrl(null)
                }
              }}
              
              />
          </FlexBetween>

        
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              disabled={!post || !selectedCountry}
              onClick={handlePost}
              sx={{
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
                marginLeft: "1rem",
              }}
            >
              POST
            </Button>
          </Box>
        </Box>
  
  
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;
