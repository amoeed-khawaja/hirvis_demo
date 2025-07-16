import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const JobListContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
`;
const JobCard = styled.div`
  padding: 20px 24px;
  margin-bottom: 18px;
  border-radius: 10px;
  background: #f7f8fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
`;
const AddButton = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  padding: 10px 24px;
  background: #1a73e8;
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

const JobList = ({ jobs }) => (
  <JobListContainer>
    <AddButton to="/add">+ Add New Job</AddButton>
    {jobs.length === 0 ? (
      <p style={{ textAlign: "center", color: "#888" }}>No active job posts.</p>
    ) : (
      jobs.map((job) => (
        <JobCard key={job.id}>
          <div>
            <h3 style={{ margin: 0 }}>{job.title}</h3>
            <div style={{ color: "#666", fontSize: "0.95em" }}>
              {job.location} &bull; {job.salaryRange}
            </div>
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
