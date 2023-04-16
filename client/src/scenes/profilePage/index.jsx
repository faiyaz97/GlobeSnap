import { Box, useMediaQuery } from "@mui/material";
import MapChart from "components/MapChart";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box display="flex" justifyContent="center">
        <Box
          width={isNonMobileScreens ? "68%" : "100%"}
          padding={isNonMobileScreens ? "2rem 3%" : "2rem 6%"}
        >
          <Box>
            <UserWidget userId={userId} picturePath={user.picturePath} />
          </Box>
          <Box paddingTop="2rem">
            <MapChart user={user} />
          </Box>
        </Box>
      </Box>

      <Box
        width="100%"
        padding="0 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {isNonMobileScreens ? (
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <FriendListWidget userId={userId} />
            <Box m="2rem 0" />
          </Box>
        ) : (
          <></>
        )}

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />

          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
