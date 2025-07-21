import { supabase } from "../supabase";

// Simple function to inspect active_jobs table
export const inspectActiveJobsTable = async () => {
  console.log("🔍 Inspecting active_jobs table...");

  try {
    // Method 1: Try to get table structure from information_schema
    console.log("📋 Method 1: Querying information_schema...");
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", "active_jobs")
      .eq("table_schema", "public")
      .order("ordinal_position");

    if (columnsError) {
      console.error("❌ Error getting columns:", columnsError);
    } else if (columns && columns.length > 0) {
      console.log("✅ Table columns found:");
      columns.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`
        );
      });
    } else {
      console.log("⚠️  No columns found in information_schema");
    }

    // Method 2: Try to get sample data to infer structure
    console.log("\n📊 Method 2: Getting sample data...");
    const { data: sampleData, error: sampleError } = await supabase
      .from("active_jobs")
      .select("*")
      .limit(1);

    if (sampleError) {
      console.error("❌ Error getting sample data:", sampleError);
    } else if (sampleData && sampleData.length > 0) {
      console.log("✅ Sample data found. Columns:");
      Object.keys(sampleData[0]).forEach((key) => {
        console.log(`  - ${key}: ${typeof sampleData[0][key]}`);
      });
    } else {
      console.log("⚠️  No sample data found (table might be empty)");
    }

    // Method 3: Try to get all data to see structure
    console.log("\n📈 Method 3: Getting all data...");
    const { data: allData, error: allError } = await supabase
      .from("active_jobs")
      .select("*");

    if (allError) {
      console.error("❌ Error getting all data:", allError);
    } else {
      console.log(`✅ Found ${allData?.length || 0} rows in active_jobs table`);
      if (allData && allData.length > 0) {
        console.log("📋 Column names from first row:");
        Object.keys(allData[0]).forEach((key) => {
          console.log(`  - ${key}`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
};

// Function to check if table exists
export const checkTableExists = async () => {
  try {
    const { data, error } = await supabase
      .from("active_jobs")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Table does not exist or access denied:", error.message);
      return false;
    } else {
      console.log("✅ Table exists and is accessible");
      return true;
    }
  } catch (error) {
    console.error("❌ Error checking table:", error);
    return false;
  }
};

// Run inspection when imported
if (typeof window !== "undefined") {
  // Only run in browser environment
  setTimeout(() => {
    console.log("🚀 Running active_jobs table inspection...");
    inspectActiveJobsTable();
  }, 1000);
}
