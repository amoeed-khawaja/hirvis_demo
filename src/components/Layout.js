import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f4f6fa;
`;
const Header = styled.header`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  padding: 18px 0;
  margin-bottom: 32px;
`;
const Title = styled(Link)`
  color: #1a73e8;
  font-size: 2rem;
  font-weight: 700;
  text-decoration: none;
  margin-left: 40px;
`;

const Layout = ({ children }) => (
  <Wrapper>
    <Header>
      <Title to="/">HR Dashboard</Title>
    </Header>
    {children}
  </Wrapper>
);

export default Layout;
