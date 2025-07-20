import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const SidebarContainer = styled.div`
  width: 280px;
  background-color: #191c24;
  border-right: 1px solid #374151;
  padding: 24px 0;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  padding: 0 32px 32px 32px;
  border-bottom: 1px solid #374151;
  margin-bottom: 32px;
`;

const LogoText = styled.h1`
  color: #af1763;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const UserSection = styled.div`
  padding: 0 32px 24px 32px;
  border-bottom: 1px solid #374151;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
`;

const UserStatus = styled.div`
  color: #ffc107;
  font-size: 0.8rem;
  font-weight: 500;
`;

const NavigationSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 32px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 32px;
  color: ${(props) => (props.active ? "#AF1763" : "#BFD4D1")};
  text-decoration: none;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  background-color: ${(props) =>
    props.active ? "rgba(175, 23, 99, 0.1)" : "transparent"};
  border-right: ${(props) => (props.active ? "3px solid #AF1763" : "none")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? "rgba(175, 23, 99, 0.15)" : "rgba(175, 23, 99, 0.05)"};
    color: ${(props) => (props.active ? "#AF1763" : "#FFFFFF")};
  }
`;

const NavIcon = styled.span`
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
`;

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      section: "Main",
      items: [{ path: "/dashboard", label: "Dashboard", icon: "📊" }],
    },
    {
      section: "Recruitment",
      items: [
        { path: "/candidates", label: "Candidates", icon: "👥" },
        { path: "/jobs", label: "Active Jobs", icon: "💼" },
      ],
    },
    {
      section: "Settings",
      items: [
        { path: "/settings", label: "Settings", icon: "⚙️" },
        { path: "/billings", label: "Billings", icon: "💳" },
      ],
    },
  ];

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>CORONA</LogoText>
      </Logo>

      <UserSection>
        <UserInfo>
          <UserAvatar>HK</UserAvatar>
          <UserDetails>
            <UserName>Henry Klein</UserName>
            <UserStatus>Gold Member</UserStatus>
          </UserDetails>
        </UserInfo>
      </UserSection>

      {navigationItems.map((section) => (
        <NavigationSection key={section.section}>
          <SectionTitle>{section.section}</SectionTitle>
          <NavList>
            {section.items.map((item) => (
              <NavItem key={item.path}>
                <NavLink
                  to={item.path}
                  active={location.pathname === item.path}
                >
                  <NavIcon>{item.icon}</NavIcon>
                  {item.label}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </NavigationSection>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
