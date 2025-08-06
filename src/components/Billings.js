import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import stripePromise from "../stripe";
import { supabase } from "../supabase";
import {
  checkSubscriptionStatus,
  updateSubscriptionStatus,
} from "../utils/subscriptionCheck";

const BillingsContainer = styled.div`
  padding: 32px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 20px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1.1rem;
  margin: 0;
`;

const PlansContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
`;

const PlanCard = styled.div`
  background: linear-gradient(135deg, #232837 0%, #1a1d2a 100%);
  border: 2px solid ${(props) => (props.featured ? "transparent" : "#374151")};
  background: ${(props) =>
    props.featured
      ? "linear-gradient(135deg, #232837 0%, #1a1d2a 100%) padding-box, linear-gradient(135deg, #af1763, #5f4bfa) border-box"
      : "linear-gradient(135deg, #232837 0%, #1a1d2a 100%)"};
  border-radius: 16px;
  padding: 60px;
  position: relative;
  transition: all 0.3s ease;
  width: 500px;
  max-width: 90vw;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => (props.featured ? "transparent" : "#4b5563")};
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: white;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PlanTitle = styled.h2`
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;

const PlanPrice = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const PriceAmount = styled.div`
  color: #5f4bfa;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
`;

const PricePeriod = styled.div`
  color: #9ca3af;
  font-size: 1rem;
  margin-top: 4px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  color: #d1d5db;
  font-size: 1rem;
  padding: 12px 0;
  border-bottom: 1px solid #374151;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:before {
    content: "✓";
    color: #10b981;
    font-weight: bold;
    margin-right: 12px;
    font-size: 1.1rem;
  }
`;

const SubscribeButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: ${(props) =>
    props.featured
      ? "linear-gradient(135deg, #af1763, #5f4bfa)"
      : "linear-gradient(135deg, #af1763, #5f4bfa)"};
  color: white;
  border: 2px solid ${(props) => (props.featured ? "#5f4bfa" : "#5f4bfa")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px
      ${(props) =>
        props.featured
          ? "linear-gradient(135deg, #af1763, #5f4bfa)"
          : "linear-gradient(135deg, #af1763, #5f4bfa)"};
  }
`;

const PaymentPlanSection = styled.div`
  background: linear-gradient(135deg, #1a1d2a 0%, #232837 100%);
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const PaymentPlanTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

const PaymentPlanText = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  text-align: center;
  margin: 0;
`;

