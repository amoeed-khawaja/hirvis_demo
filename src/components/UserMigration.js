import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  migrateUsersFromAuth,
  showMigrationStatus,
  previewMigration,
  cleanupDuplicates,
} from "../utils/migrateUsers";

const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
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

const DangerButton = styled(Button)`
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
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

const Warning = styled(Status)`
  background: #f39c12;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  color: #fff;
`;

const Th = styled.th`
  background: #333;
  padding: 10px;
  text-align: left;
  border: 1px solid #555;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #555;
  background: #2a2a2a;
`;

const UserMigration = () => {
  const [status, setStatus] = useState("");
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load migration status on component mount
  useEffect(() => {
    loadMigrationStatus();
  }, []);

  const loadMigrationStatus = async () => {
    setLoading(true);
    try {
      const status = await showMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      setStatus(`Error loading status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    setLoading(true);
    setStatus("");

    try {
      const result = await migrateUsersFromAuth();
      if (result.success) {
        setStatus(`✅ ${result.message}`);
        // Reload status after migration
        await loadMigrationStatus();
      } else {
        setStatus(`❌ Migration failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    setStatus("");

    try {
      const data = await previewMigration();
      if (data) {
        setPreviewData(data);
        setStatus(`👀 Preview ready! Found ${data.length} users to migrate`);
      } else {
        setStatus("❌ Error generating preview");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    setLoading(true);
    setStatus("");

    try {
      const result = await cleanupDuplicates();
      if (result.success) {
        setStatus(
          `✅ Cleanup completed: ${result.deleted || 0} duplicates removed`
        );
        // Reload status after cleanup
        await loadMigrationStatus();
      } else {
        setStatus(`❌ Cleanup failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>User Migration Tool</Title>

      <Card>
        <h3>Migration Status</h3>
        {migrationStatus ? (
          <div>
            <p>
              <strong>Auth Users:</strong> {migrationStatus.authUsers}
            </p>
            <p>
              <strong>User Data Users:</strong> {migrationStatus.userDataUsers}
            </p>
            <p>
              <strong>Difference:</strong> {migrationStatus.difference}
            </p>
            {migrationStatus.migrationNeeded ? (
              <Warning>
                ⚠️ Migration needed! {migrationStatus.difference} users need to
                be migrated.
              </Warning>
            ) : (
              <Success>✅ All users are migrated!</Success>
            )}
          </div>
        ) : (
          <p>Loading status...</p>
        )}
        <Button onClick={loadMigrationStatus} disabled={loading}>
          Refresh Status
        </Button>
      </Card>

      <Card>
        <h3>Migration Actions</h3>
        <p>Migrate users from auth.users to user_data table:</p>
        <Button onClick={handlePreview} disabled={loading}>
          Preview Migration
        </Button>
        <Button onClick={handleMigration} disabled={loading}>
          Run Migration
        </Button>
        <DangerButton onClick={handleCleanup} disabled={loading}>
          Cleanup Duplicates
        </DangerButton>
      </Card>

      {previewData && previewData.length > 0 && (
        <Card>
          <h3>Migration Preview</h3>
          <p>Users that will be migrated:</p>
          <Table>
            <thead>
              <tr>
                <Th>User ID</Th>
                <Th>Display Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((user, index) => (
                <tr key={index}>
                  <Td>{user.user_id}</Td>
                  <Td>{user.display_name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phone || "N/A"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {status && (
        <Card>
          <h3>Status</h3>
          {status.includes("✅") ? (
            <Success>{status}</Success>
          ) : status.includes("❌") ? (
            <Error>{status}</Error>
          ) : status.includes("⚠️") ? (
            <Warning>{status}</Warning>
          ) : (
            <Info>{status}</Info>
          )}
        </Card>
      )}

      <Card>
        <h3>Column Mapping</h3>
        <p>The migration will map the following columns:</p>
        <Table>
          <thead>
            <tr>
              <Th>Auth Users Column</Th>
              <Th>User Data Column</Th>
              <Th>Default Value</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>id</Td>
              <Td>user_id</Td>
              <Td>-</Td>
            </tr>
            <tr>
              <Td>raw_user_meta_data.full_name</Td>
              <Td>display_name</Td>
              <Td>email (fallback)</Td>
            </tr>
            <tr>
              <Td>email</Td>
              <Td>email</Td>
              <Td>-</Td>
            </tr>
            <tr>
              <Td>raw_user_meta_data.phone</Td>
              <Td>phone</Td>
              <Td>NULL</Td>
            </tr>
            <tr>
              <Td>-</Td>
              <Td>paid</Td>
              <Td>0</Td>
            </tr>
            <tr>
              <Td>-</Td>
              <Td>paid_date</Td>
              <Td>NULL</Td>
            </tr>
            <tr>
              <Td>-</Td>
              <Td>assistant</Td>
              <Td>NULL</Td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default UserMigration;
