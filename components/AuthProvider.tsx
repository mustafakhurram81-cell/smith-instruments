import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// User roles: 'admin' has full access, 'manager' cannot import/export
export type UserRole = 'admin' | 'manager' | null;

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    userRole: UserRole;
    canExport: boolean; // Convenience flag for import/export permissions
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    userRole: null,
    canExport: false,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRole>(null);

    // ADMIN EMAILS - loaded from environment variable (comma-separated)
    const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS || '';
    const ADMIN_EMAILS = adminEmailsEnv.split(',').map((e: string) => e.trim().toLowerCase()).filter(Boolean);

    // Fetch user role from database (source of truth)
    const fetchUserRole = async (userId: string, userEmail?: string) => {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single();

            if (!error && data?.role) {
                setUserRole(data.role as UserRole);
                return;
            }

            // Fallback: if DB lookup fails, check the env-defined admin emails
            // (e.g. during initial setup before user_roles table is populated)
            if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
                setUserRole('admin');
                return;
            }

            // Default safe role
            setUserRole('manager');
        } catch (err) {
            console.warn('Error fetching user role:', err);
            setUserRole('manager');
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id, session.user.email);
            }
            setLoading(false);
        });

        // Listen for changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id, session.user.email);
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUserRole(null);
    };

    // Admin role can export, editor cannot
    const canExport = userRole === 'admin';

    return (
        <AuthContext.Provider value={{ session, user, loading, userRole, canExport, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
