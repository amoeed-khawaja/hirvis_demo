import React, { useState } from "react";
import styled from "styled-components";
import {
  runAllTests,
  getManualMigrationInstructions,
} from "../utils/testMigration";

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
  white-space: pre-wrap;
`;

const MigrationTest = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState("");

  const handleRunTests = async () => {
    setLoading(true);
    setResults(null);
    setInstructions("");

    try {
      const testResults = await runAllTests();
      setResults(testResults);

      // Show instructions if auth access fails
      if (!testResults.authAccess.success) {
        const manualInstructions = getManualMigrationInstructions();
        setInstructions(manualInstructions);
      }
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleShowInstructions = () => {
    const manualInstructions = getManualMigrationInstructions();
    setInstructions(manualInstructions);
  };

  return (
    <Container>
      <Title>Migration Debug Tool</Title>

      <Card>
        <h3>Quick Migration Test</h3>
        <p>This will test all migration components and provide solutions:</p>
        <Button onClick={handleRunTests} disabled={loading}>
          {loading ? "Running Tests..." : "Run Migration Tests"}
        </Button>
        <Button onClick={handleShowInstructions}>
          Show Manual Instructions
        </Button>
      </Card>

      {results && (
        <Card>
          <h3>Test Results</h3>

          <div>
            <h4>Auth Access Test:</h4>
            {results.authAccess.success ? (
              <Success>✅ Can access auth.users</Success>
            ) : (
              <Error>
                ❌ Cannot access auth.users: {results.authAccess.error}
              </Error>
            )}
          </div>

          <div>
            <h4>User Data Table Test:</h4>
            {results.userDataTable.success ? (
              <Success>✅ Can access user_data table</Success>
            ) : (
              <Error>
                ❌ Cannot access user_data: {results.userDataTable.error}
              </Error>
            )}
          </div>

          <div>
            <h4>Current User Migration Test:</h4>
            {results.currentUserMigration.success ? (
              <Success>
                ✅ Current user migration works:{" "}
                {results.currentUserMigration.message}
              </Success>
            ) : (
              <Error>
                ❌ Current user migration failed:{" "}
                {results.currentUserMigration.error}
              </Error>
            )}
          </div>

          {results.error && <Error>❌ General Error: {results.error}</Error>}
        </Card>
      )}

      {instructions && (
        <Card>
          <h3>Manual Migration Instructions</h3>
          <CodeBlock>{instructions}</CodeBlock>
        </Card>
      )}

      <Card>
        <h3>Quick SQL Migration</h3>
        <p>Copy and paste this SQL in your Supabase SQL Editor:</p>
        <CodeBlock>
          {`-- Quick migration script
INSERT INTO user_data (user_id, display_name, email, phone, paid, paid_date, assistant)
SELECT 
  au.id as user_id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email) as display_name,
  au.email,
  au.raw_user_meta_data->>'phone' as phone,
  0 as paid,
  NULL as paid_date,
  NULL as assistant
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM user_data ud WHERE ud.user_id = au.id
);`}
        </CodeBlock>
      </Card>

      <Card>
        <h3>Check Table Structure</h3>
        <p>Run this SQL to verify your table structure:</p>
        <CodeBlock>
          {`SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_data'
ORDER BY ordinal_position;`}
        </CodeBlock>
      </Card>

      <Card>
        <h3>Check Trigger</h3>
        <p>Run this SQL to check if the trigger exists:</p>
        <CodeBlock>
          {`SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';`}
        </CodeBlock>
      </Card>
    </Container>
  );
};

export default MigrationTest;
