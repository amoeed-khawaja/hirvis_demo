import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getTableStructure, getSampleData } from "../utils/tableInspector";

const Container = styled.div`
  padding: 20px;
  background: #191c24;
  min-height: 100vh;
  color: #ffffff;
`;

const Title = styled.h1`
  color: #ffffff;
  margin-bottom: 20px;
`;

const TableContainer = styled.div`
  background: #232837;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #374151;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #374151;
  color: #9ca3af;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #374151;
  color: #ffffff;
`;

const Button = styled.button`
  background: #af1763;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;

  &:hover {
    background: #8a1250;
  }
`;

const LoadingText = styled.div`
  color: #9ca3af;
  font-style: italic;
`;

const ErrorText = styled.div`
  color: #ef4444;
  margin-top: 10px;
`;

const TableInspector = () => {
  const [columns, setColumns] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inspectTable = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get table structure
      const tableStructure = await getTableStructure("active_jobs");
      if (tableStructure) {
        setColumns(tableStructure);
      } else {
        setError("Failed to fetch table structure");
      }

      // Get sample data
      const sample = await getSampleData("active_jobs", 3);
      if (sample) {
        setSampleData(sample);
      }
    } catch (err) {
      setError("Error inspecting table: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inspectTable();
  }, []);

  return (
    <Container>
      <Title>Active Jobs Table Inspector</Title>

      <Button onClick={inspectTable} disabled={loading}>
        {loading ? "Inspecting..." : "Refresh Table Structure"}
      </Button>

      {error && <ErrorText>{error}</ErrorText>}

      {loading && <LoadingText>Loading table structure...</LoadingText>}

      {columns.length > 0 && (
        <TableContainer>
          <h2>Table Columns</h2>
          <Table>
            <thead>
              <tr>
                <Th>Column Name</Th>
                <Th>Data Type</Th>
                <Th>Nullable</Th>
                <Th>Default Value</Th>
              </tr>
            </thead>
            <tbody>
              {columns.map((column, index) => (
                <tr key={index}>
                  <Td>{column.column_name}</Td>
                  <Td>{column.data_type}</Td>
                  <Td>{column.is_nullable === "YES" ? "Yes" : "No"}</Td>
                  <Td>{column.column_default || "None"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {sampleData.length > 0 && (
        <TableContainer>
          <h2>Sample Data (First 3 rows)</h2>
          <Table>
            <thead>
              <tr>
                {Object.keys(sampleData[0] || {}).map((key) => (
                  <Th key={key}>{key}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, valueIndex) => (
                    <Td key={valueIndex}>
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value || "null")}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default TableInspector;
