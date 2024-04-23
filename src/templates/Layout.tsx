import { Stack } from "@mui/material";
import Footer from "../components/organisms/Footer";
import Header from "../components/organisms/Header";
import { ReactElement } from "react";

function Layout({ children }: { children: ReactElement }) {
  return (
    <Stack sx={{ height: "inherit" }}>
      <Header />
      <Stack flex={1} sx={{ overflow: "auto" }}>
        {children}
      </Stack>
      <Footer />
    </Stack>
  );
}

export default Layout;
