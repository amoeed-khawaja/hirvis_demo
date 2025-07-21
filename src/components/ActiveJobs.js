import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AddJobModal from "./AddJobModal";
import { supabase } from "../supabase";
import { setupRLSPolicies, checkRLSStatus } from "../utils/setupRLS";
import { getCurrentUserId } from "../utils/auth";

const Container = styled.div`
  padding: 40px 32px 32px 32px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #191c24;
  min-height: 100vh;
  margin-left: 280px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const AddButton = styled.button`
  background: #af1763;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #8a1250;
  }
`;

const TableContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #374151;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 12px;
  font-weight: 600;
  font-size: 1rem;
  color: #9ca3af;
  border-bottom: 1px solid #374151;
`;

const Td = styled.td`
  padding: 16px 12px;
  border-bottom: 1px solid #374151;
  color: #ffffff;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: 1px solid #374151;
  border-radius: 6px;
  padding: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  &:hover {
    background: #374151;
    border-color: #af1763;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 60px 20px;
  font-size: 1.1rem;
`;

const LoadingState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 60px 20px;
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 60px 20px;
  font-size: 1.1rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid #374151;
`;

const ModalHeader = styled.div`
  padding: 24px 32px 16px 32px;
  border-bottom: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
  &:hover {
    color: #ffffff;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  color: #ffffff;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #374151;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #9ca3af;
`;

const DetailValue = styled.span`
  color: #ffffff;
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  border: none;
`;

const PrimaryButton = styled(Button)`
  background: #af1763;
  color: #ffffff;
  &:hover {
    background: #8a1250;
  }
`;

const SecondaryButton = styled(Button)`
  background: #374151;
  color: #ffffff;
  &:hover {
    background: #4b5563;
  }
`;

const DangerButton = styled(Button)`
  background: #ab2e3c;
  color: #ffffff;
  &:hover {
    background: #8b242f;
  }
`;

const ActiveJobs = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch jobs from Supabase with applicant counts
  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // First, get all jobs for current user
      const { data: jobsData, error: jobsError } = await supabase
        .from("active_jobs")
        .select("*")
        .eq("login_user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
        setError(jobsError.message);
        return;
      }

      // Then, get applicant counts for each job (only for current user's jobs)
      const jobsWithApplicants = await Promise.all(
        (jobsData || []).map(async (job) => {
          try {
            const { count, error: countError } = await supabase
              .from("active_job_candidates")
              .select("*", { count: "exact", head: true })
              .eq("job_id", job.job_id)
              .eq("login_user_id", currentUserId);

            if (countError) {
              console.error(
                `Error getting applicant count for job ${job.job_id}:`,
                countError
              );
              return { ...job, applicants: 0 };
            }

            return { ...job, applicants: count || 0 };
          } catch (err) {
            console.error(`Error processing job ${job.job_id}:`, err);
            return { ...job, applicants: 0 };
          }
        })
      );

      setJobs(jobsWithApplicants);
      setError(null);
    } catch (err) {
      console.error("Error in fetchJobs:", err);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Check RLS status on component mount
    checkRLSStatus();
  }, []);

  const handleAddJob = async (jobData) => {
    try {
      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("active_jobs")
        .insert([
          {
            job_title: jobData.jobTitle,
            description: jobData.jobDescription,
            workplace_type: jobData.workplaceType,
            location: jobData.jobLocation,
            job_active_duration: jobData.jobDuration,
            post_linkedin: jobData.postToLinkedIn,
            skills: jobData.requiredSkills?.join(", ") || "",
            login_user_id: currentUserId,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding job:", error);
        setError(error.message);
      } else {
        console.log("Job added successfully:", data);
        fetchJobs(); // Refresh the jobs list
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error in handleAddJob:", err);
      setError("Failed to add job");
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleDeleteJob = (job) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      const { error } = await supabase
        .from("active_jobs")
        .delete()
        .eq("job_id", selectedJob.job_id)
        .eq("login_user_id", currentUserId);

      if (error) {
        console.error("Error deleting job:", error);
        setError(error.message);
      } else {
        console.log("Job deleted successfully");
        fetchJobs(); // Refresh the jobs list
        setIsDeleteModalOpen(false);
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Error in confirmDelete:", err);
      setError("Failed to delete job");
    }
  };

  const handleUpdateJob = async (updatedData) => {
    try {
      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("active_jobs")
        .update({
          job_title: updatedData.jobTitle,
          description: updatedData.jobDescription,
          workplace_type: updatedData.workplaceType,
          location: updatedData.jobLocation,
          job_active_duration: updatedData.jobDuration,
          post_linkedin: updatedData.postToLinkedIn,
          skills: updatedData.requiredSkills?.join(", ") || "",
        })
        .eq("job_id", selectedJob.job_id)
        .eq("login_user_id", currentUserId)
        .select();

      if (error) {
        console.error("Error updating job:", error);
        setError(error.message);
      } else {
        console.log("Job updated successfully:", data);
        fetchJobs(); // Refresh the jobs list
        setIsEditModalOpen(false);
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Error in handleUpdateJob:", err);
      setError("Failed to update job");
    }
  };

  const handleViewApplicants = () => {
    setIsViewModalOpen(false);
    navigate(`/jobs/${selectedJob.job_id}/applicants`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Jobs</Title>
        </Header>
        <LoadingState>Loading jobs...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Jobs</Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <span>+</span>
          Add Job
        </AddButton>
      </Header>

      {error && <ErrorState>Error: {error}</ErrorState>}

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Position</Th>
              <Th>Location</Th>
              <Th>Type</Th>
              <Th>Posted Date</Th>
              <Th>Duration</Th>
              <Th>Applicants</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <Td colSpan="7">
                  <EmptyState>
                    No jobs found. Click "Add Job" to create your first job
                    posting.
                  </EmptyState>
                </Td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.job_id}>
                  <Td>{job.job_title}</Td>
                  <Td>{job.location}</Td>
                  <Td>{job.workplace_type}</Td>
                  <Td>{formatDate(job.created_at)}</Td>
                  <Td>{job.job_active_duration} days</Td>
                  <Td>{job.applicants || 0}</Td>
                  <Td>
                    <ActionButtons>
                      <ActionButton
                        onClick={() => handleViewJob(job)}
                        title="View"
                      >
                        👁️
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleEditJob(job)}
                        title="Edit"
                      >
                        ✏️
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteJob(job)}
                        title="Delete"
                      >
                        🗑️
                      </ActionButton>
                    </ActionButtons>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddJob={handleAddJob}
      />

      {/* View Job Modal */}
      {isViewModalOpen && selectedJob && (
        <ModalOverlay onClick={() => setIsViewModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Job Details</ModalTitle>
              <CloseButton onClick={() => setIsViewModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailRow>
                <DetailLabel>Position:</DetailLabel>
                <DetailValue>{selectedJob.job_title}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Location:</DetailLabel>
                <DetailValue>{selectedJob.location}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Type:</DetailLabel>
                <DetailValue>{selectedJob.workplace_type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Posted Date:</DetailLabel>
                <DetailValue>{formatDate(selectedJob.created_at)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Duration:</DetailLabel>
                <DetailValue>
                  {selectedJob.job_active_duration} days
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Applicants:</DetailLabel>
                <DetailValue>{selectedJob.applicants || 0}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Description:</DetailLabel>
                <DetailValue style={{ maxWidth: "300px", textAlign: "right" }}>
                  {selectedJob.description}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Required Skills:</DetailLabel>
                <DetailValue>
                  {selectedJob.skills || "None specified"}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Post to LinkedIn:</DetailLabel>
                <DetailValue>
                  {selectedJob.post_linkedin ? "Yes" : "No"}
                </DetailValue>
              </DetailRow>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={() => setIsViewModalOpen(false)}>
                Close
              </SecondaryButton>
              <PrimaryButton onClick={handleViewApplicants}>
                View Applicants
              </PrimaryButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Edit Job Modal */}
      {isEditModalOpen && selectedJob && (
        <AddJobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onAddJob={handleUpdateJob}
          initialData={{
            jobTitle: selectedJob.job_title,
            jobDescription: selectedJob.description,
            workplaceType: selectedJob.workplace_type,
            jobLocation: selectedJob.location,
            jobDuration: selectedJob.job_active_duration,
            postToLinkedIn: selectedJob.post_linkedin,
            requiredSkills: selectedJob.skills
              ? selectedJob.skills.split(", ")
              : [],
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedJob && (
        <ModalOverlay onClick={() => setIsDeleteModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Delete Job</ModalTitle>
              <CloseButton onClick={() => setIsDeleteModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete the job "{selectedJob.job_title}
                "?
              </p>
              <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </SecondaryButton>
              <DangerButton onClick={confirmDelete}>Delete Job</DangerButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ActiveJobs;
