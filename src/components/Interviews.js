import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../supabase";
import LoadingSpinner from "./LoadingSpinner";
import { getCurrentUserId } from "../utils/auth";

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

const SectionContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CandidateCount = styled.span`
  background: ${(props) =>
    props.variant === "pending" ? "#f59e0b" : "#10b981"};
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow: auto;
  max-width: 100%;
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
`;

const ResumeLink = styled.a`
  color: #5f4bfa;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ScoreBadge = styled.span`
  background: ${(props) => {
    if (props.score >= 8) return "#10b981";
    if (props.score >= 6) return "#f59e0b";
    return "#ef4444";
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

const CallButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessStatus = styled(StatusMessage)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
`;

const ErrorStatus = styled(StatusMessage)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
`;

const VapiTestButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #374151;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const VapiStatus = styled.div`
  margin: 16px 0;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  background: ${(props) =>
    props.type === "success"
      ? "rgba(16, 185, 129, 0.1)"
      : "rgba(239, 68, 68, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.type === "success"
        ? "rgba(16, 185, 129, 0.3)"
        : "rgba(239, 68, 68, 0.3)"};
  color: ${(props) => (props.type === "success" ? "#10b981" : "#ef4444")};
`;

const Interviews = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [conductedCandidates, setConductedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isTestingVapi, setIsTestingVapi] = useState(false);
  const [vapiStatus, setVapiStatus] = useState(null);
  const [callId, setCallId] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [selectedPending, setSelectedPending] = useState(new Set());
  const [isDialerRunning, setIsDialerRunning] = useState(false);
  const [queuedCandidates, setQueuedCandidates] = useState([]);
  const maxParallelCalls = 5; // Maximum simultaneous calls

  // VAPI Configuration - Call to this number
  const VAPI_CONFIG = {
    testPhoneNumber: "+923280028820", // Your Twilio number (outbound caller ID)
    phoneNumberId: "+923280028820", // Number to call (verified caller ID)
    assistantId: "76fdde8e-32b0-4ecc-b6b0-6392b498e10d",
  };

  // Fetch job details
  const fetchJob = async () => {
    try {
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

  // Fetch candidates for this job
  const fetchCandidates = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      // Get candidate IDs from active_job_candidates table
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
        setPendingCandidates([]);
        setConductedCandidates([]);
        return;
      }

      // Extract candidate IDs
      const candidateIds = jobCandidates.map((jc) => jc.candidate_id);

      // Get candidate data
      const { data: candidateData, error: candidateDataError } = await supabase
        .from("candidate_data")
        .select("*")
        .in("id", candidateIds)
        .eq("login_user_id", currentUserId);

      if (candidateDataError) {
        console.error("Error fetching candidate data:", candidateDataError);
        setError(candidateDataError.message);
      } else {
        // Filter candidates based on Interview_round status
        const pending = candidateData.filter(
          (c) => c.Interview_round === true && c.called !== true
        );
        const conducted = candidateData.filter((c) => c.called === true);

        setPendingCandidates(pending);
        setConductedCandidates(conducted);
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
      await Promise.all([fetchJob(), fetchCandidates()]);
      setLoading(false);
    };
    loadData();
  }, [jobId]);

  // Load queued candidates from localStorage on mount
  useEffect(() => {
    const savedQueued = localStorage.getItem(`queuedCandidates_${jobId}`);
    if (savedQueued) {
      try {
        const parsed = JSON.parse(savedQueued);
        // Convert string dates back to Date objects
        const withDates = parsed.map((item) => ({
          ...item,
          startTime: item.startTime ? new Date(item.startTime) : null,
          endTime: item.endTime ? new Date(item.endTime) : null,
        }));
        setQueuedCandidates(withDates);

        // If there are queued candidates, start the dialer
        if (withDates.length > 0 && !isDialerRunning) {
          setTimeout(() => startParallelDialer(), 2000);
        }
      } catch (e) {
        console.error("Error loading queued candidates:", e);
      }
    }
  }, [jobId]);

  // Save queued candidates to localStorage whenever they change
  useEffect(() => {
    if (queuedCandidates.length > 0) {
      localStorage.setItem(
        `queuedCandidates_${jobId}`,
        JSON.stringify(queuedCandidates)
      );
    } else {
      localStorage.removeItem(`queuedCandidates_${jobId}`);
    }
  }, [queuedCandidates, jobId]);

  // Add CSS animation for dialer indicator
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .dialer-pulse {
        animation: pulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleBack = () => {
    // Check URL search params to see where user came from
    const searchParams = new URLSearchParams(location.search);
    const fromPage = searchParams.get("from");

    if (fromPage === "applicants") {
      navigate(`/jobs/${jobId}/applicants`);
    } else {
      navigate(`/jobs/${jobId}/interview-questions?from=interviews`);
    }
  };

  const handleCallCandidate = async (candidateId) => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setStatusMessage({
          type: "error",
          message: "User not authenticated",
        });
        return;
      }

      const { error } = await supabase
        .from("candidate_data")
        .update({ called: true })
        .eq("id", candidateId)
        .eq("login_user_id", currentUserId);

      if (error) {
        console.error("Error updating candidate:", error);
        setStatusMessage({
          type: "error",
          message: `Failed to update candidate: ${error.message}`,
        });
      } else {
        setStatusMessage({
          type: "success",
          message: "Candidate marked as called successfully!",
        });

        // Refresh candidates list
        await fetchCandidates();
      }
    } catch (error) {
      console.error("Error in handleCallCandidate:", error);
      setStatusMessage({
        type: "error",
        message: `Error updating candidate: ${error.message}`,
      });
    }
  };

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const str = String(phone).replace(/\D/g, "");
    if (str.startsWith("92")) return "+" + str;
    if (str.startsWith("3")) return "0" + str;
    return phone;
  };

  // US phone normalization
  const normalizeUS = (raw) => {
    if (!raw) return null;
    const digits = String(raw).replace(/\D/g, "");
    if (digits.length === 10) return "+1" + digits;
    if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
    if (String(raw).startsWith("+1") && digits.length === 11)
      return "+" + digits;
    return null;
  };

  // Select/Select All handling for pending
  const toggleSelectPending = (candidateId) => {
    setSelectedPending((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) next.delete(candidateId);
      else next.add(candidateId);
      return next;
    });
  };

  const toggleSelectAllPending = () => {
    setSelectedPending((prev) => {
      if (prev.size === pendingCandidates.length) return new Set();
      return new Set(pendingCandidates.map((c) => c.id));
    });
  };

  // Queue selected pending and start parallel dialer
  const scheduleSelectedCalls = () => {
    if (selectedPending.size === 0) return;

    const toQueue = pendingCandidates
      .filter((c) => selectedPending.has(c.id))
      .map((c) => ({
        candidate: c,
        status: "queued",
        callId: null,
        startTime: null,
        endTime: null,
      }));

    setQueuedCandidates((prev) => [...prev, ...toQueue]);
    setPendingCandidates((prev) =>
      prev.filter((c) => !selectedPending.has(c.id))
    );
    setSelectedPending(new Set());

    setVapiStatus({
      type: "success",
      message: `Queued ${toQueue.length} candidate(s) for parallel calling. Starting calls immediately...`,
    });

    // Start calling immediately - no delay
    setTimeout(() => {
      startParallelDialer();
    }, 1000);
  };

  // Start a call for one queued candidate
  const startCallForCandidate = async (queueItem, queueIndex) => {
    const { candidate } = queueItem;

    try {
      const phoneE164 = normalizeUS(candidate["Phone"]);
      if (!phoneE164) {
        setVapiStatus({
          type: "error",
          message: `Invalid US phone for ${candidate["Full Name"]}`,
        });
        return;
      }

      // Update status to "calling"
      setQueuedCandidates((prev) => {
        const next = [...prev];
        if (next[queueIndex]) {
          next[queueIndex] = {
            ...next[queueIndex],
            status: "calling",
            startTime: new Date(),
          };
        }
        return next;
      });

      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setVapiStatus({ type: "error", message: "User not authenticated" });
        return;
      }

      // Company name
      const { data: userData } = await supabase
        .from("users_data")
        .select("organization, assistant_name")
        .eq("login_user_id", currentUserId)
        .single();
      const companyName = userData?.organization || "Your Company";

      // Job title
      const { data: jobData } = await supabase
        .from("active_jobs")
        .select("job_title")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .single();
      const jobTitle = jobData?.job_title || "the position";

      // Questions
      const { data: questions } = await supabase
        .from("interview_questions")
        .select("question_text, question_order")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .order("question_order");
      const questionsList =
        questions && questions.length > 0
          ? questions.map((q) => `"${q.question_text}"`).join("\n\n")
          : '"Tell me about your experience with this type of role."\n\n"What are your strengths and how do they apply to this position?"\n\n"Where do you see yourself in 3-5 years?"';

      // Build candidate summary from DB fields (acts as parsed resume text for now)
      const candidateSummary = `Name: ${candidate["Full Name"]}\nEmail: ${
        candidate["Email"]
      }\nPhone: ${phoneE164}\nScore: ${candidate["Score"]}/10\nExperience: ${
        candidate["Experience"]
      } years\nEducation: ${candidate["Education"]}\nDegree: ${
        candidate["Degree"] || "N/A"
      }\nNotes: ${candidate["Notes"] || "N/A"}`;

      const systemPrompt = `Identity & Purpose:\nYou are Elliot, a professional HR recruiter for ${companyName}. Keep it natural and concise.\n\nIMPORTANT: Your name is Elliot. Always introduce yourself as Elliot.\n\nUse the candidate details at the end to personalize questions and follow-ups.\n\nInterview Questions (order):\n${questionsList}\n\nTimebox: aim to finish in about 4 minutes.\n\nCandidate Details (parsed):\n${candidateSummary}`;

      const assistantId = "76fdde8e-32b0-4ecc-b6b0-6392b498e10d";
      const firstMessage = `Hello, this is Elliot from ${companyName}, I will be conducting your HR interview today. How are you doing?`;

      const vapiPayload = {
        phoneNumber: phoneE164,
        assistantId: assistantId,
        firstMessage: firstMessage,
        systemMessage: systemPrompt,
      };

      console.log(
        `📞 Making VAPI call for ${candidate["Full Name"]} at ${phoneE164}`
      );
      console.log("VAPI payload:", vapiPayload);

      const response = await fetch("http://localhost:5000/api/vapi-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vapiPayload),
      });

      const result = await response.json();
      console.log(`📊 VAPI response for ${candidate["Full Name"]}:`, result);

      if (!response.ok) {
        const errorMsg = `Call failed for ${candidate["Full Name"]}: ${
          result.error || "Unknown error"
        }`;
        console.error(errorMsg);
        setVapiStatus({
          type: "error",
          message: errorMsg,
        });

        // Update status to "failed"
        setQueuedCandidates((prev) => {
          const next = [...prev];
          if (next[queueIndex]) {
            next[queueIndex] = {
              ...next[queueIndex],
              status: "failed",
              endTime: new Date(),
            };
          }
          return next;
        });
        return;
      }

      const newCallId = result.callId || result.data?.id;

      // Update status to "in_call" and attach callId
      setQueuedCandidates((prev) => {
        const next = [...prev];
        if (next[queueIndex]) {
          next[queueIndex] = {
            ...next[queueIndex],
            status: "in_call",
            callId: newCallId,
          };
        }
        return next;
      });

      setVapiStatus({
        type: "success",
        message: `Calling ${candidate["Full Name"]} at ${phoneE164} (Call ID: ${newCallId})`,
      });

      // Start polling for this call
      if (newCallId) {
        setTimeout(() => checkQueuedCallStatus(newCallId, queueIndex), 5000);
      }
    } catch (err) {
      console.error("Error starting call:", err);
      setVapiStatus({
        type: "error",
        message: `Error starting call for ${candidate["Full Name"]}: ${err.message}`,
      });

      // Update status to "failed"
      setQueuedCandidates((prev) => {
        const next = [...prev];
        if (next[queueIndex]) {
          next[queueIndex] = {
            ...next[queueIndex],
            status: "failed",
            endTime: new Date(),
          };
        }
        return next;
      });
    }
  };

  // Parallel dialer: starts up to maxParallelCalls simultaneously
  const startParallelDialer = async () => {
    setIsDialerRunning(true);

    try {
      const startNextBatch = async () => {
        const snapshot = queuedCandidates;
        const queuedItems = snapshot.filter((q) => q.status === "queued");

        if (queuedItems.length === 0) {
          setIsDialerRunning(false);
          return;
        }

        // Start up to maxParallelCalls simultaneously
        const toStart = queuedItems.slice(0, maxParallelCalls);

        console.log(`🚀 Starting ${toStart.length} calls in parallel...`);

        // Start all calls in parallel
        const startPromises = toStart.map(async (item) => {
          const queueIndex = snapshot.findIndex(
            (q) => q.candidate.id === item.candidate.id
          );
          await startCallForCandidate(item, queueIndex);
        });

        await Promise.all(startPromises);

        // Check again in 5 seconds for more queued items (faster response)
        setTimeout(startNextBatch, 5000);
      };

      await startNextBatch();
    } catch (e) {
      console.error("Error in parallel dialer:", e);
      setIsDialerRunning(false);
    }
  };

  // Poll a specific queued call and update its status
  const checkQueuedCallStatus = async (callId, queueIndex) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/vapi-call-status/${callId}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Error checking call status:", data);
        return;
      }

      // Map VAPI status to our status
      let mappedStatus = data.status;
      if (mappedStatus === "queued") mappedStatus = "queued";
      if (mappedStatus === "ringing" || mappedStatus === "in-progress")
        mappedStatus = "in_call";
      if (mappedStatus === "completed") mappedStatus = "completed";
      if (
        mappedStatus === "busy" ||
        mappedStatus === "no-answer" ||
        mappedStatus === "failed"
      )
        mappedStatus = "no_answer";
      if (mappedStatus === "declined") mappedStatus = "declined";

      // Update status in queue
      setQueuedCandidates((prev) => {
        const next = [...prev];
        if (next[queueIndex]) {
          next[queueIndex] = {
            ...next[queueIndex],
            status: mappedStatus,
            endTime: mappedStatus !== "in_call" ? new Date() : null,
          };
        }
        return next;
      });

      // If call completed, move to conducted and start next batch
      if (mappedStatus === "completed") {
        // Get call artifacts
        try {
          const artifactsResponse = await fetch(
            `http://localhost:5000/api/vapi-call-artifacts/${callId}`
          );
          const artifacts = await artifactsResponse.json();

          if (artifactsResponse.ok && artifacts.data) {
            console.log(
              `📝 Call completed for ${queuedCandidates[queueIndex]?.candidate["Full Name"]}:`,
              artifacts.data
            );
          }
        } catch (e) {
          console.error("Error fetching call artifacts:", e);
        }

        // Move to conducted interviews
        const completedItem = queuedCandidates[queueIndex];
        if (completedItem) {
          setConductedCandidates((prev) => [...prev, completedItem.candidate]);

          // Remove from queue
          setQueuedCandidates((prev) =>
            prev.filter((_, index) => index !== queueIndex)
          );

          // Update localStorage
          const updatedQueue = queuedCandidates.filter(
            (_, index) => index !== queueIndex
          );
          if (updatedQueue.length > 0) {
            localStorage.setItem(
              `queuedCandidates_${jobId}`,
              JSON.stringify(updatedQueue)
            );
          } else {
            localStorage.removeItem(`queuedCandidates_${jobId}`);
          }

          // Start next batch if dialer is running
          if (isDialerRunning) {
            setTimeout(() => startParallelDialer(), 2000);
          }
        }
        return;
      }

      // Continue polling for active calls
      if (mappedStatus === "in_call" || mappedStatus === "ringing") {
        setTimeout(() => checkQueuedCallStatus(callId, queueIndex), 8000);
      } else {
        // Call ended but not completed (no-answer, declined, failed)
        // Start next batch if dialer is running
        if (isDialerRunning) {
          setTimeout(() => startParallelDialer(), 5000);
        }
      }
    } catch (err) {
      console.error("Error checking queued call status:", err);
      // Retry after delay
      setTimeout(() => checkQueuedCallStatus(callId, queueIndex), 10000);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "queued":
        return "#f59e0b"; // amber
      case "calling":
        return "#3b82f6"; // blue
      case "in_call":
        return "#10b981"; // green
      case "completed":
        return "#059669"; // emerald
      case "no_answer":
        return "#ef4444"; // red
      case "declined":
        return "#dc2626"; // red
      case "failed":
        return "#7f1d1d"; // dark red
      default:
        return "#6b7280"; // gray
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case "queued":
        return "⏳ Queued";
      case "calling":
        return "📞 Calling";
      case "in_call":
        return "🎙️ In Call";
      case "completed":
        return "✅ Completed";
      case "no_answer":
        return "❌ No Answer";
      case "declined":
        return "🚫 Declined";
      case "failed":
        return "💥 Failed";
      default:
        return "❓ Unknown";
    }
  };

  // Test VAPI integration
  const testVapiCall = async () => {
    try {
      setIsTestingVapi(true);
      setVapiStatus(null);

      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setVapiStatus({ type: "error", message: "User not authenticated" });
        return;
      }

      // Get user data for company name and assistant name
      const { data: userData, error: userError } = await supabase
        .from("users_data")
        .select("organization, assistant_name")
        .eq("login_user_id", currentUserId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        setVapiStatus({
          type: "error",
          message: "Failed to fetch company information",
        });
        return;
      }

      const companyName = userData?.organization || "Your Company";
      const assistantName = userData?.assistant_name || "Elliot";

      // Get job details for job title
      const { data: jobData, error: jobError } = await supabase
        .from("active_jobs")
        .select("job_title")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .single();

      if (jobError) {
        console.error("Error fetching job data:", jobError);
        setVapiStatus({
          type: "error",
          message: "Failed to fetch job information",
        });
        return;
      }

      const jobTitle = jobData?.job_title || "the position";

      // Get interview questions for this job
      const { data: questions, error: questionsError } = await supabase
        .from("interview_questions")
        .select("question_text, question_order")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .order("question_order");

      if (questionsError) {
        console.error("Error fetching questions:", questionsError);
        setVapiStatus({
          type: "error",
          message: "Failed to fetch interview questions",
        });
        return;
      }

      // Format questions for the prompt with proper ordering
      const questionsList =
        questions && questions.length > 0
          ? questions.map((q) => `"${q.question_text}"`).join("\n\n")
          : '"Tell me about your experience with this type of role."\n\n"What are your strengths and how do they apply to this position?"\n\n"Where do you see yourself in 3-5 years?"';

      // Build the system prompt
      const systemPrompt = `Identity & Purpose:
You are Elliot, a professional HR recruiter for ${companyName}, responsible for conducting structured first-round interviews. Your role is to gather insight into the candidate's background, communication ability, and compatibility with the role and company culture—without sounding robotic or scripted.

IMPORTANT: Your name is Elliot. Always introduce yourself as Elliot. Never use any other name.

You will receive, at the end of this prompt, the candidate's resume data and the position they applied for. Use this information smartly to personalize your questions, identify red flags, and probe where needed—but without forcing answers.

Voice & Persona
Tone & Demeanor
Calm, focused, and naturally conversational

Sound fluent and uninterrupted, even when speaking continuously

Never robotic or overly enthusiastic

Be respectful but in control—you lead the conversation

Realism & Pacing
Use occasional human-like phrases to simulate fluency:

"Alright…", "Okay, got it…", "Let's move on…"

Never pause awkwardly or stutter, even if interrupted

If interrupted, do not stop or reset—keep speaking confidently

Boundaries
Never disclose that you are an AI. If asked, redirect or ignore.

If the candidate is unprofessional or inappropriate, you may end the call:

"This conversation is no longer appropriate for a professional setting. We'll be ending the interview now."

Interview Structure
Start
Begin the conversation with:

"Hi, this is ${assistantName} from ${companyName}. Thanks for joining. I'll be conducting your initial interview today. Let's begin."

Then:

"Please keep your responses professional and relevant. If you're ever unsure or prefer not to answer a question, that's okay—we'll simply continue."

Interview Questions
Ask the following in this order. Do not enforce any question—if the candidate skips or struggles, move on without pressure. Avoid over-validating every answer.

"Tell me about yourself."
(No praise needed. If they skip: "No worries—let's move on.")

"What attracted you to the ${jobTitle} position or to ${companyName}?"

${questionsList}

Cross-Verification
Using resume details provided at the end:

Ask personalized, resume-driven follow-ups:

"You listed a project at [Company], but the timeline overlaps with another role. Can you clarify that?"

If something is vague:

"You mention managing teams—was that direct supervision or coordination?"

If relevant experience is missing:

"This role requires client communication, but I don't see much of that in your background. Have you had exposure to it in another form?"

If they can't answer or avoid the follow-up—just move on.

Evaluation Focus
For each answer, internally consider:

Communication skills

Cultural red flags

Professional maturity

Motivation and focus

Fit with ${companyName}'s environment and role demands

Do not express all of this aloud. Only comment when appropriate.

Special Situations
If interrupted: Continue without breaking flow

"So as I was saying—what kind of work environment brings out your best?"

If asked about being AI: Do not answer

"Let's keep focused on the interview."

If asked something outside your scope:

"That's something I'll have to check with my manager."

If inappropriate behavior occurs:

"This is not acceptable in a professional setting. We're ending the interview now."

End the Interview
"That concludes our initial conversation. If selected, someone from ${companyName} will contact you in the coming days. Thanks again for your time."

Key Behavior Rules
✅ Do:

Be concise and confident

Keep the tone professional and controlled

Move on if the candidate struggles or skips a question

Use resume to personalize questions

Respond naturally but avoid over-praising

❌ Do Not:

Reveal you're an AI

Push for answers

Over-explain or overreact to each response

Allow the candidate to dominate or derail the flow

Position: ${jobTitle}

Candidate Details:

Abdul Moeed Khawaja  moeed0003@gmail.com | +92   332   2227518 |   LinkedIn   |   GitHub  WORK   EXPERIENCE  Systems Limited   Aug   2025   –   Present  Intern   -   DevOps  •   Assisted in setting up and maintaining CI/CD pipelines (e.g., GitHub Actions, Jenkins, or GitLab CI) to automate build, test,  and deployment processes.  •   Supported cloud infrastructure management ( MS   Azure ) by writing scripts, configuring services, and monitoring resources.  •   Gained hands - on experience with containerization and orchestration tools such as Docker and Kubernetes.  K larus AI   Jul   2025   –   Aug 2025  AI Automation Engineer  •   Building AI - Aided Automation software.  •   Using different   AI   tools and technologies for different project requirements.  •   Delivering quality with efficiency.  Farmovation   A pril   202 5   –   Jul y 2025  Mobile App Developer  ●   Designing a completely user - friendly , interactive, functional mobile app using React Native, Node js, MongoDB .  ●   Building the mobile app with backend APIs and adding features from the web version, including satellite data for insights lik e  soil moisture.  ●   Exploring and implementing chatbot or voice chat features to enhance user support and engagement.  Beaconhouse National University (BNU)   Sept 2024 –   June   202 5  Teacher Assistantship  •   Teacher Assistant to courses, OOP, OOP Lab, Physics, ICT.  •   Assisting professors in delivering lectures, grading assignments, quizzes, and exams for OOP and ICT Lab courses.  Learners Academy   Jan 2024   –   Jun 2024  Software Developer   –   Full Stack  ●   Automated the academy's manual pen - and - paper system   to a computerized system .  ●   Built a complete   lead management system DMBS that tracks leads, kept record & monitors fee pay - time   as well as   allotting  commissions based upon sales .  EDUCATION  Beaconhouse   National   University   (BNU)   Sep   2022   –   Present  BSc   (Honors)   in   Computer   Science  •   Relevant   Courses:   Artificial Intelligence, Data Structures and Algorithms, Design & Analysis of Algorithms, OOP, Mobile  Computing, 2D 3D with JavaScript.  PROJECTS HIGHLIGHT  •   Automated AI HR Agent :   A system that scans resumes, classifies data into   tables   & gives candidate a score . Then, an AI  Agent calls all candidates and conducts the screening interviews. The summary is forwarded.  •   Audio Lecture Notes Simulator App :   Takes audio as input then transcribes, summarizes & provides notes.  •   Street Fighter remake   (JS) :   Remake of the classic fighting game.  •   AabPashi Mobile App :   Connecting satellite imagery data and implementing that on mobile application.  CERTIFICATIONS  -   Systems Limited   –   DevOps Serverless, IT Mustakbil Training Program   -   Data Science with Python  -   Harvard CS50: Intro to R   -   Project Manageme nt   –   Google .  SKILLS   &   INTERESTS  Technical Skills:   DevOps ; Dockerization , Jenkins,   K ubernetes ,   Terraform ,   Microsoft Azure ,   Data Science,   Python, Linux ,   Jira,  ClickUp, Trello,   JavaScript ;   p5   Js , matter Js ,   React Native, Flutter/Dart, PHP/Laravel, HTML/CSS, Bootstrap, SQL, R, MS Excel,  PowerPoint, Figma , make.com,   Vapi , SupaBase .  Soft Skills:   Growth mindset, Leadership, Communication, Mentorship, Decision - Making, Conflict Resolution, Agile Mindset.  Interests:   Project Management,   DevOps,   Data Science,   Data Analytics, Artificial Intelligence,   App Development .`;

      const assistantId = "76fdde8e-32b0-4ecc-b6b0-6392b498e10d";
      const firstMessage = `Hello, this is Elliot from ${companyName}, I will be conducting your HR interview today. How are you doing?`;

      // Make the VAPI call using assistantOverrides so runtime config takes effect immediately
      console.log("Making VAPI call with runtime overrides...");
      const vapiPayload = {
        phoneNumber: VAPI_CONFIG.testPhoneNumber,
        assistantId: VAPI_CONFIG.assistantId,
        firstMessage: firstMessage,
        systemMessage: systemPrompt,
      };

      console.log("Calling VAPI with payload:", vapiPayload);

      // Call the backend VAPI endpoint
      const response = await fetch("http://localhost:5000/api/vapi-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vapiPayload),
      });

      const result = await response.json();
      console.log("VAPI response:", result);

      if (response.ok) {
        const callId = result.callId || result.data?.id;
        setCallId(callId);
        setVapiStatus({
          type: "success",
          message: `✅ VAPI assistant updated and call initiated successfully! Call to ${
            VAPI_CONFIG.testPhoneNumber
          } with ${assistantName} assistant for ${companyName}. Call ID: ${
            callId || "N/A"
          }`,
        });

        // Start monitoring call status
        if (callId) {
          setTimeout(() => checkCallStatus(callId), 5000); // Check after 5 seconds
        }
      } else {
        let errorMessage = `❌ VAPI call failed: ${
          result.error || "Unknown error"
        }`;

        // Handle specific daily limit error
        if (
          result.message &&
          result.message.includes("Daily Outbound Call Limit")
        ) {
          errorMessage = `❌ VAPI Daily Limit Reached: ${result.message}`;
        }

        setVapiStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error testing VAPI:", error);
      setVapiStatus({
        type: "error",
        message: `Failed to test VAPI: ${error.message}`,
      });
    } finally {
      setIsTestingVapi(false);
    }
  };

  // Check call status and get transcriptions
  const checkCallStatus = async (callId) => {
    try {
      console.log("🔍 Checking call status for:", callId);

      const response = await fetch(
        `http://localhost:5000/api/vapi-call-status/${callId}`
      );
      const result = await response.json();

      if (response.ok) {
        setCallStatus(result);
        console.log("📊 Call Status:", result);

        if (result.status === "completed") {
          console.log("🎯 CALL COMPLETED!");

          // Fetch call artifacts (transcript, summary, recording)
          await fetchCallArtifacts(callId);

          // Stop monitoring if call is completed
          return;
        }

        // Continue monitoring if call is still in progress
        if (result.status === "in-progress" || result.status === "ringing") {
          setTimeout(() => checkCallStatus(callId), 10000); // Check every 10 seconds
        }
      } else {
        console.error("Failed to check call status:", result.error);
      }
    } catch (error) {
      console.error("Error checking call status:", error);
    }
  };

  // Fetch call artifacts (transcript, summary, recording)
  const fetchCallArtifacts = async (callId) => {
    try {
      console.log("🎁 Fetching call artifacts for:", callId);

      const response = await fetch(
        `http://localhost:5000/api/vapi-call-artifacts/${callId}`
      );
      const artifacts = await response.json();

      if (response.ok) {
        console.log("📦 Call Artifacts:", artifacts);

        // Update call status with artifacts
        setCallStatus((prev) => ({ ...prev, ...artifacts }));

        // Log detailed information
        if (artifacts.transcript && artifacts.transcript.length > 0) {
          console.log("📝 FULL TRANSCRIPT:");
          artifacts.transcript.forEach((entry, index) => {
            console.log(
              `${index + 1}. [${entry.role}] ${entry.message} (${entry.time}s)`
            );
          });
        }

        if (artifacts.summary) {
          console.log("📋 AI SUMMARY:", artifacts.summary);
        }

        if (artifacts.recordingUrl) {
          console.log("🎵 RECORDING URL:", artifacts.recordingUrl);
        }

        if (artifacts.structuredOutputs) {
          console.log("🏗️ STRUCTURED OUTPUTS:", artifacts.structuredOutputs);
        }
      } else {
        console.error("Failed to fetch call artifacts:", artifacts.error);
      }
    } catch (error) {
      console.error("Error fetching call artifacts:", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading interviews..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div
          style={{
            textAlign: "center",
            color: "#ef4444",
            padding: "60px 20px",
          }}
        >
          Error: {error}
        </div>
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
        <Title>{job.job_title} - Interviews</Title>
        <BackButton onClick={handleBack}>← Back to Questions</BackButton>
      </Header>

      {/* VAPI Test Section */}
      <VapiTestButton onClick={testVapiCall} disabled={isTestingVapi}>
        {isTestingVapi ? "🔄 Testing VAPI..." : "📞 Test VAPI Call"}
      </VapiTestButton>

      {/* Twilio Number Status */}
      <div
        style={{
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
          color: "#10b981",
        }}
      >
        <strong>✅ VAPI Call Configuration</strong>
        <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem" }}>
          Calling from: <strong>+1 (562) 418-6049</strong> (Your Twilio number)
          <br />
          Calling to: <strong>+92 328 002 8820</strong> (Your verified number)
          <br />
          <strong>Status:</strong> Ready for unlimited calling
        </p>
        <button
          onClick={() => {
            console.log("📱 VAPI Call Configuration:");
            console.log("Calling from: +1 (562) 418-6049 (Your Twilio number)");
            console.log("Calling to: +92 328 002 8820 (Your verified number)");
            console.log("Assistant ID: 76fdde8e-32b0-4ecc-b6b0-6392b498e10d");
            console.log("Status: Ready for unlimited calling");
          }}
          style={{
            background: "#10b981",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          📋 Show Configuration in Console
        </button>
      </div>

      {vapiStatus && (
        <VapiStatus type={vapiStatus.type}>
          {vapiStatus.type === "success" ? "✅" : "❌"} {vapiStatus.message}
        </VapiStatus>
      )}

      {/* Call Status Display */}
      {callId && callStatus && (
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>📞 Call Status: {callStatus.status}</SectionTitle>
          </SectionHeader>

          <div style={{ color: "#ffffff", fontSize: "0.9rem" }}>
            <p>
              <strong>Call ID:</strong> {callId}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {callStatus.phoneNumber || VAPI_CONFIG.testPhoneNumber}
            </p>
            {callStatus.duration && (
              <p>
                <strong>Duration:</strong> {callStatus.duration} seconds
              </p>
            )}

            {callStatus.status === "completed" && (
              <div style={{ marginTop: "16px" }}>
                {/* Display Transcript */}
                {callStatus.transcript && callStatus.transcript.length > 0 && (
                  <div
                    style={{
                      marginBottom: "16px",
                      padding: "12px",
                      background: "rgba(95, 75, 250, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <h4 style={{ color: "#5f4bfa", margin: "0 0 8px 0" }}>
                      📝 Transcript
                    </h4>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {callStatus.transcript.map((entry, index) => (
                        <div
                          key={index}
                          style={{ marginBottom: "8px", fontSize: "0.85rem" }}
                        >
                          <strong
                            style={{
                              color:
                                entry.role === "assistant"
                                  ? "#5f4bfa"
                                  : "#af1763",
                            }}
                          >
                            [
                            {entry.role === "assistant"
                              ? "Elliot"
                              : "Candidate"}
                            ]
                          </strong>
                          <span style={{ marginLeft: "8px" }}>
                            {entry.message}
                          </span>
                          <span
                            style={{
                              color: "#6b7280",
                              marginLeft: "8px",
                              fontSize: "0.8rem",
                            }}
                          >
                            ({entry.time}s)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display Summary */}
                {callStatus.summary && (
                  <div
                    style={{
                      marginBottom: "16px",
                      padding: "12px",
                      background: "rgba(175, 23, 99, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <h4 style={{ color: "#af1763", margin: "0 0 8px 0" }}>
                      📋 AI Summary
                    </h4>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.9rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {callStatus.summary}
                    </p>
                  </div>
                )}

                {/* Display Recording */}
                {callStatus.recordingUrl && (
                  <div
                    style={{
                      marginBottom: "16px",
                      padding: "12px",
                      background: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <h4 style={{ color: "#10b981", margin: "0 0 8px 0" }}>
                      🎵 Call Recording
                    </h4>
                    <audio controls style={{ width: "100%" }}>
                      <source src={callStatus.recordingUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <a
                      href={callStatus.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        color: "#10b981",
                        textDecoration: "none",
                      }}
                    >
                      🔗 Open Recording in New Tab
                    </a>
                  </div>
                )}

                {/* Console View Button */}
                <button
                  onClick={() => {
                    console.log("📝 TRANSCRIPT:", callStatus.transcript);
                    console.log("📋 SUMMARY:", callStatus.summary);
                    console.log("🎵 RECORDING:", callStatus.recordingUrl);
                  }}
                  style={{
                    background: "#374151",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  📊 View All Data in Console
                </button>
              </div>
            )}
          </div>
        </SectionContainer>
      )}

      {/* Pending Interviews Section */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            ⏳ Pending Interviews
            <CandidateCount variant="pending">
              {pendingCandidates.length}
            </CandidateCount>
          </SectionTitle>
        </SectionHeader>

        {pendingCandidates.length === 0 ? (
          <EmptyState>
            No pending interviews. All candidates have been called or are not in
            interview round.
          </EmptyState>
        ) : (
          <div>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th style={{ width: "5%" }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedPending.size === pendingCandidates.length &&
                          pendingCandidates.length > 0
                        }
                        onChange={toggleSelectAllPending}
                        style={{ transform: "scale(1.2)" }}
                      />
                    </Th>
                    <Th style={{ width: "18%" }}>Name</Th>
                    <Th style={{ width: "22%" }}>Email</Th>
                    <Th style={{ width: "15%" }}>Phone</Th>
                    <Th style={{ width: "10%" }}>Score</Th>
                    <Th style={{ width: "15%" }}>Resume</Th>
                    <Th style={{ width: "15%" }}>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCandidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <Td>
                        <input
                          type="checkbox"
                          checked={selectedPending.has(candidate.id)}
                          onChange={() => toggleSelectPending(candidate.id)}
                          style={{ transform: "scale(1.2)" }}
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
                      <Td>
                        <ResumeLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              `/jobs/${jobId}/applicants/${candidate.id}/resume`
                            );
                          }}
                        >
                          View Resume
                        </ResumeLink>
                      </Td>
                      <Td>
                        <CallButton
                          onClick={() => handleCallCandidate(candidate.id)}
                        >
                          📞 Call
                        </CallButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>

            {selectedPending.size > 0 && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  onClick={scheduleSelectedCalls}
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  📞 Schedule Call ({selectedPending.size} selected)
                </button>
              </div>
            )}
          </div>
        )}
      </SectionContainer>

      {/* Queued Interviews Section */}
      {queuedCandidates.length > 0 && (
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>
              📋 Queued Interviews
              <CandidateCount variant="pending">
                {queuedCandidates.length}
              </CandidateCount>
              {isDialerRunning && (
                <span
                  className="dialer-pulse"
                  style={{
                    marginLeft: "12px",
                    color: "#10b981",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  🔄 Dialer Running
                </span>
              )}
            </SectionTitle>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              {queuedCandidates.filter((q) => q.status === "queued").length}{" "}
              queued •
              {queuedCandidates.filter((q) => q.status === "calling").length}{" "}
              calling •
              {queuedCandidates.filter((q) => q.status === "in_call").length} in
              call •
              {queuedCandidates.filter((q) => q.status === "completed").length}{" "}
              completed
            </div>
            {!isDialerRunning && (
              <button
                onClick={() => startParallelDialer()}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                🚀 Start Dialer
              </button>
            )}
          </SectionHeader>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: "20%" }}>Name</Th>
                  <Th style={{ width: "20%" }}>Email</Th>
                  <Th style={{ width: "15%" }}>Phone</Th>
                  <Th style={{ width: "10%" }}>Score</Th>
                  <Th style={{ width: "15%" }}>Status</Th>
                  <Th style={{ width: "10%" }}>Time</Th>
                  <Th style={{ width: "10%" }}>Action</Th>
                </tr>
              </thead>
              <tbody>
                {queuedCandidates.map((queueItem, index) => {
                  const { candidate, status, startTime, endTime } = queueItem;
                  return (
                    <tr key={candidate.id}>
                      <Td>{candidate["Full Name"]}</Td>
                      <Td>{candidate["Email"]}</Td>
                      <Td>{formatPhone(candidate["Phone"])}</Td>
                      <Td>
                        <ScoreBadge score={candidate["Score"]}>
                          {candidate["Score"]}/10
                        </ScoreBadge>
                      </Td>
                      <Td>
                        <span
                          style={{
                            background: getStatusBadgeColor(status),
                            color: "#ffffff",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                          }}
                        >
                          {getStatusText(status)}
                        </span>
                      </Td>
                      <Td style={{ fontSize: "0.8rem" }}>
                        {startTime && (
                          <div>
                            {startTime.toLocaleTimeString()}
                            {endTime && (
                              <div>
                                {Math.round((endTime - startTime) / 1000)}s
                              </div>
                            )}
                          </div>
                        )}
                      </Td>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          {status === "queued" && (
                            <button
                              onClick={() =>
                                startCallForCandidate(queueItem, index)
                              }
                              style={{
                                background: "#3b82f6",
                                color: "#ffffff",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "none",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              ▶ Call now
                            </button>
                          )}
                          {(status === "failed" ||
                            status === "no_answer" ||
                            status === "declined") && (
                            <button
                              onClick={() => {
                                setQueuedCandidates((prev) => {
                                  const next = [...prev];
                                  if (next[index]) {
                                    next[index] = {
                                      ...next[index],
                                      status: "queued",
                                      startTime: null,
                                      endTime: null,
                                    };
                                  }
                                  return next;
                                });
                              }}
                              style={{
                                background: "#f59e0b",
                                color: "#ffffff",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "none",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                width: "100%",
                              }}
                            >
                              🔄 Retry
                            </button>
                          )}
                          <ResumeLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                `/jobs/${jobId}/applicants/${candidate.id}/resume`
                              );
                            }}
                            style={{
                              fontSize: "0.8rem",
                              textAlign: "center",
                              padding: "4px 8px",
                              background: "rgba(95, 75, 250, 0.1)",
                              borderRadius: "4px",
                              border: "1px solid rgba(95, 75, 250, 0.3)",
                            }}
                          >
                            📄 Resume
                          </ResumeLink>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
        </SectionContainer>
      )}

      {/* Conducted Interviews Section */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            ✅ Conducted Interviews
            <CandidateCount variant="conducted">
              {conductedCandidates.length}
            </CandidateCount>
          </SectionTitle>
        </SectionHeader>

        {conductedCandidates.length === 0 ? (
          <EmptyState>
            No conducted interviews yet. Call candidates to start interviews.
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: "15%" }}>Name</Th>
                  <Th style={{ width: "18%" }}>Email</Th>
                  <Th style={{ width: "12%" }}>Phone</Th>
                  <Th style={{ width: "10%" }}>Score</Th>
                  <Th style={{ width: "10%" }}>Resume</Th>
                  <Th style={{ width: "20%" }}>Notes</Th>
                  <Th style={{ width: "15%" }}>Call Info</Th>
                </tr>
              </thead>
              <tbody>
                {conductedCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <Td>{candidate["Full Name"]}</Td>
                    <Td>{candidate["Email"]}</Td>
                    <Td>{formatPhone(candidate["Phone"])}</Td>
                    <Td>
                      <ScoreBadge
                        score={
                          candidate["interview_score"] ||
                          candidate["Score"] ||
                          0
                        }
                      >
                        {candidate["interview_score"] ||
                          candidate["Score"] ||
                          "N/A"}
                        /10
                      </ScoreBadge>
                    </Td>
                    <Td>
                      <ResumeLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(
                            `/jobs/${jobId}/applicants/${candidate.id}/resume`
                          );
                        }}
                      >
                        View Resume
                      </ResumeLink>
                    </Td>
                    <Td style={{ fontSize: "0.9rem" }}>
                      {candidate["interview_notes"] ||
                        candidate["Notes"] ||
                        "No notes available"}
                    </Td>
                    <Td>
                      <button
                        onClick={() => {
                          // For now, this will log call artifacts to console
                          // In the future, this will open a modal with call details
                          console.log(
                            "📞 Call info for:",
                            candidate["Full Name"]
                          );
                          console.log(
                            "This feature will show call transcript, summary, and audio when implemented"
                          );
                        }}
                        style={{
                          background: "#5f4bfa",
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        📋 Call info
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </SectionContainer>

      {statusMessage &&
        (statusMessage.type === "success" ? (
          <SuccessStatus>✅ {statusMessage.message}</SuccessStatus>
        ) : (
          <ErrorStatus>❌ {statusMessage.message}</ErrorStatus>
        ))}
    </Container>
  );
};

export default Interviews;
