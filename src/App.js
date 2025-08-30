import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import JobList from "./components/JobList";
import AddJobModal from "./components/AddJobModal";
import JobDetails from "./components/JobDetails";
import Dashboard from "./components/Dashboard";
import ActiveJobs from "./components/ActiveJobs";
import Applicants from "./components/Applicants";
import InterviewQuestions from "./components/InterviewQuestions";
import Interviews from "./components/Interviews";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TableInspector from "./components/TableInspector";
import UserDataSetup from "./components/UserDataSetup";
import UserMigration from "./components/UserMigration";
import MigrationTest from "./components/MigrationTest";
import OnboardingForm from "./components/OnboardingForm";
import DatabaseSetup from "./components/DatabaseSetup";
import { inspectActiveJobsTable } from "./utils/inspectActiveJobs";
import {
  jobs as initialJobs,
  candidates as initialCandidates,
} from "./dummyData";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import "./App.css";
import Candidates from "./components/Candidates";
import Settings from "./components/Settings";
import Billings from "./components/Billings";
import Assistant from "./components/Assistant";

function App() {
  const [jobs, setJobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(initialCandidates);

  // Inspect active_jobs table on app load
  useEffect(() => {
    inspectActiveJobsTable();
  }, []);

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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <div style={{ color: "white", padding: "20px" }}>
                Test route - no protection
              </div>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="candidates" element={<Candidates />} />
                    <Route path="jobs" element={<ActiveJobs />} />
                    <Route
                      path="jobs/:jobId/applicants"
                      element={<Applicants />}
                    />
                    <Route
                      path="jobs/:jobId/interview-questions"
                      element={<InterviewQuestions />}
                    />
                    <Route
                      path="jobs/:jobId/interviews"
                      element={<Interviews />}
                    />
                    <Route path="assistant" element={<Assistant />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="billings" element={<Billings />} />
                    <Route path="inspector" element={<TableInspector />} />
                    <Route path="user-setup" element={<UserDataSetup />} />
                    <Route path="user-migration" element={<UserMigration />} />
                    <Route path="migration-test" element={<MigrationTest />} />
                    <Route path="database-setup" element={<DatabaseSetup />} />
                    <Route
                      path="add"
                      element={
                        <AddJobModal
                          isOpen={true}
                          onClose={() => window.history.back()}
                          onAddJob={handleAddJob}
                        />
                      }
                    />
                    <Route
                      path="job/:id"
                      element={
                        <JobDetailsWrapper
                          jobs={jobs}
                          candidates={candidates}
                          onUploadCVs={handleUploadCVs}
                          setCandidates={setCandidates}
                        />
                      }
                    />
                    <Route
                      path="*"
                      element={<Navigate to="dashboard" replace />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
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
