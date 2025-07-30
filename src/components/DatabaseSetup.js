import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #af1763 0%, #5f4bfa 50%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(175, 23, 99, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Status = styled.div`
  color: #fff;
  margin: 20px 0;
  padding: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
`;

const DatabaseSetup = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const setupDatabase = async () => {
    setLoading(true);
    setStatus("Setting up database...");

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("No authenticated user found");
      }

      setStatus("User authenticated, checking database structure...");

      // Check if users_data table exists and has the right structure
      const { data: tableInfo, error: tableError } = await supabase
        .from("users_data")
        .select("*")
        .limit(1);

      if (tableError) {
        setStatus(
          "Table does not exist or has wrong structure. Please run the SQL script in Supabase dashboard."
        );
        return;
      }

      setStatus("Table exists. Checking if user record exists...");

      // Check if user record exists
      const { data: userData, error: userDataError } = await supabase
        .from("users_data")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userDataError && userDataError.code === "PGRST116") {
        // User record doesn't exist, create it
        setStatus("Creating user record...");

        const { error: insertError } = await supabase
          .from("users_data")
          .insert({
            id: user.id,
            display_name: user.user_metadata?.full_name || user.email,
            email: user.email,
            phone: null,
            organization: null,
            recruiter_name: null,
            assistant_name: null,
            candidate_questions: null,
            candidate_questions2: null,
            paid: 0,
            paid_date: null,
            assistant: null,
            login_user_id: user.id,
            assistant_api: null,
          });

        if (insertError) {
          throw new Error(
            `Failed to create user record: ${insertError.message}`
          );
        }

        setStatus("User record created successfully!");
      } else if (userDataError) {
        throw new Error(`Error checking user data: ${userDataError.message}`);
      } else {
        setStatus("User record already exists!");
      }

      setStatus("Database setup completed successfully!");
    } catch (error) {
      console.error("Database setup error:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkTableStructure = async () => {
    setLoading(true);
    setStatus("Checking table structure...");

    try {
      const { data, error } = await supabase
        .from("users_data")
        .select("*")
        .limit(1);

      if (error) {
        setStatus(`Table error: ${error.message}`);
        return;
      }

      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        setStatus(`Table structure: ${columns.join(", ")}`);
      } else {
        setStatus("Table exists but is empty");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Database Setup</Title>

      <Button onClick={setupDatabase} disabled={loading}>
        {loading ? "Setting up..." : "Setup Database"}
      </Button>

      <Button onClick={checkTableStructure} disabled={loading}>
        Check Table Structure
      </Button>

      {status && <Status>{status}</Status>}

      <div style={{ color: "#fff", marginTop: "20px", fontSize: "0.9rem" }}>
        <p>
          <strong>Instructions:</strong>
        </p>
        <ol>
          <li>
            If you get table structure errors, run the SQL script in your
            Supabase dashboard
          </li>
          <li>Go to Supabase Dashboard → SQL Editor</li>
          <li>
            Copy and paste the contents of{" "}
            <code>src/utils/updateUserDataTable.sql</code>
          </li>
          <li>Run the script</li>
          <li>Come back and click "Setup Database"</li>
        </ol>
      </div>
    </Container>
  );
};

export default DatabaseSetup;
