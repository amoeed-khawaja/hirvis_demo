import { supabase } from "../supabase";

// SQL migration script to import users from auth.users to user_data
const MIGRATION_SQL = `
-- Migration script to import existing users from auth.users to user_data
-- This script handles duplicates and maps columns correctly

-- First, let's see what users exist in auth.users
-- SELECT id, email, raw_user_meta_data, created_at, last_sign_in_at FROM auth.users;

-- Insert users from auth.users to user_data, avoiding duplicates
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
)
ON CONFLICT (user_id) DO NOTHING;

-- Show the results
SELECT 
  'Migration completed' as status,
  COUNT(*) as users_migrated
FROM user_data;
`;

// Function to run the migration
export const migrateUsersFromAuth = async () => {
  try {
    console.log("🔄 Starting user migration from auth.users to user_data...");

    // First, let's check how many users exist in auth.users
    const { data: authUsers, error: authError } = await supabase
      .from("auth.users")
      .select("id, email, raw_user_meta_data, created_at, last_sign_in_at")
      .limit(1000); // Limit to avoid overwhelming results

    if (authError) {
      console.error("❌ Error accessing auth.users:", authError);
      return { success: false, error: authError.message };
    }

    console.log(`📊 Found ${authUsers.length} users in auth.users`);

    // Check how many users already exist in user_data
    const { data: existingUsers, error: existingError } = await supabase
      .from("user_data")
      .select("user_id")
      .limit(1000);

    if (existingError) {
      console.error("❌ Error accessing user_data:", existingError);
      return { success: false, error: existingError.message };
    }

    console.log(`📊 Found ${existingUsers.length} users already in user_data`);

    // Get existing user IDs to avoid duplicates
    const existingUserIds = new Set(existingUsers.map((u) => u.user_id));

    // Filter out users that already exist in user_data
    const usersToMigrate = authUsers.filter(
      (user) => !existingUserIds.has(user.id)
    );

    console.log(`🔄 Migrating ${usersToMigrate.length} new users...`);

    if (usersToMigrate.length === 0) {
      console.log("✅ No new users to migrate");
      return { success: true, migrated: 0, message: "No new users to migrate" };
    }

    // Prepare the data for insertion
    const userDataToInsert = usersToMigrate.map((user) => ({
      user_id: user.id,
      display_name:
        user.raw_user_meta_data?.full_name ||
        user.raw_user_meta_data?.name ||
        user.email,
      email: user.email,
      phone: user.raw_user_meta_data?.phone || null,
      paid: 0,
      paid_date: null,
      assistant: null,
    }));

    // Insert the users
    const { data: insertedUsers, error: insertError } = await supabase
      .from("user_data")
      .insert(userDataToInsert)
      .select();

    if (insertError) {
      console.error("❌ Error inserting users:", insertError);
      return { success: false, error: insertError.message };
    }

    console.log(`✅ Successfully migrated ${insertedUsers.length} users`);

    return {
      success: true,
      migrated: insertedUsers.length,
      totalAuthUsers: authUsers.length,
      totalUserDataUsers: existingUsers.length + insertedUsers.length,
      message: `Successfully migrated ${insertedUsers.length} users`,
    };
  } catch (error) {
    console.error("❌ Error in migrateUsersFromAuth:", error);
    return { success: false, error: error.message };
  }
};

// Function to show migration status
export const showMigrationStatus = async () => {
  try {
    console.log("📊 Checking migration status...");

    // Count users in auth.users
    const { count: authCount, error: authError } = await supabase
      .from("auth.users")
      .select("*", { count: "exact", head: true });

    if (authError) {
      console.error("❌ Error counting auth.users:", authError);
      return null;
    }

    // Count users in user_data
    const { count: userDataCount, error: userDataError } = await supabase
      .from("user_data")
      .select("*", { count: "exact", head: true });

    if (userDataError) {
      console.error("❌ Error counting user_data:", userDataError);
      return null;
    }

    const status = {
      authUsers: authCount,
      userDataUsers: userDataCount,
      difference: authCount - userDataCount,
      migrationNeeded: authCount > userDataCount,
    };

    console.log("📊 Migration Status:", status);
    return status;
  } catch (error) {
    console.error("❌ Error in showMigrationStatus:", error);
    return null;
  }
};

// Function to preview what will be migrated
export const previewMigration = async () => {
  try {
    console.log("👀 Previewing migration...");

    // Get users from auth.users
    const { data: authUsers, error: authError } = await supabase
      .from("auth.users")
      .select("id, email, raw_user_meta_data, created_at, last_sign_in_at")
      .limit(10);

    if (authError) {
      console.error("❌ Error accessing auth.users:", authError);
      return null;
    }

    // Get existing user IDs
    const { data: existingUsers, error: existingError } = await supabase
      .from("user_data")
      .select("user_id");

    if (existingError) {
      console.error("❌ Error accessing user_data:", existingError);
      return null;
    }

    const existingUserIds = new Set(existingUsers.map((u) => u.user_id));

    // Preview the data that would be migrated
    const previewData = authUsers
      .filter((user) => !existingUserIds.has(user.id))
      .map((user) => ({
        user_id: user.id,
        display_name:
          user.raw_user_meta_data?.full_name ||
          user.raw_user_meta_data?.name ||
          user.email,
        email: user.email,
        phone: user.raw_user_meta_data?.phone || null,
        paid: 0,
        paid_date: null,
        assistant: null,
      }));

    console.log("👀 Migration Preview:", previewData);
    return previewData;
  } catch (error) {
    console.error("❌ Error in previewMigration:", error);
    return null;
  }
};

// Function to clean up duplicate entries (if any)
export const cleanupDuplicates = async () => {
  try {
    console.log("🧹 Cleaning up duplicate entries...");

    // Find duplicates
    const { data: duplicates, error: duplicateError } = await supabase.rpc(
      "find_duplicate_users"
    );

    if (duplicateError) {
      console.log(
        "No duplicate detection function found, checking manually..."
      );

      // Manual duplicate check
      const { data: allUsers, error: allError } = await supabase
        .from("user_data")
        .select("user_id, email, created_at")
        .order("created_at", { ascending: false });

      if (allError) {
        console.error("❌ Error checking for duplicates:", allError);
        return { success: false, error: allError.message };
      }

      // Group by user_id and find duplicates
      const userGroups = {};
      allUsers.forEach((user) => {
        if (!userGroups[user.user_id]) {
          userGroups[user.user_id] = [];
        }
        userGroups[user.user_id].push(user);
      });

      const duplicates = Object.values(userGroups)
        .filter((group) => group.length > 1)
        .map((group) => group.slice(1)); // Keep the first, mark the rest as duplicates

      console.log(`Found ${duplicates.flat().length} duplicate entries`);

      if (duplicates.flat().length > 0) {
        // Delete duplicates
        const duplicateIds = duplicates.flat().map((u) => u.id);
        const { error: deleteError } = await supabase
          .from("user_data")
          .delete()
          .in("id", duplicateIds);

        if (deleteError) {
          console.error("❌ Error deleting duplicates:", deleteError);
          return { success: false, error: deleteError.message };
        }

        console.log(`✅ Deleted ${duplicateIds.length} duplicate entries`);
        return { success: true, deleted: duplicateIds.length };
      }

      return { success: true, deleted: 0, message: "No duplicates found" };
    }

    return { success: true, duplicates: duplicates };
  } catch (error) {
    console.error("❌ Error in cleanupDuplicates:", error);
    return { success: false, error: error.message };
  }
};
