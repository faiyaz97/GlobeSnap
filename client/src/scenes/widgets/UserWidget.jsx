import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Instagram,
  Facebook,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(null);

  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setPostCount(data.length);
    console.log(data.length);
  };

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { firstName, lastName, location, viewedProfile, impressions, friends } =
    user;

  return (
    <WidgetWrapper>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ marginRight: "0.5rem" }}>
            {location.id}
          </Typography>
          <img
            src={`https://flagcdn.com/w20/${location.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${location.code.toLowerCase()}.png 2x`}
            alt={location.name}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Add this line
            alignItems: "center",
            justifyContent: "center",
            mt: "1rem",
          }}
        >
          <Box>
            <UserImage image={picturePath} size="100px" />
          </Box>
          <Box>
            <Typography
              variant="h4"
              fontWeight="500"
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
          </Box>
          <Box sx={{ mt: "0.75rem" }}>
            <Typography variant="body1" color={main}>
              Questa e' la vita nostra. Ciao!
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ m: "1.5rem 0" }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">Posts</Typography>
          <Typography variant="body1" color={main} sx={{ textAlign: "center" }}>
            {postCount}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6">Followers</Typography>
          <Typography variant="body1" color={main} sx={{ textAlign: "center" }}>
            {user.followers.length}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6">Following</Typography>
          <Typography variant="body1" color={main} sx={{ textAlign: "center" }}>
            {user.following.length}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ m: "1.5rem 0" }} />

      <FlexBetween gap="1rem" mb="0.5rem">
        <FlexBetween gap="1rem">
          <Instagram fontSize="large" />
          <Box>
            <Typography color={main} fontWeight="500">
              Instagram.user
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <FlexBetween gap="1rem" mb="0.5rem">
        <FlexBetween gap="1rem">
          <Facebook fontSize="large" />
          <Box>
            <Typography color={main} fontWeight="500">
              Facebook.user
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default UserWidget;
