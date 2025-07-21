import { supabase } from "../supabase";

// Function to get table structure from Supabase
export const getTableStructure = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", tableName)
      .eq("table_schema", "public")
      .order("ordinal_position");

    if (error) {
      console.error("Error fetching table structure:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getTableStructure:", error);
    return null;
  }
};

// Function to get all tables in the database
export const getAllTables = async () => {
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .order("table_name");

    if (error) {
      console.error("Error fetching tables:", error);
      return null;
    }

    return data.map((table) => table.table_name);
  } catch (error) {
    console.error("Error in getAllTables:", error);
    return null;
  }
};

// Function to get detailed table structure with constraints
export const getDetailedTableStructure = async (tableName) => {
  try {
    const { data, error } = await supabase.rpc("get_table_structure", {
      table_name: tableName,
    });

    if (error) {
      console.error("Error fetching detailed table structure:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getDetailedTableStructure:", error);
    return null;
  }
};

// Function to get a sample row from a table (to see data structure)
export const getSampleData = async (tableName, limit = 1) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(limit);

    if (error) {
      console.error("Error fetching sample data:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getSampleData:", error);
    return null;
  }
};
