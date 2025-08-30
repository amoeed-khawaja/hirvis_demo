import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) =>
    props.theme === "dark"
      ? "#000000"
      : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"};
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  overflow-x: hidden;
  transition: all 0.3s ease;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background: ${(props) =>
    props.theme === "dark"
      ? "rgba(0, 0, 0, 0.8)"
      : "rgba(255, 255, 255, 0.95)"};
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  border-bottom: 1px solid
    ${(props) =>
      props.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0"};
  transition: all 0.3s ease;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;

  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: white;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavLink = styled.a`
  color: ${(props) => (props.theme === "dark" ? "#b3b8c5" : "#64748b")};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ThemeToggle = styled.button`
  width: 48px;
  height: 24px;
  background: ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  border-radius: 12px;
  border: none;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.theme === "dark" ? "flex-end" : "flex-start"};
  padding: 2px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.theme === "dark" ? "#4b5563" : "#cbd5e1")};
  }

  .toggle-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props) => (props.theme === "dark" ? "#1e293b" : "#ffffff")};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &.primary {
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    color: #ffffff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(175, 23, 99, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
    border: 1px solid
      ${(props) => (props.theme === "dark" ? "#374151" : "#cbd5e1")};

    &:hover {
      background: ${(props) =>
        props.theme === "dark" ? "#374151" : "#f1f5f9"};
      border-color: ${(props) =>
        props.theme === "dark" ? "#4b5563" : "#94a3b8"};
    }
  }
`;

const Hero = styled.section`
  padding: 120px 40px 80px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

const HeroContent = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
  margin-bottom: 60px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  text-align: center;

  .highlight {
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  margin-bottom: 32px;
  line-height: 1.6;
  transition: color 0.3s ease;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: ${(props) => (props.theme === "dark" ? "#374151" : "#1e293b")};
  color: #ffffff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const SignUpLink = styled(Link)`
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  }
`;

const VideoSection = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
`;

const VideoCard = styled.div`
  background: ${(props) =>
    props.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff"};
  border-radius: 20px;
  padding: 32px;
  box-shadow: ${(props) =>
    props.theme === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 20px 60px rgba(0, 0, 0, 0.1)"};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  }
`;

const VideoPlayer = styled.div`
  width: 100%;
  height: 700px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)"/><polygon points="35,25 35,75 75,50" fill="white"/></svg>')
      center/120px no-repeat;
  }
`;

