import React from "react";
import Navbar from "../components/dashboard/navbar/Navbar";
import Sidebar from "../components/dashboard/navbar/Sidebar";

const MainWindow = () => {
  return (
    <>
      {/*<Navbar /> - uncomment when you need login and register*/}
      <Sidebar />
    </>
  );
};

export default MainWindow;
