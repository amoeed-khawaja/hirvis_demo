import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

const Spinner = () => (
  <div style={{ color: "#af1763", textAlign: "center", marginTop: 80 }}>
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setIsAuthenticated(!!data.session);
        setLoading(false);
      }
    }
    checkSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setLoading(false);
        } else {
          checkSession();
        }
      }
    );
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
