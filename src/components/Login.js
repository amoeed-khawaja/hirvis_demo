import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: #000000;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1000;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  padding: 0 5vw;
  position: relative;
  overflow: hidden;
`;

const GlitterCircles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    animation: fadeInOut 3s ease-in-out infinite;
  }

  &::before {
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    top: 20%;
    left: 15%;
    animation-delay: 0s;
  }

  &::after {
    width: 12px;
    height: 12px;
    background: linear-gradient(135deg, #5f4bfa 0%, #af1763 100%);
    top: 60%;
    right: 20%;
    animation-delay: 1.5s;
  }

  .circle-1 {
    position: absolute;
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    top: 30%;
    right: 30%;
    animation: fadeInOut 4s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  .circle-2 {
    position: absolute;
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #5f4bfa 0%, #af1763 100%);
    border-radius: 50%;
    top: 70%;
    left: 25%;
    animation: fadeInOut 3.5s ease-in-out infinite;
    animation-delay: 1s;
  }

  .circle-3 {
    position: absolute;
    width: 7px;
    height: 7px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    top: 15%;
    right: 10%;
    animation: fadeInOut 4.5s ease-in-out infinite;
    animation-delay: 2s;
  }

  .circle-4 {
    position: absolute;
    width: 9px;
    height: 9px;
    background: linear-gradient(135deg, #5f4bfa 0%, #af1763 100%);
    border-radius: 50%;
    top: 80%;
    right: 40%;
    animation: fadeInOut 3s ease-in-out infinite;
    animation-delay: 0.8s;
  }

  .circle-5 {
    position: absolute;
    width: 5px;
    height: 5px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    top: 45%;
    left: 10%;
    animation: fadeInOut 4.2s ease-in-out infinite;
    animation-delay: 1.2s;
  }

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  position: relative;
  overflow: hidden;
`;

const GradientCircles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 10%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    opacity: 0.2;
    filter: blur(40px);
    animation: float 8s ease-in-out infinite;
    box-shadow: 0 0 80px rgba(175, 23, 99, 0.3);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 15%;
    left: 15%;
    width: 350px;
    height: 350px;
    background: linear-gradient(135deg, #5f4bfa 0%, #af1763 100%);
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(50px);
    animation: float 12s ease-in-out infinite reverse;
    box-shadow: 0 0 100px rgba(95, 75, 250, 0.3);
  }

  .circle-1 {
    position: absolute;
    top: 25%;
    left: 25%;
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    opacity: 0.12;
    filter: blur(30px);
    animation: float 10s ease-in-out infinite;
    box-shadow: 0 0 60px rgba(175, 23, 99, 0.2);
  }

  .circle-2 {
    position: absolute;
    top: 60%;
    right: 25%;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, #5f4bfa 0%, #af1763 100%);
    border-radius: 50%;
    opacity: 0.1;
    filter: blur(25px);
    animation: float 15s ease-in-out infinite reverse;
    box-shadow: 0 0 50px rgba(95, 75, 250, 0.2);
  }

  .circle-3 {
    position: absolute;
    bottom: 30%;
    right: 35%;
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    opacity: 0.08;
    filter: blur(35px);
    animation: float 18s ease-in-out infinite;
    box-shadow: 0 0 70px rgba(175, 23, 99, 0.15);
  }

  .circle-4 {
    position: absolute;
    top: 40%;
    left: 60%;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #5f4bfa 0%, #af1763 50%, #5f4bfa 100%);
    border-radius: 50%;
    opacity: 0.06;
    filter: blur(20px);
    animation: float 20s ease-in-out infinite reverse;
    box-shadow: 0 0 40px rgba(95, 75, 250, 0.15);
  }

  .circle-5 {
    position: absolute;
    bottom: 50%;
    right: 10%;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
    border-radius: 50%;
    opacity: 0.05;
    filter: blur(18px);
    animation: float 25s ease-in-out infinite;
    box-shadow: 0 0 35px rgba(175, 23, 99, 0.1);
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg) scale(1);
    }
    25% {
      transform: translateY(-20px) rotate(90deg) scale(1.03);
    }
    50% {
      transform: translateY(10px) rotate(180deg) scale(0.97);
    }
    75% {
      transform: translateY(-15px) rotate(270deg) scale(1.01);
    }
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;

const SubTitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.08rem;
  margin-bottom: 32px;
  text-align: center;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SocialButton = styled.button`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin: 24px 0;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;

  &:focus {
    border-color: #af1763;
    outline: none;
    box-shadow: 0 0 0 3px rgba(175, 23, 99, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
  width: 100%;
`;

const PasswordInput = styled(Input)`
  margin-bottom: 0;
  padding-right: 50px;
  width: 100%;
  box-sizing: border-box;
`;

