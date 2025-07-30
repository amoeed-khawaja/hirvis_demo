import { supabase } from "../supabase";

// Check if user has completed onboarding
export const checkOnboardingStatus = async () => {
  try {
    console.log("Checking onboarding status...");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("No user found, redirecting to login");
      return { completed: false, redirectTo: "/login" };
    }

    console.log("User found:", user.id);

    // Check if user has completed onboarding by looking for required fields
    const { data: userData, error: dataError } = await supabase
      .from("users_data")
      .select("display_name, organization, recruiter_name, assistant_name")
      .eq("id", user.id)
      .single();

    if (dataError) {
      console.error("Error checking onboarding status:", dataError);
      // If table doesn't exist or user record doesn't exist, consider onboarding not completed
      return { completed: false, redirectTo: "/onboarding" };
    }

    console.log("User data found:", userData);

    // Check if user has completed onboarding
    const hasCompletedOnboarding =
      userData &&
      userData.display_name &&
      userData.organization &&
      userData.recruiter_name &&
      userData.assistant_name;

    console.log("Onboarding completed:", hasCompletedOnboarding);

    return {
      completed: hasCompletedOnboarding,
      redirectTo: hasCompletedOnboarding ? "/dashboard" : "/onboarding",
    };
  } catch (error) {
    console.error("Error in checkOnboardingStatus:", error);
    return { completed: false, redirectTo: "/onboarding" };
  }
};

// Redirect user based on onboarding status
export const redirectBasedOnOnboarding = async (navigate) => {
  const { redirectTo } = await checkOnboardingStatus();
  navigate(redirectTo);
};
