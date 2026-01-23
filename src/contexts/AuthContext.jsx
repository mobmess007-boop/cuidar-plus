import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        if (!userId) {
            setProfile(null);
            return null;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                }
                setProfile(null);
                return null;
            }

            setProfile(data);
            return data;
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            setProfile(null);
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                // 1. Get initial session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (mounted) {
                    if (session?.user) {
                        setUser(session.user);
                        // 2. Fetch profile immediately if session exists
                        await fetchProfile(session.user.id);
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                }
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                // 3. ALWAYS set loading to false after first check
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth State Change Event:', event);
            
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
            
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Real-time profile updates (optional, but good for UX)
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`profile-updates-${user.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            }, (payload) => {
                console.log('Real-time profile update received:', payload.new);
                setProfile(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const value = {
        user,
        profile,
        loading,
        isPremium: !!(profile?.is_premium),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signUp: (data) => supabase.auth.signUp(data),
        signOut: async () => {
            setLoading(true);
            try {
                await supabase.auth.signOut();
            } finally {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        },
        refreshProfile: () => user && fetchProfile(user.id)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
