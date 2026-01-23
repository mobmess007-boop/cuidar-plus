import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        if (!userId) {
            console.log('[Auth] No userId provided to fetchProfile');
            setProfile(null);
            return null;
        }

        try {
            console.log(`[Auth] Fetching profile for: ${userId}`);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('[Auth] Error fetching profile:', error);
                } else {
                    console.log('[Auth] Profile not found (PGRST116)');
                }
                setProfile(null);
                return null;
            }

            console.log('[Auth] Profile loaded successfully:', data.is_premium ? 'PREMIUM' : 'FREE');
            setProfile(data);
            return data;
        } catch (err) {
            console.error('[Auth] Unexpected error in fetchProfile:', err);
            setProfile(null);
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        // Fail-safe: nunca deixar o app em loading infinito
        const failSafeTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('[Auth] Fail-safe timeout reached. Forcing loading to false.');
                setLoading(false);
            }
        }, 8000); // 8 segundos de limite

        const handleAuthStateChange = async (event, session) => {
            console.log(`[Auth] State Change: ${event}`, session?.user?.id || 'No User');

            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }

            if (mounted) {
                setLoading(false);
                clearTimeout(failSafeTimeout);
            }
        };

        // Unificado: getSession inicial + listener
        const initializeAuth = async () => {
            try {
                console.log('[Auth] Initializing session...');
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) console.error('[Auth] getSession error:', error);

                if (mounted) {
                    await handleAuthStateChange('INITIAL_SESSION', session);
                }
            } catch (error) {
                console.error('[Auth] Initialization error:', error);
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Se for INITIAL_SESSION e já processamos no initializeAuth, podemos ignorar aqui 
            // ou processar novamente para garantir sincronia.
            handleAuthStateChange(event, session);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(failSafeTimeout);
        };
    }, []);

    // Real-time profile updates
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
                console.log('[Auth] Real-time profile update:', payload.new.is_premium);
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
