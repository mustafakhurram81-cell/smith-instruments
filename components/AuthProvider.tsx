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

    // ADMIN EMAILS - These users are always admins (temporary override)
    const ADMIN_EMAILS = ['mustafakhurram81@gmail.com'];

    // Fetch user role from database
    const fetchUserRole = async (userId: string, userEmail?: string) => {
        // Temporary override: Check if email is in admin list
        if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
            setUserRole('admin');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.warn('Could not fetch user role:', error.message);
                // Default to manager if no role found (safe default)
                setUserRole('manager');
                return;
            }

            setUserRole(data?.role as UserRole || 'manager');
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
