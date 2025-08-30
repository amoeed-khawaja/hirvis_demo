import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const location = useLocation();
  const checkingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (checkingRef.current) return; // prevent concurrent loops
      checkingRef.current = true;
      try {
        console.log("ProtectedRoute: Checking authentication...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("ProtectedRoute: Auth error:", error);
          if (isMountedRef.current) {
            setAuthenticated(false);
            setLoading(false);
          }
          checkingRef.current = false;
          return;
        }

        if (!session) {
          console.log("ProtectedRoute: No session found");
          if (isMountedRef.current) {
            setAuthenticated(false);
            setLoading(false);
          }
          checkingRef.current = false;
          return;
        }

        console.log("ProtectedRoute: User authenticated:", session.user.id);
        if (isMountedRef.current) setAuthenticated(true);

        // If user is on onboarding page, allow access
        if (location.pathname === "/onboarding") {
          console.log("ProtectedRoute: User on onboarding page, allow access");
          if (isMountedRef.current) {
            setUserExists(true);
            setLoading(false);
          }
          checkingRef.current = false;
          return;
        }

        // Check if user exists in users_data table
        console.log("ProtectedRoute: Checking if user exists in users_data...");
        const { data: userData, error: userError } = await supabase
          .from("users_data")
          .select("id")
          .eq("login_user_id", session.user.id)
          .single();

        if (userError || !userData) {
          console.log(
            "ProtectedRoute: User not found in users_data, redirecting to onboarding"
          );
          if (isMountedRef.current) setUserExists(false);
        } else {
          console.log("ProtectedRoute: User found in users_data");
          if (isMountedRef.current) setUserExists(true);
        }

        if (isMountedRef.current) setLoading(false);
      } catch (error) {
        console.error("ProtectedRoute: Error:", error);
        if (isMountedRef.current) setLoading(false);
      } finally {
        checkingRef.current = false;
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return <LoadingSpinner text="Authenticating..." fullScreen={true} />;
  }

  if (!authenticated) {
    console.log("ProtectedRoute: Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If user is not on onboarding page but doesn't exist in users_data, redirect to onboarding
  if (!userExists && location.pathname !== "/onboarding") {
    console.log(
      "ProtectedRoute: Redirecting to onboarding - user not found in users_data"
    );
    return <Navigate to="/onboarding" replace />;
  }

  console.log("ProtectedRoute: Allowing access to protected route");
  return children;
};

export default ProtectedRoute;
