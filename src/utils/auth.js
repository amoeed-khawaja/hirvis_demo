import { supabase } from "../supabase";

// Get current logged-in user ID
export const getCurrentUserId = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    if (!user) {
      console.log("No user logged in");
      return null;
    }

    console.log("Successfully got user ID:", user.id);
    return user.id;
  } catch (error) {
    console.error("Error in getCurrentUserId:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const userId = await getCurrentUserId();
  return userId !== null;
};

// Get current user object
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};
