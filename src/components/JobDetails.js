import React, { useRef } from "react";
import styled from "styled-components";
import CandidateTable from "./CandidateTable";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// Set workerSrc to the public folder for compatibility with Create React App
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

const DetailsContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 32px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  color: ${({ theme }) => theme.colors.text};
`;
const UploadSection = styled.div`
  margin: 32px 0 24px 0;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  text-align: center;
`;
const FileInput = styled.input`
  display: none;
`;
const UploadButton = styled.label`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
  &:hover {
    background: #155ab6;
  }
`;

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}

function parseAndFormatResumeText(text) {
  // Basic regexes for demo purposes
  const nameMatch = text.match(/Name[:\-\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  const phoneMatch = text.match(
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
  );
  const profileLinks = text.match(
    /https?:\/\/[\w\.-]+\.[a-z]{2,}(?:[\/\w\.-]*)*/gi
  );

  // Education: try to extract degree, institute, year
  const educationSection = text.match(
    /Education[:\-\s]*([\s\S]*?)(?:Experience|Skills|$)/i
  );
  let degree = "",
    institute = "",
    gradYear = "";
  if (educationSection) {
    // Try to extract degree (e.g., B.Sc., M.Sc., Bachelor, Master, etc.)
    const degreeMatch = educationSection[1].match(
      /(B\.? ?Sc\.?|M\.? ?Sc\.?|Bachelor|Master|PhD|Associate|Diploma|[A-Z][a-z]+\sDegree)/i
    );
    degree = degreeMatch ? degreeMatch[0] : "";
    // Try to extract institute (look for lines with 'University', 'College', 'Institute')
    const instMatch = educationSection[1].match(
      /([A-Z][a-zA-Z .,&'-]*(University|College|Institute|School))/
    );
    institute = instMatch ? instMatch[0] : "";
    // Try to extract graduation year (4 digits, 19xx or 20xx)
    const yearMatch = educationSection[1].match(/(19|20)\d{2}/);
    gradYear = yearMatch ? yearMatch[0] : "";
  }

  // Experience: extract section and split into bullet points
  const experienceSection = text.match(
    /Experience[:\-\s]*([\s\S]*?)(?:Education|Skills|$)/i
  );
  let experienceBullets = [];
  if (experienceSection) {
    // Split by newlines or periods followed by a capital letter
    experienceBullets = experienceSection[1]
      .split(/\n|(?<=\.)\s+(?=[A-Z])/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Skills: extract section and split into bullet points
  const skillsSection = text.match(
    /Skills[:\-\s]*([\s\S]*?)(?:Experience|Education|$)/i
  );
  let skillsBullets = [];
  if (skillsSection) {
    // Split by commas or newlines
    skillsBullets = skillsSection[1]
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Other details: anything not caught above
  let otherDetails = "";
  // For demo, just grab the first 200 chars after 'Other' or 'Summary'
  const otherMatch = text.match(/(Other|Summary)[:\-\s]*([\s\S]{0,200})/i);
  if (otherMatch) otherDetails = otherMatch[2].trim();

  // Format as requested
  let output = "";
  output += `- Name: ${nameMatch ? nameMatch[1] : ""}\n`;
  output += `- Email: ${emailMatch ? emailMatch[0] : ""}\n`;
  output += `- Contact: ${phoneMatch ? phoneMatch[0] : ""}\n`;
  output += `- Any profile links: ${
    profileLinks ? profileLinks.join(", ") : ""
  }\n`;
  output += `\n- Education: ${degree}\n`;
  output += `- Education Institute: ${institute}\n`;
  output += `- Graduation Year: ${gradYear}\n`;
  output += `\n- Experience:`;
  if (experienceBullets.length) {
    experienceBullets.forEach((b) => (output += `\n  • ${b}`));
  } else {
    output += "\n";
  }
  output += `\n\n- Relevant skills:`;
  if (skillsBullets.length) {
    skillsBullets.forEach((b) => (output += `\n  • ${b}`));
  } else {
    output += "\n";
  }
  output += `\n\n- Other relevant detail: ${otherDetails}\n`;
  return output;
}

const JobDetails = ({ job, candidates, onUploadCVs, filters, setFilters }) => {
  const fileInputRef = useRef();

  if (!job) return <DetailsContainer>Job not found.</DetailsContainer>;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).filter(
      (f) => f.type === "application/pdf"
    );
    if (files.length) {
      for (const file of files) {
        const text = await extractTextFromPDF(file);
        console.log(`Extracted text from ${file.name}:\n`, text);
      }
      onUploadCVs(files);
    }
    fileInputRef.current.value = "";
  };

  return (
    <DetailsContainer>
      <h2>{job.title}</h2>
      <div style={{ color: "#666", marginBottom: 8 }}>
        {job.location} &bull; {job.salaryRange}
      </div>
      <div style={{ marginBottom: 24 }}>{job.description}</div>
      <UploadSection>
        <div style={{ marginBottom: 8 }}>
          Upload CVs (PDF only, multiple allowed):
        </div>
        <FileInput
          ref={fileInputRef}
          id="cv-upload"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
        />
        <UploadButton htmlFor="cv-upload">Upload CVs</UploadButton>
      </UploadSection>
      <CandidateTable
        candidates={candidates}
        filters={filters}
        setFilters={setFilters}
      />
    </DetailsContainer>
  );
};

export default JobDetails;
