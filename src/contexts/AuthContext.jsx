import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If profile doesn't exist yet, it might be creation race condition
                console.warn('Perfil não encontrado ou erro:', error.message);
                if (error.code === 'PGRST116') { // no rows
                    // Optional: retry once or wait
                }
            }
            if (data) setProfile(data);
        } catch (err) {
            console.error('Erro ao buscar perfil:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Initial Session Check
        const initialize = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                } else {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erro na inicialização:', error);
                setLoading(false);
            }
        };

        initialize();

        // 2. Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth Event:', event);
            if (session?.user) {
                setUser(session.user);
                if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                    await fetchProfile(session.user.id);
                }
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        const timeout = setTimeout(() => setLoading(false), 8000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    // 3. Real-time Profile Updates
    useEffect(() => {
        if (!user?.id) return;

        console.log('Iniciando Realtime para:', user.id);
        const channel = supabase
            .channel(`profile-updates-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    console.log('Realtime Update:', payload.new);
                    setProfile(payload.new);
                }
            )
            .subscribe((status) => {
                console.log('Realtime Status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: async () => {
            console.log('Saindo...');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setLoading(false);
        },
        refreshProfile: () => user && fetchProfile(user.id),
        user,
        profile,
        isPremium: !!profile?.is_premium,
        loading: loading && !profile, // Only block if we are truly loading AND have no profile yet
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
