import { Box, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import pkg from "../../../package.json";

function Header() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.text.primary,
        color: (theme) => theme.palette.background.default,
        p: 2,
      }}>
      <Stack direction='row' justifyContent='space-between'>
        <Typography
          component={Link}
          fontWeight={700}
          to='/'
          color='inherit'
          textTransform='uppercase'
          sx={{ textDecoration: "none" }}>
          Mark my image
        </Typography>
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
