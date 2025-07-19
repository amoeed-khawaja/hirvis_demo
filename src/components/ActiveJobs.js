import React, { useState } from "react";
import styled from "styled-components";
import AddJobModal from "./AddJobModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddJob = (jobData) => {
    const newJob = {
      id: Date.now(),
      position: jobData.jobTitle,
      location: jobData.jobLocation,
      type: jobData.workplaceType,
      postedDate: new Date().toLocaleDateString(),
      applications: 0,
      ...jobData,
    };
    setJobs((prev) => [...prev, newJob]);
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

  const confirmDelete = () => {
    setJobs((prev) => prev.filter((job) => job.id !== selectedJob.id));
    setIsDeleteModalOpen(false);
    setSelectedJob(null);
  };

  const handleUpdateJob = (updatedData) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              ...updatedData,
              position: updatedData.jobTitle,
              location: updatedData.jobLocation,
              type: updatedData.workplaceType,
            }
          : job
      )
    );
    setIsEditModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <Container>
      <Header>
        <Title>Jobs</Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <span>+</span>
          Add Job
        </AddButton>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Position</Th>
              <Th>Location</Th>
              <Th>Type</Th>
              <Th>Posted Date</Th>
              <Th>Applications</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <Td colSpan="6">
                  <EmptyState>No jobs found</EmptyState>
                </Td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <Td>{job.position}</Td>
                  <Td>{job.location}</Td>
                  <Td>{job.type}</Td>
                  <Td>{job.postedDate}</Td>
                  <Td>{job.applications}</Td>
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
                <DetailValue>{selectedJob.position}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Location:</DetailLabel>
                <DetailValue>{selectedJob.location}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Type:</DetailLabel>
                <DetailValue>{selectedJob.type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Posted Date:</DetailLabel>
                <DetailValue>{selectedJob.postedDate}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Applications:</DetailLabel>
                <DetailValue>{selectedJob.applications}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Duration:</DetailLabel>
                <DetailValue>{selectedJob.jobDuration} days</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Description:</DetailLabel>
                <DetailValue style={{ maxWidth: "300px", textAlign: "right" }}>
                  {selectedJob.jobDescription}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Required Skills:</DetailLabel>
                <DetailValue>
                  {selectedJob.requiredSkills?.join(", ") || "None specified"}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Post to LinkedIn:</DetailLabel>
                <DetailValue>
                  {selectedJob.postToLinkedIn ? "Yes" : "No"}
                </DetailValue>
              </DetailRow>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={() => setIsViewModalOpen(false)}>
                Close
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  setIsViewModalOpen(false);
                  // TODO: Navigate to applicants view
                  alert("View Applicants functionality coming soon!");
                }}
              >
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
          initialData={selectedJob}
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
                Are you sure you want to delete the job "{selectedJob.position}
                "?
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
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
