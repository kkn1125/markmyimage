import { Box, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import pkg from "../../../package.json";

function Header() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        p: 2,
      }}>
      <Stack direction='row' justifyContent='space-between'>
        <Stack
          title='mark my image'
          component={Link}
          to='/'
          direction='row'
          gap={1}
          alignItems='center'
          color='inherit'
          sx={{ textDecoration: "none" }}>
          <Box
            component='img'
            src='/images/logo.png'
            sx={{
              width: 24,
              height: "auto",
              // borderRadius: "999px",
              filter: "brightness(1.5)",
              // backgroundColor: (theme) => theme.palette.text.primary,
            }}
          />
          <Typography
            fontWeight={700}
            color='inherit'
            textTransform='uppercase'>
            Mark my image
          </Typography>
        </Stack>
        <Chip
          size='small'
          label={"v " + pkg.version}
          color='primary'
          sx={{
            fontWeight: 700,
          }}
        />
      </Stack>
    </Box>
  );
}

export default Header;
