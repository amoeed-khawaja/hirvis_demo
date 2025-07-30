import { supabase } from "../supabase";

// Test function to check if we can access auth.users
export const testAuthAccess = async () => {
  try {
    console.log("🔍 Testing auth.users access...");

    // Try to access auth.users directly (this might not work from client)
    const { data: authUsers, error: authError } = await supabase
      .from("auth.users")
      .select("id, email")
      .limit(5);

    if (authError) {
      console.log("❌ Cannot access auth.users directly:", authError.message);
      return { success: false, error: authError.message };
    }

    console.log("✅ Successfully accessed auth.users:", authUsers);
    return { success: true, data: authUsers };
  } catch (error) {
    console.error("❌ Error testing auth access:", error);
    return { success: false, error: error.message };
  }
};

// Test function to check user_data table
export const testUserDataTable = async () => {
  try {
    console.log("🔍 Testing user_data table access...");

    const { data: userData, error: userDataError } = await supabase
      .from("user_data")
      .select("*")
      .limit(5);

    if (userDataError) {
      console.log("❌ Error accessing user_data:", userDataError.message);
      return { success: false, error: userDataError.message };
    }

    console.log("✅ Successfully accessed user_data:", userData);
    return { success: true, data: userData };
  } catch (error) {
    console.error("❌ Error testing user_data:", error);
    return { success: false, error: error.message };
  }
};

// Test function to get current user and create user_data entry
export const testCurrentUserMigration = async () => {
  try {
    console.log("🔍 Testing current user migration...");

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("❌ No authenticated user found:", userError?.message);
      return { success: false, error: "No authenticated user" };
    }

    console.log("✅ Current user found:", user);

    // Check if user already exists in user_data
    const { data: existingUser, error: existingError } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      console.log("❌ Error checking existing user:", existingError.message);
      return { success: false, error: existingError.message };
    }

    if (existingUser) {
      console.log("✅ User already exists in user_data:", existingUser);
      return {
        success: true,
        data: existingUser,
        message: "User already exists",
      };
    }

    // Create new user_data entry
    const newUserData = {
      user_id: user.id,
      display_name:
        user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      email: user.email,
      phone: user.user_metadata?.phone || null,
      paid: 0,
      paid_date: null,
      assistant: null,
    };

    console.log("🔄 Creating new user_data entry:", newUserData);

    const { data: createdUser, error: createError } = await supabase
      .from("user_data")
      .insert([newUserData])
      .select()
      .single();

    if (createError) {
      console.log("❌ Error creating user_data:", createError.message);
      return { success: false, error: createError.message };
    }

    console.log("✅ Successfully created user_data entry:", createdUser);
    return {
      success: true,
      data: createdUser,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("❌ Error in testCurrentUserMigration:", error);
    return { success: false, error: error.message };
  }
};

// Function to provide manual migration instructions
export const getManualMigrationInstructions = () => {
  const instructions = `
🔧 MANUAL MIGRATION INSTRUCTIONS

Since direct access to auth.users from the client might be restricted, here are alternative approaches:

1. SQL APPROACH (Recommended):
   Go to your Supabase SQL Editor and run:

   INSERT INTO user_data (user_id, display_name, email, phone, paid, paid_date, assistant)
   SELECT 
     au.id as user_id,
     COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email) as display_name,
     au.email,
     au.raw_user_meta_data->>'phone' as phone,
     0 as paid,
     NULL as paid_date,
     NULL as assistant
   FROM auth.users au
   WHERE NOT EXISTS (
     SELECT 1 FROM user_data ud WHERE ud.user_id = au.id
   );

2. MANUAL ENTRY APPROACH:
   - Sign up a new user through your app
   - Check if they appear in user_data
   - If not, the trigger might not be working

3. TRIGGER TEST:
   Run this SQL to check if the trigger exists:
   
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';

4. TABLE STRUCTURE CHECK:
   Run this SQL to check your table structure:
   
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'user_data';

5. TEST TRIGGER MANUALLY:
   Run this SQL to test the trigger function:
   
   SELECT handle_new_user();

Please try these approaches and let me know the results!
  `;

  console.log(instructions);
  return instructions;
};

// Function to run all tests
export const runAllTests = async () => {
  console.log("🧪 Running all migration tests...");

  const results = {
    authAccess: await testAuthAccess(),
    userDataTable: await testUserDataTable(),
    currentUserMigration: await testCurrentUserMigration(),
  };

  console.log("📊 Test Results:", results);

  // Provide recommendations based on results
  if (!results.authAccess.success) {
    console.log("💡 Recommendation: Use SQL approach for migration");
    getManualMigrationInstructions();
  }

  if (!results.userDataTable.success) {
    console.log("💡 Recommendation: Check table structure and permissions");
  }

  if (results.currentUserMigration.success) {
    console.log("✅ Current user migration works!");
  }

  return results;
};
