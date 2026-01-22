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

            if (error) throw error;
            if (data) setProfile(data);
        } catch (err) {
            console.error('Erro ao buscar perfil:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Safety timeout: Never stay loading longer than 6 seconds
        const timeout = setTimeout(() => {
            setLoading(prev => {
                if (prev) console.warn('Auth loading timeout!');
                return false;
            });
        }, 6000);

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

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        refreshProfile: () => user && fetchProfile(user.id),
        user,
        profile,
        isPremium: profile?.is_premium || false,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
