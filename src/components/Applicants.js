import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import { screenResume } from "../api";

// Set workerSrc to the public folder for compatibility with Create React App
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

// Function to extract text from PDF
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

// Function to parse Groq API response
function parseGroqCandidateString(str) {
  try {
    const parts = str.split("|").map((s) => s.trim());
    if (parts.length >= 8) {
      return {
        name: parts[0] || "N/A",
        email: parts[1] || "N/A",
        phone: parts[2] || "N/A",
        score: parseInt(parts[3]) || 0,
        experience: parts[4] || "N/A",
        education: parts[5] || "N/A",
        degree: parts[6] || "N/A",
        notes: parts[7] || "N/A",
        resume: "Uploaded PDF",
      };
    } else {
      console.warn("Invalid Groq response format:", str);
      return null;
    }
  } catch (error) {
    console.error("Error parsing Groq response:", error);
    return null;
  }
}

// Function to format job information for Groq API
function formatJobForGroq(job) {
  return {
    title: job.position,
    description: job.jobDescription,
    location: job.location,
    type: job.type,
    salaryRange: "Competitive", // Default since not in mock data
  };
}

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

const InfoStatus = styled(UploadStatus)`
  background: rgba(13, 110, 253, 0.1);
  border: 1px solid rgba(13, 110, 253, 0.3);
  color: #0d6efd;
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
  const [extractedTexts, setExtractedTexts] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = React.useRef();

  useEffect(() => {
    // In a real app, you would fetch job and applicants data from API
    // For now, we'll use mock data
    console.log("Setting up mock job and applicants data...");
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
        education: "MSc",
        degree: "Computer Science",
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
        education: "BSc",
        degree: "Software Engineering",
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
        education: "BSc",
        degree: "Computer Science",
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
        education: "BSc",
        degree: "Information Technology",
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
        education: "MSc",
        degree: "Computer Science",
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

  const handleFileUpload = async (event) => {
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

    // Extract text from each PDF and print to console
    const newExtractedTexts = {};
    for (const file of pdfFiles) {
      try {
        console.log(`\n=== EXTRACTING TEXT FROM: ${file.name} ===`);
        const extractedText = await extractTextFromPDF(file);

        // Store extracted text in state
        newExtractedTexts[file.name] = extractedText;

        console.log(`\n📄 PDF Text Content for "${file.name}":`);
        console.log("=".repeat(80));
        console.log(extractedText);
        console.log("=".repeat(80));
        console.log(
          `\n✅ Successfully extracted ${extractedText.length} characters from "${file.name}"`
        );
      } catch (error) {
        console.error(`❌ Failed to extract text from "${file.name}":`, error);
        setUploadStatus({
          type: "error",
          message: `Failed to extract text from ${file.name}: ${error.message}`,
        });
        return;
      }
    }

    // Update extracted texts state
    setExtractedTexts((prev) => ({ ...prev, ...newExtractedTexts }));

    // Process extracted text through Groq API
    setIsProcessing(true);
    setUploadStatus({
      type: "info",
      message: "Processing resumes through AI...",
    });

    try {
      const newCandidates = [];

      for (const file of pdfFiles) {
        const extractedText = newExtractedTexts[file.name];
        if (extractedText) {
          console.log(`\n🤖 Processing "${file.name}" through Groq API...`);

          // Format job information for Groq API
          const formattedJob = formatJobForGroq(job);
          console.log(`\n📋 Job Information being sent to Groq API:`);
          console.log(`Job Title: ${formattedJob.title}`);
          console.log(
            `Job Description: ${formattedJob.description.substring(0, 200)}...`
          );
          console.log(`Location: ${formattedJob.location}`);
          console.log(`Type: ${formattedJob.type}`);

          // Call Groq API to screen the resume
          const groqResponse = await screenResume(formattedJob, extractedText);
          console.log(`\n📊 Groq API Response for "${file.name}":`);
          console.log(groqResponse);

          // Parse the response and add to candidates
          const candidate = parseGroqCandidateString(groqResponse);
          if (candidate) {
            candidate.id = Date.now() + Math.random();
            candidate.resume = file.name;
            newCandidates.push(candidate);
            console.log(`\n✅ Added candidate from "${file.name}":`, candidate);
          } else {
            console.warn(`❌ Failed to parse candidate from "${file.name}"`);
          }
        }
      }

      // Add new candidates to the table
      if (newCandidates.length > 0) {
        setApplicants((prev) => [...prev, ...newCandidates]);
        setUploadStatus({
          type: "success",
          message: `Successfully processed ${newCandidates.length} resume(s) and added ${newCandidates.length} candidate(s) to the table.`,
        });
      } else {
        setUploadStatus({
          type: "error",
          message:
            "Failed to process any resumes. Please check the console for details.",
        });
      }
    } catch (error) {
      console.error("Error processing resumes through Groq API:", error);
      setUploadStatus({
        type: "error",
        message: `Error processing resumes: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }

    const newFiles = pdfFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

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
              disabled={uploadedFiles.length >= 10 || isProcessing}
            >
              {isProcessing ? "⏳ Processing..." : "📄 Upload Resume"}
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
          ) : uploadStatus.type === "error" ? (
            <ErrorStatus>❌ {uploadStatus.message}</ErrorStatus>
          ) : (
            <InfoStatus>⏳ {uploadStatus.message}</InfoStatus>
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
                    background: extractedTexts[file.name]
                      ? "#198754"
                      : "#374151",
                    color: "#FFFFFF",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {extractedTexts[file.name] && "✅"}
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
              <Th>Degree</Th>
              <Th>Resume</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length === 0 ? (
              <tr>
                <Td colSpan="9">
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
                  <Td>{applicant.degree || "N/A"}</Td>
                  <Td>
                    <ResumeLink href="#" onClick={(e) => e.preventDefault()}>
                      {applicant.resume === "Uploaded PDF"
                        ? "View PDF"
                        : "View Resume"}
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
