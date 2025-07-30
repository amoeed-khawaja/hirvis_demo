import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
  padding: 40px;
`;

const Assistant = () => {
  const [recruiterName, setRecruiterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecruiterName = async () => {
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
          .select("recruiter_name")
          .eq("login_user_id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching recruiter name:", fetchError);
          setError("Failed to fetch recruiter name");
          setLoading(false);
          return;
        }

        setRecruiterName(data?.recruiter_name || "Assistant");
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchRecruiterName:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchRecruiterName();
  }, []);

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
        <p style={{ color: "#9ca3af", margin: 0 }}>
          Welcome to your personalized recruitment assistant. This page is under
          development and will soon provide AI-powered features to help
          streamline your recruitment process.
        </p>
      </Content>
    </Container>
  );
};

export default Assistant;