const MessageContainer = styled.div`
  background: ${(props) =>
    props.type === "success"
      ? "linear-gradient(135deg, #10b981, #059669)"
      : "linear-gradient(135deg, #ef4444, #dc2626)"};
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CreditSection = styled.div`
  background: linear-gradient(135deg, #1a1d2a 0%, #232837 100%);
  border: 1px solid #374151;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
`;

const CreditTitle = styled.h2`
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`;

const CreditDescription = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 32px;
`;

const CreditInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
`;

const CreditInput = styled.input`
  background: #374151;
  border: 2px solid #4b5563;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 1rem;
  width: 100%;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #af1763;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const AddCreditsButton = styled.button`
  background: linear-gradient(135deg, #af1763, #5f4bfa);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #8a1250, #4a3fd8);
  }
`;

const Billings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [credits, setCredits] = useState("");
  const [addingCredits, setAddingCredits] = useState(false);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      // Check for success or cancel messages from Stripe redirect
      const success = searchParams.get("success");
      const canceled = searchParams.get("canceled");
      const session_id = searchParams.get("session_id");
      const payment_intent = searchParams.get("payment_intent");

      console.log("URL Parameters:", {
        success,
        canceled,
        session_id,
        payment_intent,
      });

      if (success || session_id || payment_intent) {
        setMessage("Payment successful! Activating your subscription...");
        // Activate subscription in database
        await activateSubscription();
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/app");
        }, 3000);
      } else if (canceled) {
        setMessage("Payment was canceled. Please try again.");
      }
    };

    handlePaymentSuccess();
    // Check current subscription status on component mount
    checkUserSubscription();
  }, [searchParams, navigate]);

  const checkUserSubscription = async () => {
    setCheckingStatus(true);
    try {
      const status = await checkSubscriptionStatus();
      setSubscriptionStatus(status);

      if (status.subscribed) {
        setMessage("You have an active subscription! 🎉");
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setMessage("Error checking subscription status. Please try again.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const activateSubscription = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("No authenticated user found");
      }

      const response = await fetch("/api/activate-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to activate subscription");
      }

      console.log("Subscription activated successfully");
      // Refresh subscription status
      await checkUserSubscription();
    } catch (error) {
      console.error("Error activating subscription:", error);
      setMessage(`Failed to activate subscription: ${error.message}`);
    }
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);
    setMessage("");

    try {
      // Redirect directly to Stripe payment link
      window.location.href =
        "https://buy.stripe.com/test_fZudRa7DO460eyo1JOf7i00";
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleAddCredits = async () => {
    if (!credits || isNaN(credits) || parseInt(credits) <= 0) {
      setMessage("Please enter a valid number of credits.");
      return;
    }

    setAddingCredits(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("No authenticated user found");
      }

      const response = await fetch("/api/add-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          credits: parseInt(credits),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add credits");
      }

      setMessage(
        `Successfully added ${credits} credits to your account! Total credits: ${data.totalCredits}`
      );
      setCredits("");
    } catch (error) {
      console.error("Error adding credits:", error);
      setMessage(`Failed to add credits: ${error.message}`);
    } finally {
      setAddingCredits(false);
    }
  };

  return (
    <BillingsContainer>
      <Header>
        <Title>Choose Your Plan</Title>
        <Subtitle>
          Select the perfect subscription package for your recruitment needs
        </Subtitle>
      </Header>

      {message && (
        <MessageContainer
          type={message.includes("successful") ? "success" : "error"}
        >
          {message}
        </MessageContainer>
      )}

      {subscriptionStatus && subscriptionStatus.subscribed ? (
        <>
          <MessageContainer type="success">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>Active Subscription</strong>
                <div style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                  Subscribed since:{" "}
                  {subscriptionStatus.paidDate
                    ? new Date(subscriptionStatus.paidDate).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
              <button
                onClick={checkUserSubscription}
                disabled={checkingStatus}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {checkingStatus ? "Checking..." : "Refresh Status"}
              </button>
            </div>
          </MessageContainer>

          <CreditSection>
            <CreditTitle>Add Credits for HR Representative</CreditTitle>
            <CreditDescription>
              Add credits to your HR representative's account to enable
              additional features and services.
            </CreditDescription>
            <CreditInputContainer>
              <CreditInput
                type="number"
                placeholder="Enter number of credits"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                min="1"
                disabled={addingCredits}
              />
              <AddCreditsButton
                onClick={handleAddCredits}
                disabled={addingCredits || !credits}
              >
                {addingCredits ? "Adding Credits..." : "Add Credits"}
              </AddCreditsButton>
            </CreditInputContainer>
          </CreditSection>

          {/* Manual activation button for testing */}
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              onClick={activateSubscription}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Manual Activate Subscription (Test)
            </button>
          </div>
        </>
      ) : (
        <>
          <PaymentPlanSection>
            <PaymentPlanTitle>Payment Plan</PaymentPlanTitle>
            <PaymentPlanText>
              All plans are billed monthly with no long-term commitment
            </PaymentPlanText>
          </PaymentPlanSection>

          <PlansContainer>
            <PlanCard featured>
              <PlanTitle>Monthly Pro</PlanTitle>
              <PlanPrice>
                <PriceAmount>$100</PriceAmount>
                <PricePeriod>per month</PricePeriod>
              </PlanPrice>
              <FeaturesList>
                <FeatureItem>16 posts per month</FeatureItem>
                <FeatureItem>Unlimited CV evaluations</FeatureItem>
                <FeatureItem>8 job posts</FeatureItem>
                <FeatureItem>20 AI screening interviews</FeatureItem>
              </FeaturesList>
              <SubscribeButton
                featured
                onClick={() => handleSubscribe("Monthly Pro")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Subscribe to Pro Plan"}
              </SubscribeButton>
            </PlanCard>
          </PlansContainer>
        </>
      )}
    </BillingsContainer>
  );
};

export default Billings;
