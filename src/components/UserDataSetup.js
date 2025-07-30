import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getCurrentUserData, getAllUsers } from "../utils/userDataManager";

import {
  setupUserDataTable,
  testUserDataSetup,
  displaySetupInstructions,
} from "../utils/setupUserData";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #333;
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 15px;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #af1763 0%, #5f4bfa 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Status = styled.div`
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  font-weight: 500;
`;

const Success = styled(Status)`
  background: #2ecc71;
  color: white;
`;

const Error = styled(Status)`
  background: #e74c3c;
  color: white;
`;

const Info = styled(Status)`
  background: #3498db;
  color: white;
`;

const CodeBlock = styled.pre`
  background: #2d2d2d;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 12px;
  margin: 10px 0;
`;

const UserDataSetup = () => {
  const [status, setStatus] = useState("");
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setStatus("");

    try {
      displaySetupInstructions();
      setStatus("Check the browser console for setup instructions!");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setStatus("");

    try {
      const result = await testUserDataSetup();
      if (result) {
        setStatus("✅ User data setup is working correctly!");
      } else {
        setStatus(
          "❌ User data setup needs to be configured. Run setup first."
        );
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentUser = async () => {
    setLoading(true);
    setStatus("");

    try {
      const data = await getCurrentUserData();
      if (data) {
        setUserData(data);
        setStatus("✅ Current user data retrieved successfully!");
      } else {
        setStatus("❌ No user data found. User might not be logged in.");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllUsers = async () => {
    setLoading(true);
    setStatus("");

    try {
      const users = await getAllUsers();
      setAllUsers(users);
      setStatus(`✅ Retrieved ${users.length} users successfully!`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>User Data Setup & Management</Title>

      <Card>
        <h3>Setup Instructions</h3>
        <p>Click the button below to see setup instructions in the console:</p>
        <Button onClick={handleSetup} disabled={loading}>
          Show Setup Instructions
        </Button>
      </Card>

      <Card>
        <h3>Test Setup</h3>
        <p>Test if the user_data table is properly configured:</p>
        <Button onClick={handleTest} disabled={loading}>
          Test User Data Setup
        </Button>
      </Card>

      <Card>
        <h3>Current User Data</h3>
        <p>Get the current logged-in user's data:</p>
        <Button onClick={handleGetCurrentUser} disabled={loading}>
          Get Current User Data
        </Button>
        {userData && <CodeBlock>{JSON.stringify(userData, null, 2)}</CodeBlock>}
      </Card>

      <Card>
        <h3>All Users</h3>
        <p>Get all users in the system (admin function):</p>
        <Button onClick={handleGetAllUsers} disabled={loading}>
          Get All Users
        </Button>
        {allUsers.length > 0 && (
          <CodeBlock>{JSON.stringify(allUsers, null, 2)}</CodeBlock>
        )}
      </Card>

      {status && (
        <Card>
          <h3>Status</h3>
          {status.includes("✅") ? (
            <Success>{status}</Success>
          ) : status.includes("❌") ? (
            <Error>{status}</Error>
          ) : (
            <Info>{status}</Info>
          )}
        </Card>
      )}
    </Container>
  );
};

export default UserDataSetup;
