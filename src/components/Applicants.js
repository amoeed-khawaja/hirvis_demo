import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const BackButton = styled.button`
  background: #374151;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #4b5563;
  }
`;

const JobDescriptionContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid #374151;
`;

const JobDescriptionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const JobDescriptionContent = styled.div`
  color: #bfd4d1;
  font-size: 1rem;
  line-height: 1.6;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #af1763;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #8a1250;
  }
`;

const TableContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TableTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterLabel = styled.label`
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 6px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #af1763;
  }

  option {
    background: #374151;
    color: #ffffff;
  }
`;

const UploadButton = styled.button`
  background: #af1763;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #8a1250;
  }

  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadStatus = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessStatus = styled(UploadStatus)`
  background: rgba(25, 135, 84, 0.1);
  border: 1px solid rgba(25, 135, 84, 0.3);
  color: #198754;
`;

const ErrorStatus = styled(UploadStatus)`
  background: rgba(171, 46, 60, 0.1);
  border: 1px solid rgba(171, 46, 60, 0.3);
  color: #ab2e3c;
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
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 16px 12px;
  border-bottom: 1px solid #374151;
  color: #ffffff;
  vertical-align: top;
`;

const ResumeLink = styled.a`
  color: #af1763;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ScoreBadge = styled.span`
  background: ${(props) => {
    if (props.score >= 8) return "#198754";
    if (props.score >= 6) return "#FFC107";
    return "#AB2E3C";
  }};
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 60px 20px;
  font-size: 1.1rem;
`;

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = React.useRef();

  useEffect(() => {
    // In a real app, you would fetch job and applicants data from API
    // For now, we'll use mock data
    const mockJob = {
      id: jobId,
      position: "Senior React Developer",
      location: "New York, NY",
      type: "Full-time",
      jobDescription: `We are looking for a Senior React Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using React.js and related technologies.

Key Responsibilities:
• Develop new user-facing features using React.js
• Build reusable code and libraries for future use
• Ensure the technical feasibility of UI/UX designs
• Optimize applications for maximum speed and scalability
• Collaborate with other team members and stakeholders
• Mentor junior developers and conduct code reviews

Requirements:
• 5+ years of experience with React.js and modern JavaScript
• Strong understanding of web markup, including HTML5, CSS3
• Experience with state management libraries (Redux, MobX, etc.)
• Familiarity with RESTful APIs and GraphQL
• Experience with testing frameworks (Jest, React Testing Library)
• Knowledge of modern build tools (Webpack, Babel, etc.)
• Understanding of cross-browser compatibility issues
• Experience with version control systems (Git)

