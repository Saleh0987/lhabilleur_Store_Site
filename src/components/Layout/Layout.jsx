import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "../../routers/Routers";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="main">
        <Routers />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
