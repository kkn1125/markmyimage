import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.text.primary,
        color: (theme) => theme.palette.background.default,
        p: 2,
      }}>
      <Typography
        component={Link}
        fontWeight={700}
        to='/'
        color='inherit'
        textTransform='uppercase'
        sx={{ textDecoration: "none" }}>
        Mark my image
      </Typography>
    </Box>
  );
}

export default Header;
