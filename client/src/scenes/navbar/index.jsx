import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Switch,
  Menu,
  Button,
} from "@mui/material";
import {
  Chat,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Close,
  Search,
  ExpandMore,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
                padding: 0,
              }}
            >
              Couple Journey
            </Typography>
          </Box>
          <FlexBetween gap="2rem">
            <Chat sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Search sx={{ fontSize: "25px" }} />
            <Box>
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                disableRipple
                style={{ fontSize: "14px" }}
              >
                {fullName} <ExpandMore />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem>
                  Theme
                  <Switch
                    checked={theme.palette.mode === "dark"}
                    onChange={() =>
                      dispatch(
                        setMode(
                          theme.palette.mode === "light" ? "dark" : "light"
                        )
                      )
                    }
                    icon={<LightMode />}
                    checkedIcon={<DarkMode />}
                    color="default"
                    style={{
                      color: dark,
                    }}
                  />
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </FlexBetween>
        </FlexBetween>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundColor: alt,
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
                padding: 0,
              }}
            >
              Couple Journey
            </Typography>
          </Box>
          {/* MOBILE NAV */}
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: alt,
              padding: "1rem",
            }}
          >
            <IconButton onClick={handleClick}>
              <UserImage image={user.picturePath} size="25px" />
            </IconButton>
            <IconButton>
              <Search sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton>
              <Notifications sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton>
              <Chat sx={{ fontSize: "25px" }} />
            </IconButton>
          </Box>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ position: "fixed", bottom: "4rem" }}
          >
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem>
              Theme
              <Switch
                checked={theme.palette.mode === "dark"}
                onChange={() =>
                  dispatch(
                    setMode(theme.palette.mode === "light" ? "dark" : "light")
                  )
                }
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
                color="default"
                style={{
                  color: dark,
                }}
              />
            </MenuItem>
            <MenuItem onClick={() => dispatch(setLogout())}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default Navbar;
