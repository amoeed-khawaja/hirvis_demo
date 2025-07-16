import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
`;
const FormTitle = styled.h2`
  color: ${({ theme }) => (theme.colors.mode === "dark" ? "#fff" : "#222")};
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 6px;
  font-size: 1rem;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  min-height: 80px;
  margin-bottom: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 6px;
  font-size: 1rem;
`;
const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #155ab6;
  }
`;

const JobForm = ({ onAddJob }) => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salaryRange: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.location && form.salaryRange && form.description) {
      onAddJob(form);
      setForm({ title: "", location: "", salaryRange: "", description: "" });
    }
  };

  return (
    <FormContainer>
      <FormTitle>Add New Job</FormTitle>
      <form onSubmit={handleSubmit}>
        <Input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <Input
          name="salaryRange"
          placeholder="Salary Range"
          value={form.salaryRange}
          onChange={handleChange}
          required
        />
        <TextArea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <Button type="submit">Add Job</Button>
      </form>
    </FormContainer>
  );
};

export default JobForm;
