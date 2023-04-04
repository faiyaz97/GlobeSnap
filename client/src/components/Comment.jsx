import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";

const Comment = ({ comment, postId }) => {
  const { userId, text, timestamp } = comment;
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const handleDeleteComment = async () => {
    await fetch(
      `http://localhost:3001/posts/${postId}/comment/${comment._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="body1">{text}</Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(timestamp).toLocaleString()}
        </Typography>
      </Box>
      {loggedInUserId === userId && (
        <IconButton
          edge="end"
          size="small"
          onClick={handleDeleteComment}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default Comment;
