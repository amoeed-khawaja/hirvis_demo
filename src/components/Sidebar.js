import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { supabase } from "../supabase";

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

const LogoutButton = styled.button`
  width: calc(100% - 64px);
  margin: 32px 32px 0 32px;
  padding: 12px 0;
  background: #232837;
  color: #af1763;
  border: 1.5px solid #af1763;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  display: block;
  text-align: center;
  &:hover {
    background: #af1763;
    color: #fff;
    border-color: #af1763;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const u = await getCurrentUser();
      setUser(u);
    }
    fetchUser();
  }, []);

  // Get display name and avatar
  let displayName = "";
  let avatarUrl = "";
  let initials = "";
  if (user) {
    displayName =
      user.user_metadata?.["Display name"] ||
      user.user_metadata?.display_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";
    avatarUrl =
      user.user_metadata?.["Avatar URL"] ||
      user.user_metadata?.avatar_url ||
      "";
    initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

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
        { path: "/assistant", label: "Assistant", icon: "🤖" },
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>INTERNOVA</LogoText>
      </Logo>

      <UserSection>
        <UserInfo>
          {avatarUrl ? (
            <UserAvatar
              as="img"
              src={avatarUrl}
              alt={displayName}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <UserAvatar>{initials || "U"}</UserAvatar>
          )}
          <UserDetails>
            <UserName>{displayName || "User"}</UserName>
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
      <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
