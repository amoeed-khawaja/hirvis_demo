import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #191c24;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #191c24;
  overflow-x: hidden;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default Layout;
