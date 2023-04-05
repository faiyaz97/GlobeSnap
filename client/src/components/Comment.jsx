import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "state";
import { useState, useEffect } from "react";
import moment from "moment";

const Comment = ({ comment, postId }) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const { userId, text, timestamp } = comment;
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const [userDetails, setUserDetails] = useState(null);
  const dateTimeAgo = moment(new Date(timestamp)).fromNow();

  const fetchUserDetails = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useDispatch();

  const handleDeleteComment = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment/${comment._id}`,
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
        <img
          style={{
            objectFit: "cover",
            borderRadius: "50%",
            marginRight: "1rem",
          }}
          width={30}
          height={30}
          alt="user"
          src={`http://localhost:3001/assets/${userDetails.picturePath}`}
        />
      )}
      <Box display="flex" flexDirection="column" justifyContent="center">
        {userDetails && (
          <Typography variant="h6">
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
