import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import { screenResume } from "../api";
import { supabase } from "../supabase";
import LoadingSpinner from "./LoadingSpinner";
import {
  checkTablesExist,
  displaySetupInstructions,
} from "../utils/databaseSetup";
import {
  checkRLSStatus,
  displayFixInstructions,
  disableRLSTemporarily,
} from "../utils/fixRLSPolicies";
import { getCurrentUserId } from "../utils/auth";

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

// Format phone number for display
function formatPhone(phone) {
  if (!phone) return "-";
  const str = String(phone).replace(/\D/g, "");
  if (str.startsWith("92")) return "+" + str;
  if (str.startsWith("3")) return "0" + str;
  return phone;
}

const Container = styled.div`
  padding: 40px 32px 32px 32px;
  max-width: 1200px;
  width: 100%;
  background-color: #191c24;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 20px 16px;
  }
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
    background: linear-gradient(135deg, #af1763, #5f4bfa);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const TableContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
  overflow: auto;
  max-width: 100%;
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
    border-color: #5f4bfa;
  }

  option {
    background: #374151;
    color: #ffffff;
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
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
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
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
  table-layout: fixed;
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
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 200px;
`;

const ResumeLink = styled.a`
  color: #5f4bfa;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ViewMoreButton = styled.button`
  background: none;
  border: none;
  color: #af1763;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  &:hover {
    text-decoration: underline;
  }
`;

const NotesText = styled.div`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-word;
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
  max-height: 80vh;
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
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  border: none;
  background: #374151;
  color: #ffffff;
  &:hover {
    background: #4b5563;
  }
`;

const DragDropArea = styled.div`
  position: relative;
  min-height: 200px;
  border: 2px dashed ${(props) => (props.isDragOver ? "#af1763" : "#374151")};
  border-radius: 16px;
  background: ${(props) =>
    props.isDragOver ? "rgba(175, 23, 99, 0.1)" : "transparent"};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 40px 20px;

  ${(props) =>
    props.isDragOver &&
    `
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(175, 23, 99, 0.3);
  `}
`;

const DragDropContent = styled.div`
  text-align: center;
  color: ${(props) => (props.isDragOver ? "#af1763" : "#9ca3af")};
  transition: color 0.3s ease;
`;

const DragDropIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  transition: transform 0.3s ease;

  ${(props) =>
    props.isDragOver &&
    `
    transform: scale(1.1);
  `}
`;

const DragDropText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const DragDropSubtext = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const FileCount = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  animation: ${(props) => (props.show ? "bounce 0.6s ease" : "none")};

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
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

const SetupButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState("");
  const [selectedCandidateName, setSelectedCandidateName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [hasQuestions, setHasQuestions] = useState(false);
  const fileInputRef = React.useRef();

  // Fetch job details
  const fetchJob = async () => {
    try {
      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("active_jobs")
        .select("*")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
        setError(error.message);
      } else {
        setJob(data);
      }
    } catch (err) {
      console.error("Error in fetchJob:", err);
      setError("Failed to fetch job details");
    }
  };

  // Check if questions exist for this job
  const checkQuestionsExist = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) return;

      const { count, error } = await supabase
        .from("interview_questions")
        .select("*", { count: "exact", head: true })
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId);

      if (error) {
        console.error("Error checking questions:", error);
        return;
      }

      setHasQuestions((count || 0) > 0);
    } catch (err) {
      console.error("Error in checkQuestionsExist:", err);
    }
  };

  // Fetch candidates for this job with server-side filtering
  const fetchCandidates = async (experienceFilter = "", scoreFilter = "") => {
    try {
      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      // First, get candidate IDs from active_job_candidates table (only for current user)
      const { data: jobCandidates, error: jobCandidatesError } = await supabase
        .from("active_job_candidates")
        .select("candidate_id")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId);

      if (jobCandidatesError) {
        console.error("Error fetching job candidates:", jobCandidatesError);
        setError(jobCandidatesError.message);
        return;
      }

      if (!jobCandidates || jobCandidates.length === 0) {
        setCandidates([]);
        setFilteredCandidates([]);
        return;
      }

      // Extract candidate IDs
      const candidateIds = jobCandidates.map((jc) => jc.candidate_id);

      // Build the query with server-side filtering
      let query = supabase
        .from("candidate_data")
        .select("*")
        .in("id", candidateIds)
        .eq("login_user_id", currentUserId);

      // Apply experience filter
      if (experienceFilter) {
        switch (experienceFilter) {
          case "1-2":
            query = query.gte("Experience", 1).lte("Experience", 2);
            break;
          case "2-3":
            query = query.gte("Experience", 2).lte("Experience", 3);
            break;
          case "3-5":
            query = query.gte("Experience", 3).lte("Experience", 5);
            break;
          case "5+":
            query = query.gte("Experience", 5);
            break;
          default:
            break;
        }
      }

      // Apply score filter
      if (scoreFilter) {
        const minScore = parseInt(scoreFilter);
        query = query.gte("Score", minScore);
      }

      // Execute the query
      const { data: candidateData, error: candidateDataError } = await query;

      if (candidateDataError) {
        console.error("Error fetching candidate data:", candidateDataError);
        setError(candidateDataError.message);
      } else {
        setCandidates(candidateData || []);
        setFilteredCandidates(candidateData || []);
      }
    } catch (err) {
      console.error("Error in fetchCandidates:", err);
      setError("Failed to fetch candidates");
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Check if required tables exist
      const tablesExist = await checkTablesExist();
      if (!tablesExist.candidate_data || !tablesExist.active_job_candidates) {
        console.error("❌ Required tables missing");
        displaySetupInstructions();
        setError(
          "Database tables not set up. Please check console for setup instructions."
        );
        setLoading(false);
        return;
      }

      // Check RLS policies
      const rlsStatus = await checkRLSStatus();
      if (!rlsStatus.insertSuccess) {
        console.error("❌ RLS policies not properly configured");
        displayFixInstructions();
        setError(
          "RLS policies not configured. Please check console for fix instructions."
        );
        setLoading(false);
        return;
      }

      await Promise.all([
        fetchJob(),
        fetchCandidates("", ""),
        checkQuestionsExist(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [jobId]);

  // Fetch candidates when filters change (server-side filtering)
  useEffect(() => {
    if (!loading) {
      fetchCandidates(experienceFilter, scoreFilter);
    }
  }, [experienceFilter, scoreFilter]);

  const handleBack = () => {
    navigate("/jobs");
  };

  const processResumeFiles = async (pdfFiles) => {
    setIsProcessing(true);
    setUploadStatus({
      type: "info",
      message: "Processing resumes...",
    });

    try {
      for (const file of pdfFiles) {
        console.log(`\n=== PROCESSING: ${file.name} ===`);

        // Extract text from PDF
        const extractedText = await extractTextFromPDF(file);
        console.log(`Extracted ${extractedText.length} characters from PDF`);

        // Call Groq API to screen the resume
        const groqResponse = await screenResume(
          {
            title: job.job_title,
            description: job.description,
            location: job.location,
            type: job.workplace_type,
          },
          extractedText
        );

        console.log("Groq API Response:", groqResponse);

        // Parse the response
        const candidateData = parseGroqCandidateString(groqResponse);
        if (!candidateData) {
          console.error("Failed to parse candidate data from Groq response");
          continue;
        }

        // Get current user ID
        const currentUserId = await getCurrentUserId();
        console.log(
          `Processing resume ${file.name} with user ID:`,
          currentUserId
        );

        if (!currentUserId) {
          console.error("No user ID found for resume:", file.name);
          setUploadStatus({
            type: "error",
            message: "User not authenticated",
          });
          continue;
        }

        // Insert candidate data into candidate_data table (using existing column names)
        const { data: newCandidate, error: insertError } = await supabase
          .from("candidate_data")
          .insert([
            {
              "Full Name": candidateData.name,
              Email: candidateData.email,
              Phone: parseInt(candidateData.phone.replace(/\D/g, "")) || 0,
              Score: candidateData.score,
              Experience: parseInt(candidateData.experience) || 0,
              Education: candidateData.education || "N/A",
              Degree: candidateData.degree || "N/A",
              Notes: candidateData.notes || "N/A",
              login_user_id: currentUserId,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting candidate data:", insertError);
          console.error("Attempted to insert with user ID:", currentUserId);
          setUploadStatus({
            type: "error",
            message: `Failed to save candidate data: ${insertError.message}`,
          });
          continue;
        }

        console.log("Inserted candidate data:", newCandidate);

        // Insert into active_job_candidates table
        const { error: jobCandidateError } = await supabase
          .from("active_job_candidates")
          .insert([
            {
              job_id: jobId,
              candidate_id: newCandidate.id,
              login_user_id: currentUserId,
            },
          ]);

        if (jobCandidateError) {
          console.error("Error linking candidate to job:", jobCandidateError);
          console.error("Attempted to link with user ID:", currentUserId);
          setUploadStatus({
            type: "error",
            message: `Failed to link candidate to job: ${jobCandidateError.message}`,
          });
          continue;
        }

        console.log("Successfully linked candidate to job");
      }

      // Refresh candidates list with current filters
      await fetchCandidates(experienceFilter, scoreFilter);

      setUploadStatus({
        type: "success",
        message: `Successfully processed ${pdfFiles.length} resume(s) and added candidate(s) to the database.`,
      });
    } catch (error) {
      console.error("Error processing resumes:", error);
      setUploadStatus({
        type: "error",
        message: `Error processing resumes: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
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

    if (pdfFiles.length === 0) {
      setUploadStatus({
        type: "error",
        message: "No PDF files selected.",
      });
      return;
    }

    // Process the selected files
    processResumeFiles(pdfFiles);

    // Clear the file input
    event.target.value = "";
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleViewNotes = (notes, candidateName) => {
    setSelectedNotes(notes);
    setSelectedCandidateName(candidateName);
    setIsNotesModalOpen(true);
  };

  // Handle individual candidate selection
  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(candidateId)) {
        newSelected.delete(candidateId);
      } else {
        newSelected.add(candidateId);
      }
      return newSelected;
    });
  };

  // Handle select all candidates
  const handleSelectAll = () => {
    if (selectedCandidates.size === filteredCandidates.length) {
      // If all are selected, deselect all
      setSelectedCandidates(new Set());
    } else {
      // Select all filtered candidates
      const allCandidateIds = new Set(
        filteredCandidates.map((candidate) => candidate.id)
      );
      setSelectedCandidates(allCandidateIds);
    }
  };

  // Check if all candidates are selected
  const isAllSelected =
    filteredCandidates.length > 0 &&
    selectedCandidates.size === filteredCandidates.length;

  // Check if some candidates are selected
  const isIndeterminate =
    selectedCandidates.size > 0 &&
    selectedCandidates.size < filteredCandidates.length;

  // Handle interview round selection
  const handleInterviewRound = async () => {
    if (selectedCandidates.size === 0) return;

    try {
      setUploadStatus({
        type: "info",
        message: "Moving candidates to interview round...",
      });

      // Get current user ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setUploadStatus({
          type: "error",
          message: "User not authenticated",
        });
        return;
      }

      // Update candidate_data table to set Interview_round = TRUE for selected candidates
      const { error } = await supabase
        .from("candidate_data")
        .update({ Interview_round: true })
        .in("id", Array.from(selectedCandidates))
        .eq("login_user_id", currentUserId);

      if (error) {
        console.error("Error updating candidates for interview round:", error);
        setUploadStatus({
          type: "error",
          message: `Failed to move candidates to interview round: ${error.message}`,
        });
        return;
      }

      setUploadStatus({
        type: "success",
        message: `Successfully moved ${selectedCandidates.size} candidate(s) to interview round.`,
      });

      // Clear selection
      setSelectedCandidates(new Set());

      // Refresh candidates list
      await fetchCandidates(experienceFilter, scoreFilter);

      // Navigate based on whether questions exist
      if (hasQuestions) {
        // Questions already exist, go directly to interviews page
        navigate(`/jobs/${jobId}/interviews?from=applicants`);
      } else {
        // No questions exist, go to questions page first
        navigate(`/jobs/${jobId}/interview-questions?from=applicants`);
      }
    } catch (error) {
      console.error("Error in handleInterviewRound:", error);
      setUploadStatus({
        type: "error",
        message: `Error moving candidates to interview round: ${error.message}`,
      });
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    const nonPdfFiles = files.filter((file) => file.type !== "application/pdf");

    if (nonPdfFiles.length > 0) {
      setUploadStatus({
        type: "error",
        message: `Only PDF files are allowed. ${nonPdfFiles.length} non-PDF file(s) were rejected.`,
      });
      return;
    }

    if (pdfFiles.length === 0) {
      setUploadStatus({
        type: "error",
        message: "No PDF files selected.",
      });
      return;
    }

    // Process the dropped files
    processResumeFiles(pdfFiles);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading applicants..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          Error: {error}
          <br />
          <SetupButton onClick={displaySetupInstructions}>
            📋 Show Setup Instructions
          </SetupButton>
          <SetupButton
            onClick={displayFixInstructions}
            style={{ marginLeft: "8px" }}
          >
            🔧 Show RLS Fix Instructions
          </SetupButton>
          <SetupButton
            onClick={disableRLSTemporarily}
            style={{ marginLeft: "8px" }}
          >
            ⚠️ Show Disable RLS Instructions
          </SetupButton>
        </ErrorState>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <EmptyState>Job not found</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{job.job_title} - Applicants</Title>
        <BackButton onClick={handleBack}>← Back to Jobs</BackButton>
      </Header>

      <JobDescriptionContainer>
        <JobDescriptionTitle>Job Description</JobDescriptionTitle>
        <JobDescriptionContent>{job.description}</JobDescriptionContent>
      </JobDescriptionContainer>

      <TableContainer>
        <TableHeader>
          <TableTitle>Applicants ({filteredCandidates.length})</TableTitle>
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

              <FilterGroup>
                <FilterLabel>Interview</FilterLabel>
                <UploadButton
                  onClick={() =>
                    navigate(`/jobs/${jobId}/interviews?from=applicants`)
                  }
                  disabled={!hasQuestions}
                  style={{
                    background: hasQuestions
                      ? "linear-gradient(135deg, #af1763, #5f4bfa)"
                      : "#374151",
                    color: hasQuestions ? "#ffffff" : "#9ca3af",
                    cursor: hasQuestions ? "pointer" : "not-allowed",
                  }}
                >
                  🎯 Interview
                </UploadButton>
              </FilterGroup>
            </FiltersContainer>

            <UploadButton onClick={triggerFileUpload} disabled={isProcessing}>
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

        {/* Drag and Drop Area */}
        <DragDropArea
          isDragOver={isDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <DragDropContent isDragOver={isDragOver}>
            <DragDropIcon isDragOver={isDragOver}>
              {isDragOver ? "📄" : "📁"}
            </DragDropIcon>
            <DragDropText>
              {isDragOver ? "Drop your resumes here!" : "Drag & Drop Resumes"}
            </DragDropText>
            <DragDropSubtext>
              {isDragOver
                ? "Release to upload"
                : "Drag PDF files here or click the upload button above"}
            </DragDropSubtext>
          </DragDropContent>
          {isDragOver && <FileCount show={isDragOver}>📄</FileCount>}
        </DragDropArea>

        {uploadStatus &&
          (uploadStatus.type === "success" ? (
            <SuccessStatus>✅ {uploadStatus.message}</SuccessStatus>
          ) : uploadStatus.type === "error" ? (
            <ErrorStatus>❌ {uploadStatus.message}</ErrorStatus>
          ) : (
            <InfoStatus>⏳ {uploadStatus.message}</InfoStatus>
          ))}

        <Table>
          <thead>
            <tr>
              <Th style={{ width: "5%" }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
              </Th>
              <Th style={{ width: "12%" }}>Name</Th>
              <Th style={{ width: "15%" }}>Email</Th>
              <Th style={{ width: "10%" }}>Phone</Th>
              <Th style={{ width: "8%" }}>Score</Th>
              <Th style={{ width: "10%" }}>Experience</Th>
              <Th style={{ width: "10%" }}>Education</Th>
              <Th style={{ width: "12%" }}>Degree</Th>
              <Th style={{ width: "8%" }}>Resume</Th>
              <Th style={{ width: "15%" }}>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <Td colSpan="10">
                  <EmptyState>
                    {candidates.length === 0
                      ? "No applicants found for this job"
                      : "No applicants match the selected filters"}
                  </EmptyState>
                </Td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedCandidates.has(candidate.id)}
                      onChange={() => handleCandidateSelect(candidate.id)}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </Td>
                  <Td>{candidate["Full Name"]}</Td>
                  <Td>{candidate["Email"]}</Td>
                  <Td>{formatPhone(candidate["Phone"])}</Td>
                  <Td>
                    <ScoreBadge score={candidate["Score"]}>
                      {candidate["Score"]}/10
                    </ScoreBadge>
                  </Td>
                  <Td>{candidate["Experience"]} years</Td>
                  <Td>{candidate["Education"]}</Td>
                  <Td>{candidate["Degree"] || "N/A"}</Td>
                  <Td>
                    <ResumeLink href="#" onClick={(e) => e.preventDefault()}>
                      View Resume
                    </ResumeLink>
                  </Td>
                  <Td style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                    {candidate["Notes"] ? (
                      <div>
                        <NotesText>
                          {candidate["Notes"].length > 50
                            ? `${candidate["Notes"].substring(0, 50)}...`
                            : candidate["Notes"]}
                        </NotesText>
                        {candidate["Notes"].length > 50 && (
                          <ViewMoreButton
                            onClick={() =>
                              handleViewNotes(
                                candidate["Notes"],
                                candidate["Full Name"]
                              )
                            }
                          >
                            View More
                          </ViewMoreButton>
                        )}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {/* Interview Round Button */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <UploadButton
          onClick={handleInterviewRound}
          disabled={selectedCandidates.size === 0}
          style={{
            background:
              selectedCandidates.size === 0
                ? "#374151"
                : "linear-gradient(135deg, #af1763, #5f4bfa)",
            color: selectedCandidates.size === 0 ? "#9ca3af" : "#ffffff",
            cursor: selectedCandidates.size === 0 ? "not-allowed" : "pointer",
            fontSize: "1.1rem",
            padding: "14px 28px",
          }}
        >
          {selectedCandidates.size === 0
            ? "Select candidates for Interview Round"
            : `📋 Send ${selectedCandidates.size} candidate(s) to Interview Round`}
        </UploadButton>
      </div>

      {/* Notes Modal */}
      {isNotesModalOpen && (
        <ModalOverlay onClick={() => setIsNotesModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Notes for {selectedCandidateName}</ModalTitle>
              <CloseButton onClick={() => setIsNotesModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <ModalBody>{selectedNotes}</ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsNotesModalOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Applicants;
