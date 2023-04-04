import { Button, TextField, Box } from "@mui/material";
import { useSelector } from "react-redux";
import UserImage from "./UserImage";

const AddCommentForm = ({ newComment, setNewComment, onSubmit }) => {
  const loggedInUser = useSelector((state) => state.user);

  return (
    <Box
      mt="1.5rem"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      borderRadius="4px"
      padding="1rem"
      boxShadow="inset 0px 2px 6px rgba(0, 0, 0, 0.2)"
    >
      <UserImage image={loggedInUser.picturePath} size="30px" />
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        label="Add a comment"
        fullWidth
        variant="standard"
        style={{ marginLeft: "1rem" }}
      />
      <Button onClick={onSubmit} disabled={!newComment.trim()}>
        Post
      </Button>
    </Box>
  );
};

export default AddCommentForm;
