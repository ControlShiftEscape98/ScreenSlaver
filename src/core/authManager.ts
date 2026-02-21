import { create } from 'zustand';
import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    initialize: () => void;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,

    initialize: () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({ session, user: session?.user || null, isLoading: false });
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user || null, isLoading: false });
        });
    },

    signInWithGoogle: async () => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            console.error('Error logging in with Google:', error);
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
        set({ user: null, session: null, isLoading: false });
    }
}));
