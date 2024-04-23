import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../components/organisms/Footer";
import Header from "../components/organisms/Header";

function Layout() {
  return (
    <Stack sx={{ height: "inherit" }}>
      <Header />
      <Stack flex={1} sx={{ overflow: "auto" }}>
        <Outlet />
      </Stack>
      <Footer />
    </Stack>
  );
}

export default Layout;
