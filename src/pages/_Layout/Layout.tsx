import { Outlet } from "react-router-dom";

import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";

import GlobalProvider from "@/providers";
import SettingsLayer from "@/components/global/SettingsLayer";

export default function Layout() {
  return (
    <GlobalProvider>
      <SettingsLayer>
        <Header />
        <Outlet />
        <Footer />
      </SettingsLayer>
    </GlobalProvider>
  );
}