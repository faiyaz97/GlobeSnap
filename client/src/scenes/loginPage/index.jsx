import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        width={isNonMobileScreens ? "30%" : "92%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography 
          fontWeight="bold" 
          fontSize="32px" 
          color="primary" 
          pb="2rem"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Couple Journey
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;