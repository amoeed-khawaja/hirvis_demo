import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { supabase } from "../supabase";
import { getCurrentUser } from "../utils/auth";
import LoadingSpinner from "./LoadingSpinner";

const Container = styled.div`
  padding: 40px 32px 32px 32px;
  max-width: 1200px;
  width: 100%;
  background-color: #191c24;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
`;

const Content = styled.div`
  background: #232837;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AvatarContainer = styled.div`
  margin-bottom: 32px;
  position: relative;
`;

const waveAnimation = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
`;

const Avatar = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  color: white;
  margin: 0 auto 16px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: -10px;
    width: 40px;
    height: 40px;
    background: #af1763;
    border-radius: 50%;
    animation: ${waveAnimation} 2s ease-in-out infinite;
  }
`;

const AvatarLabel = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 16px;
`;

const Description = styled.p`
  color: #9ca3af;
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
  padding: 40px;
`;

const Assistant = () => {
  const [recruiterName, setRecruiterName] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await getCurrentUser();
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("users_data")
          .select("recruiter_name, assistant_name")
          .eq("login_user_id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching user data:", fetchError);
          setError("Failed to fetch user data");
          setLoading(false);
          return;
        }

        setRecruiterName(data?.recruiter_name || "Assistant");
        setAssistantName(data?.assistant_name || "");
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getAvatarInfo = () => {
    const name = assistantName.toLowerCase();

    if (
      name.includes("sarah") ||
      name.includes("johnson") ||
      name.includes("emily") ||
      name.includes("rodriguez")
    ) {
      return {
        emoji: "👩🏻‍💼",
        gender: "female",
        description: "Professional & Friendly",
      };
    } else if (
      name.includes("michael") ||
      name.includes("chen") ||
      name.includes("david") ||
      name.includes("thompson")
    ) {
      return {
        emoji: "👨🏻‍💼",
        gender: "male",
        description: "Confident & Authoritative",
      };
    } else {
      return {
        emoji: "🤖",
        gender: "neutral",
        description: "AI Assistant",
      };
    }
  };

  const avatarInfo = getAvatarInfo();

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading Assistant..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorText>Error: {error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{recruiterName}</Title>
        <Subtitle>Your AI-powered recruitment assistant</Subtitle>
      </Header>

      <Content>
        <AvatarContainer>
          <Avatar>{avatarInfo.emoji}</Avatar>
          <AvatarLabel>{assistantName || "AI Assistant"}</AvatarLabel>
        </AvatarContainer>
        
        <Description>
          Welcome to your personalized recruitment assistant. This{" "}
          {avatarInfo.gender} AI assistant is designed to help streamline your
          recruitment process with {avatarInfo.description.toLowerCase()}
          interactions. Soon you'll be able to have natural conversations, get
          candidate insights, and automate routine tasks.
        </Description>
      </Content>
    </Container>
  );
};

export default Assistant;
