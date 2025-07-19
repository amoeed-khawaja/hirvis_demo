import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Layout from "./components/Layout";
import JobList from "./components/JobList";
import JobForm from "./components/JobForm";
import JobDetails from "./components/JobDetails";
import Dashboard from "./components/Dashboard";
import ActiveJobs from "./components/ActiveJobs";
import {
  jobs as initialJobs,
  candidates as initialCandidates,
} from "./dummyData";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(initialCandidates);

  // Add job handler
  const handleAddJob = (job) => {
    const newJob = { ...job, id: Date.now().toString() };
    setJobs([...jobs, newJob]);
    setCandidates({ ...candidates, [newJob.id]: [] });
  };

  // Upload CVs handler (dummy, just adds dummy candidates)
  const handleUploadCVs = (jobId, files) => {
    const dummy = files.map((f, i) => ({
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@mail.com`,
      phone: "555-0000",
      score: Math.floor(Math.random() * 10) + 1,
      experience: Math.floor(Math.random() * 8) + 1,
      education: "B.Sc. Example",
      resumeUrl: "#",
    }));
    setCandidates((prev) => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), ...dummy],
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/candidates"
              element={
                <div style={{ color: "#fff", padding: "32px" }}>
                  Candidates Page (Coming Soon)
                </div>
              }
            />
            <Route path="/jobs" element={<ActiveJobs />} />
            <Route
              path="/settings"
              element={
                <div style={{ color: "#fff", padding: "32px" }}>
                  Settings Page (Coming Soon)
                </div>
              }
            />
            <Route
              path="/billings"
              element={
                <div style={{ color: "#fff", padding: "32px" }}>
                  Billings Page (Coming Soon)
                </div>
              }
            />
            <Route path="/add" element={<JobForm onAddJob={handleAddJob} />} />
            <Route
              path="/job/:id"
              element={
                <JobDetailsWrapper
                  jobs={jobs}
                  candidates={candidates}
                  onUploadCVs={handleUploadCVs}
                  setCandidates={setCandidates}
                />
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

function JobDetailsWrapper({ jobs, candidates, onUploadCVs, setCandidates }) {
  const { id } = useParams();
  const [filters, setFilters] = useState({ experience: "", score: "" });
  const job = jobs.find((j) => j.id === id);
  const jobCandidates = candidates[id] || [];
  const handleUpload = (files) => onUploadCVs(id, files);
  return (
    <JobDetails
      job={job}
      candidates={jobCandidates}
      onUploadCVs={handleUpload}
      filters={filters}
      setFilters={setFilters}
      setCandidates={setCandidates}
    />
  );
}

export default App;
