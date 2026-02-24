import { create } from 'zustand';
import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isRedirecting: boolean;
    initialize: () => void;
    signInWithGoogle: () => Promise<void>;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
    /** Safe display name with fallback */
    getDisplayName: () => string;
    /** Safe avatar URL — returns empty string if none */
    getAvatarUrl: () => string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isLoading: true,
    isRedirecting: false,

    initialize: () => {
        // Check if we're returning from an OAuth redirect
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        const isReturningFromOAuth = hashParams.has('access_token') || queryParams.has('code');
        if (isReturningFromOAuth) {
            set({ isRedirecting: true });
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                set({ session, user: session.user, isLoading: false, isRedirecting: false });
            } else {
                // If no session, try anonymous login to satisfy RLS
                get().signInAnonymously();
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user || null, isLoading: false, isRedirecting: false });
        });
    },

    signInWithGoogle: async () => {
        set({ isRedirecting: true });
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            console.error('Error logging in with Google:', error);
            set({ isRedirecting: false, isLoading: false });
        }
        // Note: successful OAuth redirects away from the page, so no set() needed here
    },

    signInAnonymously: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.warn('[AuthManager] Anonymous sign-in failed (might be disabled in Supabase):', error);
            set({ isLoading: false });
            return;
        }
        set({ session: data.session, user: data.user, isLoading: false });
    },

    signOut: async () => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
        set({ user: null, session: null, isLoading: false });
    },

    getDisplayName: () => {
        const { user } = get();
        if (!user) return 'Guest';
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    },

    getAvatarUrl: () => {
        const { user } = get();
        return user?.user_metadata?.avatar_url || '';
    }
}));
