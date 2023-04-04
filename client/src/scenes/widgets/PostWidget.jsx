import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreHoriz,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  Zoom,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts, setLogin, setFriends } from "state";
import MoreOptionsDialog from "components/MoreOptionsDialog";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCommentForm from "components/AddCommentForm";
import Comment from "components/Comment";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [newComment, setNewComment] = useState("");
  const dateTimeAgo = moment(new Date(createdAt)).fromNow();
  const navigate = useNavigate();
  const friends = useSelector((state) => state.user.friends);
  const isFriend = friends.find((friend) => friend._id === postUserId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const { _id } = useSelector((state) => state.user);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const medium = palette.neutral.medium;

  const handleCommentSubmit = async () => {
    await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, text: newComment }),
    });

    setNewComment("");
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { posts, user } = await response.json();

        // Update your posts state with the updatedPosts
        dispatch(setPosts({ posts }));
        // Update the user state with the updated user object
        dispatch(setLogin({ user, token }));

        toast.success("Post deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Failed to delete the post. Try again later.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error while deleting the post:", error);
    }
  };

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMoreHorizClick = () => {
    setDialogOpen(true);
  };

  const patchFollow = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/follow/${postUserId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${postUserId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween sx={{ alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", alignItems: "top" }}>
          <UserImage image={userPicturePath} size="50px" />
          <Box sx={{ marginLeft: "1rem" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                color={main}
                variant="h5"
                fontWeight="800"
                sx={{
                  "&:hover": {
                    color: palette.primary.dark,
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  navigate(`/profile/${postUserId}`);
                  navigate(0);
                }}
              >
                {name}
              </Typography>
            </Box>
            <Typography color={medium} fontSize="0.75rem">
              {dateTimeAgo}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            {postUserId !== _id && (
              <>
                <span style={{ margin: ".0rem .5rem .0rem .5rem" }}>•</span>
                <Typography
                  onClick={() => patchFollow()}
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "top",
                    fontWeight: "300",
                    color: palette.primary.dark,
                    cursor: "pointer",
                    textTransform: "none",
                    "&:hover": {
                      color: medium,
                    },
                  }}
                >
                  {isFriend ? "Unfollow" : "Follow"}
                </Typography>
              </>
            )}
          </Box>
        </Box>
        <Tooltip title={location.name} TransitionComponent={Zoom}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}
          >
            <Typography variant="h6" sx={{ marginRight: "0.5rem" }}>
              {location.id}
            </Typography>
            <img
              src={`https://flagcdn.com/w20/${location.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${location.code.toLowerCase()}.png 2x`}
              alt={location.name}
            />
          </Box>
        </Tooltip>
      </FlexBetween>

      <Divider sx={{ m: "1rem 0rem 1rem 0rem" }} />

      <Box>
        <Typography
          color={main}
          sx={{ mb: "1rem" }}
          component="div"
          dangerouslySetInnerHTML={{
            __html: description.replace(/\n/g, "<br />"),
          }}
        />
        {picturePath && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: "0.75rem" }}
          >
            <img
              alt="post"
              style={{
                borderRadius: "0.75rem",
                width: "100%",
                maxWidth: "100%",
              }}
              src={`http://localhost:3001/assets/${picturePath}`}
            />
          </Box>
        )}
      </Box>

      <FlexBetween mt="1rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike} sx={{ padding: "0" }}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={() => setIsComments(!isComments)}
              sx={{ padding: "0" }}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {postUserId === loggedInUserId ? (
          <IconButton onClick={handleMoreHorizClick} sx={{ padding: "0" }}>
            <MoreHoriz />
          </IconButton>
        ) : (
          <></>
        )}
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Comment comment={comment} postId={postId} />
            </Box>
          ))}
          <Divider />
          <AddCommentForm
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmit={handleCommentSubmit}
          />
        </Box>
      )}
      <MoreOptionsDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        postId={postId}
        onDeletePost={deletePost}
      />
    </WidgetWrapper>
  );
};

export default PostWidget;
