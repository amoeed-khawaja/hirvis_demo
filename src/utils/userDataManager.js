import { supabase } from "../supabase";

// Function to set up the users_data table and triggers
export const setupUserDataTable = async () => {
  try {
    console.log("🔧 Setting up users_data table and triggers...");

    // Read the SQL file content
    const response = await fetch("/src/utils/userDataSetup.sql");
    const sqlContent = await response.text();

    // Execute the SQL commands
    const { error } = await supabase.rpc("exec_sql", { sql: sqlContent });

    if (error) {
      console.error("❌ Error setting up users_data table:", error);
      return false;
    }

    console.log("✅ users_data table and triggers set up successfully");
    return true;
  } catch (error) {
    console.error("❌ Error in setupUserDataTable:", error);
    return false;
  }
};

// Function to get current user's data
export const getCurrentUserData = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No authenticated user found");
      return null;
    }

    const { data, error } = await supabase
      .from("users_data")
      .select("*")
      .eq("login_user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCurrentUserData:", error);
    return null;
  }
};

// Function to update user data
export const updateUserData = async (updates) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data, error } = await supabase
      .from("users_data")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("login_user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user data:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateUserData:", error);
    throw error;
  }
};

// Function to create user data manually (fallback)
export const createUserData = async (userData) => {
  try {
    console.log("Attempting to insert user data:", userData);

    const { data, error } = await supabase
      .from("users_data")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error("Error creating user data:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log("User data created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createUserData:", error);
    throw error;
  }
};

// Function to get all users (admin only)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users_data")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

// Function to check if user data exists
export const checkUserDataExists = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users_data")
      .select("id")
      .eq("login_user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking user data:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkUserDataExists:", error);
    return false;
  }
};

// Function to handle user signup completion
export const handleUserSignup = async (user) => {
  try {
    console.log("🔄 Handling user signup for:", user.email);
    console.log("User object:", user);

    // Check if user data already exists
    const exists = await checkUserDataExists(user.id);
    console.log("User data exists:", exists);

    if (!exists) {
      // Create user data manually if trigger didn't work
      const userData = {
        email: user.email,
        display_name: user.user_metadata?.full_name || user.email,
        login_user_id: user.id,
        paid: 0,
        paid_date: null,
        assistant: null,
        assistant_api: null,
      };

      console.log("Creating user data:", userData);
      const result = await createUserData(userData);
      console.log("✅ User data created manually:", result);
    } else {
      console.log("✅ User data already exists");
    }
  } catch (error) {
    console.error("❌ Error in handleUserSignup:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error; // Re-throw to handle in the calling component
  }
};