Nice to have:
• Experience with TypeScript
• Knowledge of server-side rendering (Next.js, Gatsby)
• Experience with CI/CD pipelines
• Understanding of accessibility standards
• Experience with performance optimization techniques`,
      postedDate: "2024-01-15",
      applications: 12,
    };

    const mockApplicants = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        score: 9,
        experience: "6 years",
        education: "MSc Computer Science",
        resume: "sarah_johnson_resume.pdf",
        notes: "Excellent React skills, strong portfolio, great communication",
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "+1 (555) 234-5678",
        score: 7,
        experience: "4 years",
        education: "BSc Software Engineering",
        resume: "michael_chen_resume.pdf",
        notes: "Good technical skills, needs improvement in system design",
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        phone: "+1 (555) 345-6789",
        score: 8,
        experience: "5 years",
        education: "BSc Computer Science",
        resume: "emily_rodriguez_resume.pdf",
        notes: "Strong problem-solving skills, good team player",
      },
      {
        id: 4,
        name: "David Kim",
        email: "david.kim@email.com",
        phone: "+1 (555) 456-7890",
        score: 6,
        experience: "3 years",
        education: "BSc Information Technology",
        resume: "david_kim_resume.pdf",
        notes: "Junior level, needs mentoring, shows potential",
      },
      {
        id: 5,
        name: "Lisa Thompson",
        email: "lisa.thompson@email.com",
        phone: "+1 (555) 567-8901",
        score: 9,
        experience: "7 years",
        education: "MSc Computer Science",
        resume: "lisa_thompson_resume.pdf",
        notes: "Senior level, excellent leadership skills, perfect fit",
      },
    ];

    setJob(mockJob);
    setApplicants(mockApplicants);
    setFilteredApplicants(mockApplicants);
  }, [jobId]);

  // Filter applicants based on selected filters
  useEffect(() => {
    let filtered = [...applicants];

    if (experienceFilter) {
      filtered = filtered.filter((applicant) => {
        const experienceYears = parseInt(applicant.experience);
        switch (experienceFilter) {
          case "1-2":
            return experienceYears >= 1 && experienceYears <= 2;
          case "2-3":
            return experienceYears >= 2 && experienceYears <= 3;
          case "3-5":
            return experienceYears >= 3 && experienceYears <= 5;
          case "5+":
            return experienceYears >= 5;
          default:
            return true;
        }
      });
    }

    if (scoreFilter) {
      const minScore = parseInt(scoreFilter);
      filtered = filtered.filter((applicant) => applicant.score >= minScore);
    }

    setFilteredApplicants(filtered);
  }, [applicants, experienceFilter, scoreFilter]);

  const handleBack = () => {
    navigate("/jobs");
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    const nonPdfFiles = files.filter((file) => file.type !== "application/pdf");

    if (nonPdfFiles.length > 0) {
      setUploadStatus({
        type: "error",
        message: `Only PDF files are allowed. ${nonPdfFiles.length} non-PDF file(s) were rejected.`,
      });
      return;
    }

    if (uploadedFiles.length + pdfFiles.length > 10) {
      setUploadStatus({
        type: "error",
        message: `You can only upload up to 10 files. You already have ${uploadedFiles.length} files uploaded.`,
      });
      return;
    }

    const newFiles = pdfFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setUploadStatus({
      type: "success",
      message: `Successfully uploaded ${pdfFiles.length} PDF file(s).`,
    });

    // Clear the file input
    event.target.value = "";
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  if (!job) {
    return (
      <Container>
        <EmptyState>Loading...</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{job.position} - Applicants</Title>
        <BackButton onClick={handleBack}>← Back to Jobs</BackButton>
      </Header>

      <JobDescriptionContainer>
        <JobDescriptionTitle>Job Description</JobDescriptionTitle>
        <JobDescriptionContent>{job.jobDescription}</JobDescriptionContent>
      </JobDescriptionContainer>

      <TableContainer>
        <TableHeader>
          <TableTitle>Applicants ({filteredApplicants.length})</TableTitle>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FiltersContainer>
              <FilterGroup>
                <FilterLabel>Experience</FilterLabel>
                <FilterSelect
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="">All Experience</option>
                  <option value="1-2">1-2 years</option>
                  <option value="2-3">2-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Score</FilterLabel>
                <FilterSelect
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                >
                  <option value="">All Scores</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                  <option value="7">7+</option>
                  <option value="8">8+</option>
                  <option value="9">9+</option>
                </FilterSelect>
              </FilterGroup>
            </FiltersContainer>

            <UploadButton
              onClick={triggerFileUpload}
              disabled={uploadedFiles.length >= 10}
            >
              📄 Upload Resume
            </UploadButton>
          </div>
        </TableHeader>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
        />

        {uploadStatus &&
          (uploadStatus.type === "success" ? (
            <SuccessStatus>✅ {uploadStatus.message}</SuccessStatus>
          ) : (
            <ErrorStatus>❌ {uploadStatus.message}</ErrorStatus>
          ))}

        {uploadedFiles.length > 0 && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "rgba(175, 23, 99, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(175, 23, 99, 0.3)",
            }}
          >
            <div
              style={{
                color: "#AF1763",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Uploaded Files ({uploadedFiles.length}/10):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {uploadedFiles.map((file) => (
                <span
                  key={file.id}
                  style={{
                    background: "#374151",
                    color: "#FFFFFF",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                >
                  {file.name}
                </span>
              ))}
            </div>
          </div>
        )}

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
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length === 0 ? (
              <tr>
                <Td colSpan="8">
                  <EmptyState>
                    {applicants.length === 0
                      ? "No applicants found"
                      : "No applicants match the selected filters"}
                  </EmptyState>
                </Td>
              </tr>
            ) : (
              filteredApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <Td>{applicant.name}</Td>
                  <Td>{applicant.email}</Td>
                  <Td>{applicant.phone}</Td>
                  <Td>
                    <ScoreBadge score={applicant.score}>
                      {applicant.score}/10
                    </ScoreBadge>
                  </Td>
                  <Td>{applicant.experience}</Td>
                  <Td>{applicant.education}</Td>
                  <Td>
                    <ResumeLink href="#" onClick={(e) => e.preventDefault()}>
                      View Resume
                    </ResumeLink>
                  </Td>
                  <Td style={{ maxWidth: "200px" }}>{applicant.notes}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Applicants;
