import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";

const GradientButton = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #af1763 0%, #5f4bfa 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 12px;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    background: linear-gradient(90deg, #8a1250 0%, #3a2e7c 100%);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #10121a;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  padding: 0 5vw;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #232837 60%, #23283700 100%);
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: #b3b8c5;
  font-size: 1.08rem;
  margin-bottom: 28px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
`;

const SocialButton = styled.button`
  flex: 1;
  background: #181a20;
  border: 1px solid #232837;
  border-radius: 8px;
  padding: 10px 0;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #232837;
    border-color: #af1763;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #6b7280;
  margin: 18px 0 18px 0;
  font-size: 0.98rem;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #232837;
    margin: 0 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #232837;
  background: #181a20;
  color: #fff;
  font-size: 1rem;
  transition: border 0.2s;
  &:focus {
    border-color: #af1763;
    outline: none;
  }
`;

const ErrorMsg = styled.div`
  color: #ab2e3c;
  margin-bottom: 12px;
  font-size: 0.98rem;
`;

const SignUpLink = styled.div`
  color: #b3b8c5;
  text-align: center;
  margin-top: 18px;
  font-size: 1rem;
  a {
    color: #af1763;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TestimonialCard = styled.div`
  background: linear-gradient(120deg, #232837 80%, #23283700 100%);
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  padding: 48px 40px 40px 40px;
  max-width: 480px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TestimonialTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 6px;
`;

const TestimonialSubtitle = styled.p`
  color: #b3b8c5;
  font-size: 1.05rem;
  margin-bottom: 32px;
`;

const ClientRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ClientAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  margin-right: 12px;
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClientName = styled.div`
  font-weight: 600;
  font-size: 1.08rem;
`;

const ClientRole = styled.div`
  color: #b3b8c5;
  font-size: 0.98rem;
`;

const Quote = styled.div`
  color: #b3b8c5;
  font-size: 1.08rem;
  margin: 18px 0 0 0;
  border-left: 3px solid #af1763;
  padding-left: 16px;
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 32px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ active }) =>
    active ? "linear-gradient(90deg, #af1763 0%, #5f4bfa 100%)" : "#232837"};
`;

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Left>
        <FormCard>
          <Title>Log in to your account</Title>
          <SubTitle>
            Enter your email and password to access your dashboard
          </SubTitle>
          <SocialRow>
            <SocialButton onClick={handleGoogleLogin} disabled={loading}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                alt="Google"
                width="22"
                height="22"
                style={{ borderRadius: "4px" }}
              />
            </SocialButton>
            <SocialButton disabled>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                alt="LinkedIn"
                width="22"
                height="22"
              />
            </SocialButton>
            <SocialButton disabled>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                width="22"
                height="22"
              />
            </SocialButton>
          </SocialRow>
          <Divider>OR LOG IN WITH</Divider>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <form onSubmit={handleSubmit} autoComplete="off">
            <Input
              name="email"
              placeholder="Your email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="off"
            />
            <GradientButton type="submit" disabled={loading}>
              Log In
            </GradientButton>
          </form>
          <SignUpLink>
            Don't have an account? <Link to="/">Sign up</Link>
          </SignUpLink>
        </FormCard>
      </Left>
      <Right>
        <TestimonialCard>
          <TestimonialTitle>What Our Clients Say</TestimonialTitle>
          <TestimonialSubtitle>
            Trusted by companies worldwide
          </TestimonialSubtitle>
          <ClientRow>
            <ClientAvatar>MV</ClientAvatar>
            <ClientInfo>
              <ClientName>Mahad Wasiqur</ClientName>
              <ClientRole>IAM Developer</ClientRole>
            </ClientInfo>
          </ClientRow>
          <Quote>
            Honestly thought @KlarusHR would be gimmicky AI hype, but it's kind
            of a game changer for our small HR team. Still figuring out all the
            features, but initial results are strong.
          </Quote>
          <Dots>
            {[...Array(8)].map((_, i) => (
              <Dot key={i} active={i === 2} />
            ))}
          </Dots>
        </TestimonialCard>
      </Right>
    </PageContainer>
  );
}

export default Login;
