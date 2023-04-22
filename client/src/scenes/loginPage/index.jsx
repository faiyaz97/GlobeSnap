import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { alpha } from "@mui/system";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="img"
        src={`${process.env.REACT_APP_BASE_URL}/assets/globecameraforest.png`}
        sx={{
          position: "absolute",
          right: isNonMobileScreens ? "40%" : "40%",
          bottom: isNonMobileScreens ? "30%" : "20%",
          width: isNonMobileScreens ? "80%" : "100%",
          height: isNonMobileScreens ? "80%" : "100%",
          objectFit: "contain",
          zIndex: -1,
        }}
      />
      <Box
        width={isNonMobileScreens ? "30%" : "92%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        sx={{
          backgroundColor: alpha(theme.palette.background.alt, 0.8),
        }}
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          pb="2rem"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          GlobeSnap
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
