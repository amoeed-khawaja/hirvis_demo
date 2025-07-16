import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const JobListContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 32px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
`;
const JobCard = styled.div`
  padding: 20px 24px;
  margin-bottom: 18px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
`;
const AddButton = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  padding: 10px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s;
  &:hover {
    background: #155ab6;
  }
`;
const JobTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => (theme.colors.mode === "dark" ? "#fff" : "#222")};
`;
const JobMeta = styled.div`
  color: ${({ theme }) =>
    theme.colors.mode === "dark" ? theme.colors.muted : "#666"};
  font-size: 0.95em;
`;

const JobList = ({ jobs }) => (
  <JobListContainer>
    <AddButton to="/add">+ Add New Job</AddButton>
    {jobs.length === 0 ? (
      <p style={{ textAlign: "center", color: "#888" }}>No active job posts.</p>
    ) : (
      jobs.map((job) => (
        <JobCard key={job.id}>
          <div>
            <JobTitle>{job.title}</JobTitle>
            <JobMeta>
              {job.location} &bull; {job.salaryRange}
            </JobMeta>
          </div>
          <Link
            to={`/job/${job.id}`}
            style={{ color: "#1a73e8", fontWeight: 500 }}
          >
            View
          </Link>
        </JobCard>
      ))
    )}
  </JobListContainer>
);

export default JobList;
