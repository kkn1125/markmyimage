import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.text.primary,
        color: (theme) => theme.palette.background.default,
        p: 2,
      }}>
      <Typography align='center' fontWeight={700}>
        Copyright 2024. devkimson All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
