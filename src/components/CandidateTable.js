import React, { useState } from "react";
import styled from "styled-components";

const TableSection = styled.div`
  margin-top: 32px;
`;
const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;
const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fafbfc;
`;
const Th = styled.th`
  text-align: left;
  padding: 10px 8px;
  background: #f1f3f6;
  font-weight: 600;
`;
const Td = styled.td`
  padding: 10px 8px;
  border-top: 1px solid #e0e0e0;
`;

const experienceOptions = [
  { label: "All Experience", value: "" },
  { label: "> 2 years", value: "2" },
  { label: "> 5 years", value: "5" },
];
const scoreOptions = [
  { label: "All Scores", value: "" },
  { label: "> 5", value: "5" },
  { label: "> 8", value: "8" },
];

const CandidateTable = ({ candidates, filters, setFilters }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filtered = candidates.filter((c) => {
    let pass = true;
    if (filters.experience)
      pass = pass && Number(c.experience) > Number(filters.experience);
    if (filters.score) pass = pass && Number(c.score) > Number(filters.score);
    return pass;
  });

  return (
    <TableSection>
      <FilterRow>
        <Select
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
        >
          {experienceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Select
          name="score"
          value={filters.score}
          onChange={handleFilterChange}
        >
          {scoreOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </FilterRow>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Score</Th>
            <Th>Experience</Th>
            <Th>Education</Th>
            <Th>Resume</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <Td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                No candidates found.
              </Td>
            </tr>
          ) : (
            filtered.map((c, i) => (
              <tr key={i}>
                <Td>{c.name}</Td>
                <Td>{c.email}</Td>
                <Td>{c.phone}</Td>
                <Td>{c.score}</Td>
                <Td>{c.experience}</Td>
                <Td>{c.education}</Td>
                <Td>
                  <a
                    href={c.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableSection>
  );
};

export default CandidateTable;
