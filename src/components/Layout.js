import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getGroqResponse } from "../api";

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;
const Header = styled.header`
  background: ${({ theme }) => theme.colors.header};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  padding: 18px 0;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  font-weight: 700;
  text-decoration: none;
  margin-left: 40px;
`;
const TogglePill = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  width: 60px;
  height: 32px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-right: 40px;
  padding: 0;
  transition: background 0.2s, border 0.2s;
`;
const ToggleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  z-index: 2;
  svg {
    width: 22px;
    height: 22px;
    fill: ${({ theme }) => theme.colors.text};
    transition: fill 0.2s;
  }
`;
const ToggleSlider = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $themeName }) => ($themeName === "dark" ? "30px" : "2px")};
  width: 26px;
  height: 26px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  transition: left 0.25s cubic-bezier(0.4, 2, 0.6, 1), background 0.2s;
  z-index: 1;
`;

const handleGroqTest = async () => {
  const userInput = window.prompt("Enter your job and candidate details:");
  if (!userInput) return;
  const messages = [
    {
      role: "system",
      content:
        "You are an intelligent resume screening assistant. You will receive two inputs:\n\nExtracted resume text, including name, contact, education, experience, and other relevant details.\n\nJob title and job description, outlining the employer's requirements.\n\nYour task is to analyze the candidate's resume in the context of the job description and return a single-row response formatted to match an Excel sheet, with the following exact column order:\n\nName | Email | Phone | Score (rate relevance to the job from 0 to 10 based on experience, skills, and alignment with the job description) | Experience (in relevant field only, summarized in years ) | Education (only the highest level or most relevant to the role e.g. bachelors ) | Degree( e.g. computer science) |  Remarks (brief comments, such as strengths, concerns, or missing qualifications)\n\nKeep your output concise and accurate, suitable for direct insertion into an Excel row. Do not add bullet points, extra text, or formatting beyond the required columns.",
    },
    {
      role: "user",
      content: userInput,
    },
  ];
  try {
    const data = await getGroqResponse(messages);
    alert(JSON.stringify(data));
  } catch (err) {
    alert("Error: " + err.message);
  }
};

const Layout = ({ children, theme, toggleTheme }) => (
  <Wrapper>
    <Header>
      <Title to="/">HR Dashboard</Title>
      <button
        onClick={handleGroqTest}
        style={{
          marginRight: 16,
          padding: "8px 16px",
          borderRadius: 6,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Test Groq API
      </button>
      <TogglePill onClick={toggleTheme} aria-label="Toggle dark mode">
        <ToggleIcon>
          {/* Sun icon */}
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </ToggleIcon>
        <ToggleIcon>
          {/* Moon icon */}
          <svg viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 0111.21 3a1 1 0 00-1.09 1.32A7 7 0 0012 21a7 7 0 009.68-8.7 1 1 0 00-1.32-1.09z" />
          </svg>
        </ToggleIcon>
        <ToggleSlider $themeName={theme} />
      </TogglePill>
    </Header>
    {children}
  </Wrapper>
);

export default Layout;