const AbstractCard = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;

  &::before {
    content: "";
    position: absolute;
    top: 20%;
    left: 20%;
    right: 20%;
    bottom: 20%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 50%;
    transform: rotate(45deg);
  }

  &::after {
    content: "";
    position: absolute;
    top: 10%;
    right: 10%;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FloatingMic = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 8px 20px rgba(175, 23, 99, 0.3);
  z-index: 10;
`;

const VideoInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
`;

const VideoDuration = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
`;

const TestimonialsSection = styled.section`
  padding: 80px 40px;
  background: ${(props) => (props.theme === "dark" ? "#232837" : "#ffffff")};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const TestimonialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
`;

const TestimonialCard = styled.div`
  background: ${(props) => (props.theme === "dark" ? "#191c24" : "#f8fafc")};
  border-radius: 16px;
  padding: 32px;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s;
  animation: ${fadeInUp} 0.8s ease-out;

  &:hover {
    transform: translateY(-5px);
    border-color: #af1763;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  font-style: italic;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  margin-bottom: 20px;
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .author-pic {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

  .author-info {
    .name {
      font-weight: 600;
      color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
      transition: color 0.3s ease;
    }

    .title {
      color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
  }
`;

const CompanyLogos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 40px;
  flex-wrap: wrap;

  .company-logo {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
    transition: color 0.3s ease;
  }
`;

const Footer = styled.footer`
  padding: 40px;
  background: ${(props) => (props.theme === "dark" ? "#10121a" : "#f8fafc")};
  text-align: center;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  border-top: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s ease;
`;

const FeaturesSection = styled.section`
  padding: 80px 40px;
  background: ${(props) => (props.theme === "dark" ? "#1a1d26" : "#f1f5f9")};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
  flex-wrap: wrap;
  position: relative;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const FeatureStep = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  padding: 24px;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#2d3748" : "#e2e8f0")};
  border-radius: 20px;
  background: ${(props) =>
    props.theme === "dark"
      ? "rgba(255, 255, 255, 0.03)"
      : "rgba(255, 255, 255, 0.9)"};
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.theme === "dark"
      ? "0 4px 20px rgba(0, 0, 0, 0.2)"
      : "0 8px 32px rgba(0, 0, 0, 0.08)"};
  backdrop-filter: blur(10px);

  &:hover {
    border-color: ${(props) =>
      props.theme === "dark" ? "#4a5568" : "#cbd5e1"};
    transform: translateY(-4px);
    box-shadow: ${(props) =>
      props.theme === "dark"
        ? "0 12px 40px rgba(0, 0, 0, 0.3)"
        : "0 16px 48px rgba(0, 0, 0, 0.12)"};
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 28px;
  }
`;

const FeatureNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(175, 23, 99, 0.3);
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 200px;

  @media (max-width: 1024px) {
    max-width: 250px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;
  margin: 0;
`;

const FeatureDescription = styled.p`
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  line-height: 1.5;
  transition: color 0.3s ease;
  font-size: 0.9rem;
  margin: 0;
`;

const Arrow = styled.div`
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #af1763 0%, #5f4bfa 100%);
  position: relative;
  margin: 0 10px;
  flex-shrink: 0;
  align-self: center;

  &::after {
    content: "";
    position: absolute;
    right: -6px;
    top: -3px;
    width: 0;
    height: 0;
    border-left: 8px solid #5f4bfa;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }

  @media (max-width: 1024px) {
    transform: rotate(90deg);
    margin: 20px 0;
  }
`;

const WigglyArrow = styled.div`
  width: 40px;
  height: 20px;
  position: relative;
  margin: 0 10px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #af1763 0%, #5f4bfa 100%);
    mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20"><path d="M0,10 Q5,5 10,10 T20,10 T30,10 T40,10" stroke="black" stroke-width="2" fill="none"/></svg>');
    mask-size: contain;
    mask-repeat: no-repeat;
  }

  &::after {
    content: "";
    position: absolute;
    right: -6px;
    top: 8px;
    width: 0;
    height: 0;
    border-left: 8px solid #5f4bfa;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }

  @media (max-width: 1024px) {
    transform: rotate(90deg);
    margin: 20px 0;
  }
`;

const BenefitsSection = styled.section`
  padding: 80px 40px;
  background: ${(props) => (props.theme === "dark" ? "#232837" : "#ffffff")};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const BenefitsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${(props) => (props.theme === "dark" ? "#191c24" : "#f8fafc")};
  border-radius: 12px;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    border-color: #af1763;
  }
`;

const BenefitCheck = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const BenefitText = styled.span`
  font-weight: 500;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;
`;

const BuiltForSection = styled.section`
  padding: 60px 40px;
  background: ${(props) => (props.theme === "dark" ? "#191c24" : "#f8fafc")};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const BuiltForContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const BuiltForGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const BuiltForCard = styled.div`
  background: ${(props) => (props.theme === "dark" ? "#232837" : "#ffffff")};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid
    ${(props) => (props.theme === "dark" ? "#374151" : "#e2e8f0")};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    border-color: #af1763;
  }
`;

const BuiltForTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#1e293b")};
  transition: color 0.3s ease;
`;

const BuiltForDescription = styled.p`
  font-size: 0.9rem;
  color: ${(props) => (props.theme === "dark" ? "#9ca3af" : "#64748b")};
  line-height: 1.5;
  transition: color 0.3s ease;
`;

const LandingPage = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <Logo theme={theme}>
          <img
            src="/logo/logo_colored.png"
            alt="Hirvis"
            style={{
              height: "75px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Logo>
        <Nav>
          <NavLink theme={theme}>Features</NavLink>
          <NavLink theme={theme}>Pricing</NavLink>
          <NavLink theme={theme}>About</NavLink>
          <NavLink theme={theme}>Support</NavLink>
        </Nav>
        <HeaderButtons>
          <ThemeToggle theme={theme} onClick={toggleTheme}>
            <div className="toggle-icon">{theme === "dark" ? "🌙" : "☀️"}</div>
          </ThemeToggle>
          <Button className="secondary" theme={theme}>
            Demo
          </Button>
          <Button className="primary" as={Link} to="/login">
            Get Started →
          </Button>
        </HeaderButtons>
      </Header>

      <Hero>
        <HeroContent>
          <HeroTitle>
            <br />
            Filter, Interview, Hire{" "}
            <span className="highlight">All on Autopilot</span>
          </HeroTitle>
          <HeroSubtitle theme={theme}>
            Streamline hiring from 500+ applicants to 5 top candidates without
            lifting a finger. Hirvis screens resumes, conducts initial
            interviews over voice calls, and gives you fit-based assessments so
            your team only steps in for the final round.
          </HeroSubtitle>
          <CTAGroup>
            <CTAButton to="/login">Book a demo</CTAButton>
            <SignUpLink to="/signup" theme={theme}>
              Sign up—it's free
            </SignUpLink>
          </CTAGroup>
        </HeroContent>

        <VideoSection>
          <VideoCard theme={theme}>
            <VideoPlayer>{/* Video placeholder */}</VideoPlayer>
            <VideoInfo theme={theme}>
              <span>Interactive screening call</span>
              <VideoDuration theme={theme}>1:36</VideoDuration>
            </VideoInfo>
          </VideoCard>
        </VideoSection>
      </Hero>

      <FeaturesSection theme={theme}>
        <FeaturesContainer>
          <SectionHeader>
            <SectionTitle theme={theme}>How It Works</SectionTitle>
          </SectionHeader>

          <FeaturesGrid>
            <FeatureStep theme={theme}>
              <FeatureNumber>1</FeatureNumber>
              <FeatureContent>
                <FeatureTitle theme={theme}>Upload Resumes</FeatureTitle>
                <FeatureDescription theme={theme}>
                  Drag and drop all applications. No format limits, no extra
                  setup.
                </FeatureDescription>
              </FeatureContent>
            </FeatureStep>

            <Arrow />

            <FeatureStep theme={theme}>
              <FeatureNumber>2</FeatureNumber>
              <FeatureContent>
                <FeatureTitle theme={theme}>Automatic Filtering</FeatureTitle>
                <FeatureDescription theme={theme}>
                  Our engine parses every resume, ranks candidates based on
                  relevance, and filters out noise.
                </FeatureDescription>
              </FeatureContent>
            </FeatureStep>

            <Arrow />

            <FeatureStep theme={theme}>
              <FeatureNumber>3</FeatureNumber>
              <FeatureContent>
                <FeatureTitle theme={theme}>AI-Led Interviews</FeatureTitle>
                <FeatureDescription theme={theme}>
                  Shortlisted candidates are auto-called and interviewed with
                  smart, dynamic questions tailored to the role.
                </FeatureDescription>
              </FeatureContent>
            </FeatureStep>

            <Arrow />

            <FeatureStep theme={theme}>
              <FeatureNumber>4</FeatureNumber>
              <FeatureContent>
                <FeatureTitle theme={theme}>Fit Score & Insights</FeatureTitle>
                <FeatureDescription theme={theme}>
                  Get a ranked list of top candidates with detailed fit reports,
                  call transcripts, and recommended next steps.
                </FeatureDescription>
              </FeatureContent>
            </FeatureStep>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <BenefitsSection theme={theme}>
        <BenefitsContainer>
          <SectionHeader>
            <SectionTitle theme={theme}>Why Teams Love It</SectionTitle>
          </SectionHeader>

          <BenefitsGrid>
            <BenefitItem theme={theme}>
              <BenefitCheck>✓</BenefitCheck>
              <BenefitText theme={theme}>Save 80% of Hiring Time</BenefitText>
            </BenefitItem>
            <BenefitItem theme={theme}>
              <BenefitCheck>✓</BenefitCheck>
              <BenefitText theme={theme}>
                Zero Bias, 100% Consistency
              </BenefitText>
            </BenefitItem>
            <BenefitItem theme={theme}>
              <BenefitCheck>✓</BenefitCheck>
              <BenefitText theme={theme}>
                Real Conversations, Not Just Data
              </BenefitText>
            </BenefitItem>
            <BenefitItem theme={theme}>
              <BenefitCheck>✓</BenefitCheck>
              <BenefitText theme={theme}>
                Better Candidates, Faster Decisions
              </BenefitText>
            </BenefitItem>
          </BenefitsGrid>
        </BenefitsContainer>
      </BenefitsSection>

      <BuiltForSection theme={theme}>
        <BuiltForContainer>
          <SectionHeader>
            <SectionTitle theme={theme}>Built for:</SectionTitle>
          </SectionHeader>

          <BuiltForGrid>
            <BuiltForCard theme={theme}>
              <BuiltForTitle theme={theme}>Busy HR Teams</BuiltForTitle>
              <BuiltForDescription theme={theme}>
                Streamline your hiring process and focus on what matters most.
              </BuiltForDescription>
            </BuiltForCard>
            <BuiltForCard theme={theme}>
              <BuiltForTitle theme={theme}>
                Founders doing their own hiring
              </BuiltForTitle>
              <BuiltForDescription theme={theme}>
                Scale your hiring without scaling your time investment.
              </BuiltForDescription>
            </BuiltForCard>
            <BuiltForCard theme={theme}>
              <BuiltForTitle theme={theme}>
                Recruitment agencies looking to scale screening
              </BuiltForTitle>
              <BuiltForDescription theme={theme}>
                Handle more clients and candidates with AI-powered efficiency.
              </BuiltForDescription>
            </BuiltForCard>
          </BuiltForGrid>
        </BuiltForContainer>
      </BuiltForSection>

      <TestimonialsSection theme={theme}>
        <TestimonialsContainer>
          <SectionHeader>
            <SectionTitle theme={theme}>What our customers say</SectionTitle>
          </SectionHeader>

          <TestimonialsGrid>
            <TestimonialCard theme={theme}>
              <CompanyLogo>T</CompanyLogo>
              <TestimonialText theme={theme}>
                "Screened shortened our time-to-hire by 8 weeks"
              </TestimonialText>
              <TestimonialAuthor theme={theme}>
                <div className="author-pic">KT</div>
                <div className="author-info">
                  <div className="name">Kyara Tan</div>
                  <div className="title">Head of People & Culture</div>
                </div>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard theme={theme}>
              <CompanyLogo>G</CompanyLogo>
              <TestimonialText theme={theme}>
                "It actually unlocked a whole world of possibility for us for
                what voice AI can do for interviewing"
              </TestimonialText>
              <TestimonialAuthor theme={theme}>
                <div className="author-pic">SY</div>
                <div className="author-info">
                  <div className="name">Sung Yong Yi</div>
                  <div className="title">CEO</div>
                </div>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard theme={theme}>
              <CompanyLogo>G</CompanyLogo>
              <TestimonialText theme={theme}>
                "In the past 1.5 months, we saved 28 hours from CV and Phone
                screening processes with Ryan as our trusted 'third' recruiter"
              </TestimonialText>
              <TestimonialAuthor theme={theme}>
                <div className="author-pic">MF</div>
                <div className="author-info">
                  <div className="name">Matthew Foo</div>
                  <div className="title">Senior HR Specialist</div>
                </div>
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>

          <CompanyLogos theme={theme}>
            <div className="company-logo">Terrascope</div>
            <div className="company-logo">Grain</div>
            <div className="company-logo">GenScript</div>
          </CompanyLogos>
        </TestimonialsContainer>
      </TestimonialsSection>

      <Footer theme={theme}>
        <p>
          © 2024 Hirvis. All rights reserved. | Privacy Policy | Terms of
          Service
        </p>
      </Footer>
    </Container>
  );
};

export default LandingPage;
