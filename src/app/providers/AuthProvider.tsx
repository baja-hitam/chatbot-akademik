import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getStoredUser, logout as logoutService } from '../../modules/auth/services/authServices';
import type { AuthUser } from '../../types/domain';
import { AuthContext } from './authContext';
import type { AuthContextValue } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
      logout() {
        logoutService();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
