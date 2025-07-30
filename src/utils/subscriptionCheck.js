import { supabase } from "../supabase";

// Check if user has an active subscription
export const checkSubscriptionStatus = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("No authenticated user found");
      return { subscribed: false, error: "No authenticated user" };
    }

    // Check subscription status from database
    const { data: userData, error: dataError } = await supabase
      .from("users_data")
      .select("paid, paid_date")
      .eq("id", user.id)
      .single();

    if (dataError) {
      console.error("Error checking subscription status:", dataError);
      return { subscribed: false, error: dataError.message };
    }

    const isSubscribed = userData && userData.paid === 1;

    return {
      subscribed: isSubscribed,
      paidDate: userData?.paid_date,
      subscriptionStatus: isSubscribed ? "active" : "inactive",
    };
  } catch (error) {
    console.error("Error in checkSubscriptionStatus:", error);
    return { subscribed: false, error: error.message };
  }
};

// Update subscription status
export const updateSubscriptionStatus = async (
  subscribed,
  subscriptionId = null
) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("No authenticated user found");
    }

    const { error } = await supabase
      .from("users_data")
      .update({
        paid: subscribed ? 1 : 0,
        paid_date: subscribed ? new Date().toISOString() : null,
      })
      .eq("id", user.id);

    if (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    return {
      success: true,
      message: subscribed
        ? "Subscription activated"
        : "Subscription deactivated",
    };
  } catch (error) {
    console.error("Error in updateSubscriptionStatus:", error);
    throw error;
  }
};

// Check subscription status from server API
export const checkSubscriptionFromServer = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("No authenticated user found");
    }

    const response = await fetch(`/api/check-subscription/${user.id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking subscription from server:", error);
    throw error;
  }
};
