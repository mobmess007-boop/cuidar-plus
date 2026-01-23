import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        if (!userId) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Erro profile:', error);
            }

            if (data) {
                console.log('Perfil carregado:', data);
                setProfile(data);
            }
        } catch (err) {
            console.error('Erro fetchProfile:', err);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (mounted) {
                    if (session?.user) {
                        setUser(session.user);
                        await fetchProfile(session.user.id);
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error('Init error:', error);
                if (mounted) setLoading(false);
            }
        };

        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth State Change:', event);
            if (session?.user) {
                setUser(session.user);
                // SEMPRE buscar o perfil quando há usuário, independente do evento
                // Isso garante que o status premium seja carregado ao reabrir a página
                await fetchProfile(session.user.id);
                setLoading(false);
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Realtime changes
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`profile-${user.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            }, (payload) => {
                console.log('Realtime Update:', payload.new);
                setProfile(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: async () => {
            try {
                await supabase.auth.signOut();
            } catch (e) {
                console.error('Error signing out:', e);
            } finally {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        },
        refreshProfile: () => user && fetchProfile(user.id),
        user,
        profile,
        // Simplificado: se tem perfil e is_premium é true.
        isPremium: !!(profile && profile.is_premium === true),
        // Loading só bloqueia se não temos certeza do estado do usuário
        loading: loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
