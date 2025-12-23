import React from "react";
import Navbar from "../components/dashboard/sidebar/Navbar";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

const MainWindow = () => {
  return (
    <>
      {/*<Navbar /> - uncomment when you need login and register*/}
      <Sidebar />
    </>
  );
};

export default MainWindow;
