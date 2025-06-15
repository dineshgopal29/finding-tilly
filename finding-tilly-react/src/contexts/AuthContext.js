import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock sign in function
  const signIn = async (email, password) => {
    try {
      // In a real app, this would use Firebase Auth
      console.log("Signing in with:", email, password);
      
      // Mock successful sign in
      const user = {
        uid: "user123",
        email: email,
        displayName: "Test User"
      };
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      // In a real app, this would use Firebase Auth
      console.log("Signing out");
      
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Mock sign up function
  const signUp = async (email, password, displayName) => {
    try {
      // In a real app, this would use Firebase Auth
      console.log("Signing up with:", email, password, displayName);
      
      // Mock successful sign up
      const user = {
        uid: "newuser123",
        email: email,
        displayName: displayName
      };
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Effect to simulate auth state change
  useEffect(() => {
    // In a real app, this would use Firebase Auth onAuthStateChanged
    const unsubscribe = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(unsubscribe);
  }, []);

  // Context value
  const value = {
    currentUser,
    signIn,
    signOut,
    signUp,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
