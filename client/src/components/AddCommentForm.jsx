import { Button, TextField, Box } from "@mui/material";

const AddCommentForm = ({ newComment, setNewComment, onSubmit }) => {
  return (
    <Box mt="1rem" display="flex" justifyContent="space-between">
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        label="Add a comment"
        fullWidth
      />
      <Button onClick={onSubmit} color="primary" disabled={!newComment.trim()}>
        Post
      </Button>
    </Box>
  );
};

export default AddCommentForm;
