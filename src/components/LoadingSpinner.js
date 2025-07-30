import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ring = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${(props) => (props.fullScreen ? "100vh" : "200px")};
  background-color: ${(props) =>
    props.fullScreen ? "#191c24" : "transparent"};
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const Ring = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #af1763;
  border-radius: 50%;
  animation: ${ring} 1.5s linear infinite;
`;

const InnerRing = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-top: 2px solid #0d6efd;
  border-radius: 50%;
  animation: ${ring} 1s linear infinite reverse;
`;

const PhoneIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #af1763, #0d6efd);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${bounce} 2s ease-in-out infinite;

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 2px;
    position: relative;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #af1763, #0d6efd);
    border-radius: 50%;
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const LoadingText = styled.div`
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 16px;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #af1763;
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const LoadingSpinner = ({
  text = "Loading...",
  fullScreen = false,
  size = "medium",
}) => {
  const containerStyle = {
    minHeight: fullScreen ? "100vh" : size === "small" ? "100px" : "200px",
    padding: fullScreen ? "0" : "20px",
  };

  const spinnerSize = size === "small" ? "40px" : "80px";
  const iconSize = size === "small" ? "16px" : "24px";

  return (
    <LoadingContainer fullScreen={fullScreen} style={containerStyle}>
      <SpinnerContainer style={{ width: spinnerSize, height: spinnerSize }}>
        <Ring style={{ borderWidth: size === "small" ? "2px" : "3px" }} />
        <InnerRing
          style={{
            top: size === "small" ? "5px" : "10px",
            left: size === "small" ? "5px" : "10px",
            width: size === "small" ? "30px" : "60px",
            height: size === "small" ? "30px" : "60px",
            borderWidth: size === "small" ? "1px" : "2px",
          }}
        />
        <PhoneIcon
          style={{
            width: iconSize,
            height: iconSize,
            "&::before": {
              width: size === "small" ? "8px" : "12px",
              height: size === "small" ? "8px" : "12px",
            },
          }}
        />
      </SpinnerContainer>

      <LoadingText style={{ fontSize: size === "small" ? "0.875rem" : "1rem" }}>
        {text}
      </LoadingText>

      <LoadingDots>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </LoadingDots>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
