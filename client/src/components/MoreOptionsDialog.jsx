import React from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";

const MoreOptionsDialog = ({ open, handleClose, postId, onDeletePost }) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialogContent-root": {
          padding: 0,
        },
        "& .MuiPaper-root": {
          borderRadius: "16px",
        },
      }}
    >
      <DialogContent>
        <List
          sx={{
            padding: 0,
          }}
        >
          <ListItem disablePadding>
            <ListItemButton onClick={() => onDeletePost(postId)}>
              <ListItemText
                primary="Delete"
                sx={{
                  textAlign: "center",
                  color: "red",
                }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => console.log("Edit clicked")}>
              <ListItemText
                primary="Edit"
                sx={{
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => console.log("Share clicked")}>
              <ListItemText
                primary="Share"
                sx={{
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={handleClose}>
              <ListItemText
                primary="Cancel"
                sx={{
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default MoreOptionsDialog;
