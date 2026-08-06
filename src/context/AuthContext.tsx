import * as React from 'react';
import { createContext, useContext } from 'react';
import { useStore } from '../store/useStore';

interface MockUser {
  id: string;
  email: string;
}

interface MockSession {
  user: MockUser;
}

interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  loading: boolean;
  logout: () => Promise<void>;
  getCurrentUserId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, currentUser, isAuthLoading, signOut } = useStore();

  const getCurrentUserId = () => {
    return currentUser?.id || session?.user?.id || null;
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        loading: isAuthLoading,
        logout,
        getCurrentUserId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
