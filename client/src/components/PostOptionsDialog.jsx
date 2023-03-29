import {
    Box,
    Button,
    Dialog,
    List,
    ListItem,
    ListItemText,
    Typography,
  } from "@mui/material";
  
  const PostOptionsDialog = ({ isOpen, onClose, onDelete }) => {
    const handleDelete = async () => {
      await onDelete();
      onClose();
    };
  
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <Box p={2}>
          <Typography variant="h6">Post Options</Typography>
          <List sx={{ mt: 2 }}>
            <ListItem button onClick={() => console.log("Edit")}>
              <ListItemText primary="Edit" />
            </ListItem>
            <ListItem button onClick={handleDelete}>
              <ListItemText primary="Delete" />
            </ListItem>
            <ListItem button onClick={() => console.log("Share")}>
              <ListItemText primary="Share" />
            </ListItem>
          </List>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={onClose}>Cancel</Button>
          </Box>
        </Box>
      </Dialog>
    );
  };
  
  export default PostOptionsDialog;
  