const EyeIcon = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #af1763;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #af1763 0%, #5f4bfa 100%);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(175, 23, 99, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(175, 23, 99, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ForgotPassword = styled.div`
  text-align: center;
  margin-top: 16px;

  a {
    color: #af1763;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  margin-bottom: 16px;
  font-size: 0.95rem;
  text-align: center;
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const SignUpLink = styled.div`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-top: 24px;
  font-size: 0.95rem;

  a {
    color: #af1763;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TestimonialContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  z-index: 2;
`;

const TestimonialCard = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  color: #ffffff;
  backdrop-filter: blur(10px);
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.8s ease-in-out;

  &.active {
    transform: translateX(0);
    opacity: 1;
  }

  &.prev {
    transform: translateX(-100%);
    opacity: 0;
  }

  &.next {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 16px;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #af1763 0%, #5f4bfa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
`;

const AuthorInfo = styled.div`
  .name {
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 2px;
  }
  .title {
    font-size: 0.85rem;
    opacity: 0.8;
  }
`;

const WelcomeSection = styled.div`
  color: #ffffff;
  text-align: center;
  max-width: 400px;
  z-index: 2;
  position: relative;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: #b3b8c5;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const SkipButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 24px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const DashedLine = styled.div`
  width: 100px;
  height: 2px;
  border-top: 2px dashed rgba(255, 255, 255, 0.3);
  margin: 24px auto;
`;

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "Hirvis transformed our recruitment process completely. We're now hiring 3x faster with better quality candidates.",
      name: "Sarah Johnson",
      title: "HR Director",
      avatar: "👩‍💼",
    },
    {
      text: "The AI-powered screening saves us hours every week. Our team can focus on what matters most - building relationships.",
      name: "Michael Chen",
      title: "Talent Manager",
      avatar: "👨‍💼",
    },
    {
      text: "Finally, a recruitment tool that actually understands what we need. The automation features are game-changing.",
      name: "Emily Rodriguez",
      title: "Recruitment Lead",
      avatar: "👩‍💼",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

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
          redirectTo: `${window.location.origin}/app`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/app`,
          scopes: "openid profile email w_member_social",
        },
      });
      if (data && data.session) {
        const accessToken =
          data.session.provider_token || data.session.provider_access_token;
        console.log("LinkedIn access token:", accessToken);
        if (accessToken && accessToken.split(".").length === 3) {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          console.log("Decoded LinkedIn token payload:", payload);
        }
      }
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
        navigate("/app");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate("/")}>← Back</BackButton>

      <Left>
        <GlitterCircles>
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
          <div className="circle-4"></div>
          <div className="circle-5"></div>
        </GlitterCircles>

        <TestimonialContainer>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              className={
                index === currentTestimonial
                  ? "active"
                  : index ===
                    (currentTestimonial - 1 + testimonials.length) %
                      testimonials.length
                  ? "prev"
                  : "next"
              }
            >
              <TestimonialText>"{testimonial.text}"</TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.avatar}</AuthorAvatar>
                <AuthorInfo>
                  <div className="name">{testimonial.name}</div>
                  <div className="title">{testimonial.title}</div>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialContainer>
      </Left>

      <Right>
        <GradientCircles>
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
          <div className="circle-4"></div>
          <div className="circle-5"></div>
        </GradientCircles>
        <FormCard>
          <Title>Login</Title>
          <SubTitle>Glad you're back!</SubTitle>

          <SocialRow>
            <SocialButton onClick={handleGoogleLogin} disabled={loading}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                alt="Google"
                width="20"
                height="20"
                style={{ borderRadius: "4px" }}
              />
            </SocialButton>
            <SocialButton onClick={handleLinkedInLogin} disabled={loading}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                alt="LinkedIn"
                width="20"
                height="20"
              />
            </SocialButton>
            <SocialButton disabled>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                width="20"
                height="20"
              />
            </SocialButton>
          </SocialRow>

          <Divider>Or</Divider>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <Input
              name="email"
              placeholder="Username"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />

            <PasswordContainer>
              <PasswordInput
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="off"
              />
              <EyeIcon
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </EyeIcon>
            </PasswordContainer>

            <RememberMe>
              <Checkbox type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </RememberMe>

            <LoginButton type="submit" disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </LoginButton>
          </form>

          <ForgotPassword>
            <a href="#">Forgot password ?</a>
          </ForgotPassword>

          <SignUpLink>
            Don't have an account? <Link to="/signup">Signup</Link>
          </SignUpLink>
        </FormCard>
      </Right>
    </PageContainer>
  );
}

export default Login;
