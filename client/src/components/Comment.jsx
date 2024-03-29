import { Box, Typography, useTheme, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "state";
import { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment, postId }) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const { userId, text, timestamp } = comment;
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const [userDetails, setUserDetails] = useState(null);
  const dateTimeAgo = moment(new Date(timestamp)).fromNow();

  const fetchUserDetails = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useDispatch();

  const handleDeleteComment = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/posts/${postId}/comment/${comment._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      dispatch(deleteComment({ postId, commentId: comment._id }));
    } else {
      // Handle error here
    }
  };

  return (
    <Box display="flex" alignItems="flex-start" mb="1rem">
      {userDetails && userDetails.picturePath && (
        <Box
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            navigate(`/profile/${userId}`);
            navigate(0);
          }}
        >
          <img
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              marginRight: "1rem",
            }}
            width={30}
            height={30}
            alt="user"
            src={`${process.env.REACT_APP_BASE_URL}/assets/${userDetails.picturePath}`}
          />{" "}
        </Box>
      )}
      <Box display="flex" flexDirection="column" justifyContent="center">
        {userDetails && (
          <Typography
            variant="h6"
            sx={{
              "&:hover": {
                color: palette.primary.dark,
                cursor: "pointer",
              },
            }}
            onClick={() => {
              navigate(`/profile/${userId}`);
              navigate(0);
            }}
          >
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
        )}
        <Typography variant="h6" color={main}>
          {text}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dateTimeAgo}
        </Typography>
      </Box>
      <Box marginLeft="auto">
        {loggedInUserId === userId && (
          <Button
            size="small"
            onClick={handleDeleteComment}
            aria-label="delete"
            sx={{
              textTransform: "none",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Typography
              variant="caption"
              color={main}
              sx={{
                "&:hover": {
                  color: "red",
                },
              }}
            >
              Delete
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Comment;
