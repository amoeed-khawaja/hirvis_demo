import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../supabase";
import LoadingSpinner from "./LoadingSpinner";
import { getCurrentUserId } from "../utils/auth";
import {
  checkInterviewQuestionsSetup,
  displayInterviewQuestionsSetupInstructions,
  addDummyQuestions as addDummyQuestionsUtil,
} from "../utils/setupInterviewQuestions";

const Container = styled.div`
  padding: 40px 32px 32px 32px;
  max-width: 800px;
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

const QuestionsContainer = styled.div`
  background: #232837;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
  margin-bottom: 24px;
`;

const QuestionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const QuestionsTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const AddQuestionButton = styled.button`
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
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  &.dragging {
    .question-item:not(.dragging) {
      transition: transform 0.2s ease-out;
    }
  }
`;

const QuestionItem = styled.div`
  background: #374151;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #4b5563;
  cursor: grab;
  transition: all 0.2s ease-out;
  position: relative;
  margin-bottom: 16px;
  user-select: none;

  &:hover:not(.dragging) {
    border-color: #5f4bfa;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(95, 75, 250, 0.15);
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    opacity: 0.9;
    transform: rotate(1deg) scale(1.05);
    z-index: 1000;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    border-color: #5f4bfa;
    background: #3f4a5a;
    transition: none;
  }

  &.placeholder {
    opacity: 0.3;
    transform: scale(0.95);
    border: 2px dashed #5f4bfa;
    background: transparent;

    .question-content {
      visibility: hidden;
    }
  }

  &.shift-up {
    transform: translateY(-80px);
  }

  &.shift-down {
    transform: translateY(80px);
  }

  &.settling {
    animation: settleIntoPlace 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  @keyframes settleIntoPlace {
    0% {
      transform: scale(1.05) rotate(1deg);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }
`;

const InsertionIndicator = styled.div`
  height: 3px;
  background: linear-gradient(90deg, #5f4bfa, #af1763);
  border-radius: 2px;
  margin: 8px 0;
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.2s ease-out;
  box-shadow: 0 0 8px rgba(95, 75, 250, 0.6);

  &.active {
    opacity: 1;
    transform: scaleX(1);
  }
`;

const DragHandle = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: grab;
  padding: 4px;

  &:active {
    cursor: grabbing;
  }
`;

const QuestionContent = styled.div`
  margin-left: 40px;
  margin-right: 40px;

  &.question-content {
    /* For CSS selector targeting */
  }
`;

const QuestionText = styled.div`
  color: #ffffff;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const DeleteIcon = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const AddQuestionModal = styled.div`
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
  max-width: 500px;
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
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #5f4bfa;
  }

  &::placeholder {
    color: #9ca3af;
  }
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
  background: ${(props) =>
    props.variant === "primary"
      ? "linear-gradient(135deg, #af1763, #5f4bfa)"
      : "#374151"};
  color: #ffffff;

  &:hover {
    background: ${(props) =>
      props.variant === "primary"
        ? "linear-gradient(135deg, #8a1250, #4a3fd8)"
        : "#4b5563"};
  }
`;

const BeginInterviewButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 32px auto;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 60px 20px;
  font-size: 1.1rem;
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
  background: rgba(25, 135, 84, 0.1);
  border: 1px solid rgba(25, 135, 84, 0.3);
  color: #198754;
`;

const ErrorStatus = styled(StatusMessage)`
  background: rgba(171, 46, 60, 0.1);
  border: 1px solid rgba(171, 46, 60, 0.3);
  color: #ab2e3c;
`;

const InterviewQuestions = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine navigation source and set appropriate button text/behavior
  const fromSource = searchParams.get("from") || "applicants"; // default to applicants for backward compatibility
  const isFromJobsList = fromSource === "jobs";

  const backButtonText = isFromJobsList
    ? "← Back to Jobs"
    : "← Back to Applicants";
  const beginButtonText = isFromJobsList
    ? "🎯 Interview Round"
    : "🎯 Begin Interview";

  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [draggedQuestion, setDraggedQuestion] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

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

  // Fetch interview questions
  const fetchQuestions = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("job_id", jobId)
        .eq("login_user_id", currentUserId)
        .order("question_order", { ascending: true });

      if (error) {
        console.error("Error fetching questions:", error);
        setError(error.message);
      } else {
        setQuestions(data || []);
      }
    } catch (err) {
      console.error("Error in fetchQuestions:", err);
      setError("Failed to fetch questions");
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Check if interview questions setup is complete
      const setupStatus = await checkInterviewQuestionsSetup();
      if (
        !setupStatus.interview_round_column ||
        !setupStatus.interview_questions_table
      ) {
        console.error("❌ Interview questions setup not complete");
        displayInterviewQuestionsSetupInstructions();
        setError(
          "Interview questions database not set up. Please check console for setup instructions."
        );
        setLoading(false);
        return;
      }

      await Promise.all([fetchJob(), fetchQuestions()]);
      setLoading(false);
    };
    loadData();
  }, [jobId]);

  const handleBack = () => {
    if (isFromJobsList) {
      navigate("/jobs"); // Navigate back to jobs list
    } else {
      navigate(`/jobs/${jobId}/applicants`); // Navigate back to applicants
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    setIsAdding(true);
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setStatusMessage({
          type: "error",
          message: "User not authenticated",
        });
        return;
      }

      const nextOrder =
        questions.length > 0
          ? Math.max(...questions.map((q) => q.question_order)) + 1
          : 1;

      const { data, error } = await supabase
        .from("interview_questions")
        .insert([
          {
            job_id: jobId,
            login_user_id: currentUserId,
            question_text: newQuestion.trim(),
            question_order: nextOrder,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding question:", error);
        setStatusMessage({
          type: "error",
          message: `Failed to add question: ${error.message}`,
        });
      } else {
        setQuestions([...questions, data]);
        setNewQuestion("");
        setShowAddModal(false);
        setStatusMessage({
          type: "success",
          message: "Question added successfully!",
        });
      }
    } catch (error) {
      console.error("Error in handleAddQuestion:", error);
      setStatusMessage({
        type: "error",
        message: `Error adding question: ${error.message}`,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
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
        .from("interview_questions")
        .delete()
        .eq("id", questionId)
        .eq("login_user_id", currentUserId);

      if (error) {
        console.error("Error deleting question:", error);
        setStatusMessage({
          type: "error",
          message: `Failed to delete question: ${error.message}`,
        });
      } else {
        setQuestions(questions.filter((q) => q.id !== questionId));
        setStatusMessage({
          type: "success",
          message: "Question deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Error in handleDeleteQuestion:", error);
      setStatusMessage({
        type: "error",
        message: `Error deleting question: ${error.message}`,
      });
    }
  };

  const handleDragStart = (e, index) => {
    const question = questions[index];
    setDraggedItem(index);
    setDraggedQuestion(question);
    setHoverIndex(null);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());

    // Hide the default drag image
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragEnd = (e) => {
    // Clean up drag state
    setDraggedItem(null);
    setDraggedQuestion(null);
    setHoverIndex(null);
    setIsAnimating(false);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItem !== null && draggedItem !== index) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const itemHeight = rect.height;

      // Determine the insertion point in the FINAL array (after dragged item is removed)
      let insertionIndex;
      if (mouseY < itemHeight / 2) {
        // Insert before this item
        insertionIndex = index;
      } else {
        // Insert after this item
        insertionIndex = index + 1;
      }

      // Adjust for the fact that we'll remove the dragged item first
      if (draggedItem < insertionIndex) {
        insertionIndex = insertionIndex - 1;
      }

      setHoverIndex(insertionIndex);
    }
  };

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeavingContainer =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isLeavingContainer) {
      setHoverIndex(null);
    }
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (
      draggedItem === null ||
      hoverIndex === null ||
      hoverIndex === draggedItem
    ) {
      // Clean up and return if invalid drop
      setDraggedItem(null);
      setDraggedQuestion(null);
      setHoverIndex(null);
      return;
    }

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedItem];

    // Remove the dragged item
    newQuestions.splice(draggedItem, 1);

    // Insert at the new position
    newQuestions.splice(hoverIndex, 0, draggedQuestion);

    // Update question_order for all questions
    const updatedQuestions = newQuestions.map((question, index) => ({
      ...question,
      question_order: index + 1,
    }));

    // Trigger settling animation
    setIsAnimating(true);
    setQuestions(updatedQuestions);

    // Store the target index before cleaning up state
    const targetIndex = hoverIndex;

    // Clean up drag state
    setDraggedItem(null);
    setDraggedQuestion(null);
    setHoverIndex(null);

    // Add settling animation to the dropped item
    setTimeout(() => {
      const questionElements = document.querySelectorAll(".question-item");
      if (questionElements[targetIndex]) {
        questionElements[targetIndex].classList.add("settling");
        setTimeout(() => {
          questionElements[targetIndex]?.classList.remove("settling");
          setIsAnimating(false);
        }, 300);
      } else {
        setIsAnimating(false);
      }
    }, 50);

    // Update the database using individual UPDATE queries to fix RLS issue
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) return;

      // Update each question individually to satisfy RLS policies
      const updatePromises = updatedQuestions.map((question) =>
        supabase
          .from("interview_questions")
          .update({ question_order: question.question_order })
          .eq("id", question.id)
          .eq("login_user_id", currentUserId)
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter((result) => result.error);

      if (errors.length > 0) {
        console.error("Error updating question order:", errors[0].error);
        setStatusMessage({
          type: "error",
          message: "Failed to save question order",
        });
      } else {
        setStatusMessage({
          type: "success",
          message: "Question order updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating question order:", error);
      setStatusMessage({
        type: "error",
        message: "Error updating question order",
      });
    }
  };

  // Add dummy questions if no questions exist
  const addDummyQuestions = async () => {
    try {
      const result = await addDummyQuestionsUtil(jobId);
      if (result.success) {
        setQuestions(result.data);
        setStatusMessage({
          type: "success",
          message: "Dummy questions added successfully!",
        });
      } else {
        setStatusMessage({
          type: "error",
          message: `Error adding dummy questions: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error adding dummy questions:", error);
      setStatusMessage({
        type: "error",
        message: `Error adding dummy questions: ${error.message}`,
      });
    }
  };

  const handleBeginInterview = () => {
    if (isFromJobsList) {
      // When coming from jobs list, this is "Interview Round" - go to interviews page
      navigate(`/jobs/${jobId}/interviews?from=questions`);
    } else {
      // When coming from applicants, this is "Begin Interview" - go to interviews page
      navigate(`/jobs/${jobId}/interviews?from=questions`);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner text="Loading interview questions..." />
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
        <Title>{job.job_title} - Questions</Title>
        <BackButton onClick={handleBack}>{backButtonText}</BackButton>
      </Header>

      <QuestionsContainer>
        <QuestionsHeader>
          <QuestionsTitle>
            Interview Questions ({questions.length})
          </QuestionsTitle>
          <div style={{ display: "flex", gap: "12px" }}>
            {questions.length === 0 && (
              <Button onClick={addDummyQuestions}>
                📝 Add Sample Questions
              </Button>
            )}
            <AddQuestionButton onClick={() => setShowAddModal(true)}>
              ➕ Add Question
            </AddQuestionButton>
          </div>
        </QuestionsHeader>

        {questions.length === 0 ? (
          <EmptyState>
            No interview questions yet. Add some questions to get started!
          </EmptyState>
        ) : (
          <QuestionList
            className={draggedItem !== null ? "dragging" : ""}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => {
              // Handle drops at the very beginning or end
              e.preventDefault();
              if (draggedItem !== null) {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseY = e.clientY - rect.top;
                const listHeight = rect.height;

                // If at the very top (first 20px), set hover to beginning
                if (mouseY < 20) {
                  setHoverIndex(0);
                }
                // If at the very bottom (last 20px), set hover to end
                else if (mouseY > listHeight - 20) {
                  const adjustedEnd =
                    draggedItem < questions.length - 1
                      ? questions.length - 1
                      : questions.length - 2;
                  setHoverIndex(Math.max(0, adjustedEnd));
                }
              }
            }}
            onDrop={(e) => handleDrop(e, 0)}
          >
            {questions.map((question, index) => {
              const isDragging = draggedItem === index;

              // Determine the visual state of this item
              let itemClass = "";

              if (isDragging) {
                itemClass = "placeholder"; // Show placeholder where dragged item was
              } else if (draggedItem !== null && hoverIndex !== null) {
                // Calculate how this item should move to make space for the insertion

                // Create a visual preview: imagine we remove the dragged item and insert at hoverIndex
                let visualIndex = index;

                // If this item comes after the dragged item, it shifts left by 1 in the array
                if (index > draggedItem) {
                  visualIndex = index - 1;
                }

                // Now check if this item needs to move to make space for the insertion
                if (visualIndex >= hoverIndex) {
                  // This item will be pushed to the right, so it should move down visually
                  itemClass = "shift-down";
                }
              }

              // Calculate visual index for insertion indicator
              let showIndicatorBefore = false;
              if (draggedItem !== null && hoverIndex !== null) {
                let itemVisualIndex = index;
                if (index > draggedItem) {
                  itemVisualIndex = index - 1;
                }
                // Show indicator before this item if this is the insertion point
                showIndicatorBefore =
                  itemVisualIndex === hoverIndex && index !== draggedItem;
              }

              return (
                <div key={question.id}>
                  {/* Show insertion indicator before this item if needed */}
                  <InsertionIndicator
                    className={showIndicatorBefore ? "active" : ""}
                  />

                  <QuestionItem
                    className={`question-item ${itemClass}`}
                    draggable={!isAnimating}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <DragHandle>⋮⋮</DragHandle>
                    <QuestionContent className="question-content">
                      <QuestionText>{question.question_text}</QuestionText>
                    </QuestionContent>
                    <DeleteIcon
                      onClick={() => handleDeleteQuestion(question.id)}
                      title="Delete question"
                    >
                      🗑️
                    </DeleteIcon>
                  </QuestionItem>
                </div>
              );
            })}

            {/* Final insertion indicator at the end */}
            {draggedItem !== null && hoverIndex !== null && (
              <InsertionIndicator
                className={
                  // Show at end if hover index is at or beyond the end of the list
                  hoverIndex >=
                  questions.length - (draggedItem !== null ? 1 : 0)
                    ? "active"
                    : ""
                }
              />
            )}
          </QuestionList>
        )}

        {statusMessage &&
          (statusMessage.type === "success" ? (
            <SuccessStatus>✅ {statusMessage.message}</SuccessStatus>
          ) : (
            <ErrorStatus>❌ {statusMessage.message}</ErrorStatus>
          ))}
      </QuestionsContainer>

      {/* Begin Interview / Interview Round Button */}
      <div style={{ textAlign: "center" }}>
        <BeginInterviewButton onClick={handleBeginInterview}>
          {beginButtonText}
        </BeginInterviewButton>
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <AddQuestionModal onClick={() => setShowAddModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add Interview Question</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Question Text</Label>
                <TextArea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter your interview question here..."
                  autoFocus
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim() || isAdding}
              >
                {isAdding ? "Adding..." : "Add Question"}
              </Button>
            </ModalFooter>
          </ModalContainer>
        </AddQuestionModal>
      )}
    </Container>
  );
};

export default InterviewQuestions;
