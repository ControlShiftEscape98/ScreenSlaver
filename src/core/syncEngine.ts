import { supabase } from './supabaseClient';
import { Session, ScreenUnit, DeviceState, Cue } from '../types';
import { useAuthStore } from './authManager';

// ─── Data Sync Engine ──────────────────────────────────────────────
// Maps frontend types (camelCase) to Supabase tables (snake_case)
// Handles real-time subscriptions and CRUD operations

export const SyncEngine = {

    // ─── Sessions ────────────────────────────────────────────────────

    async saveSession(session: Session): Promise<boolean> {
        const { user } = useAuthStore.getState();
        // Allow anonymous sessions if not logged in
        const hostId = user?.id || null;

        const { error } = await supabase
            .from('sessions')
            .upsert({
                id: session.id,
                code: session.code,
                name: session.name,
                host_id: hostId,
                preset_data: session.presets || [],
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('[SyncEngine] Error saving session:', error);
            return false;
        }
        return true;
    },

    async fetchUserWorkspaces(): Promise<Session[]> {
        const { user } = useAuthStore.getState();
        if (!user) return [];

        const { data: sessionsData, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('host_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('[SyncEngine] Error fetching workspaces:', error);
            return [];
        }

        return sessionsData.map(s => ({
            id: s.id,
            code: s.code,
            name: s.name,
            hostId: s.host_id,
            devices: [],
            cueStack: [],
            presets: s.preset_data || [],
            createdAt: s.created_at,
            savedAt: s.updated_at
        }));
    },

    async getSessionByCode(code: string): Promise<Session | null> {
        const { data: sessionData, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !sessionData) {
            console.warn('[SyncEngine] Session not found by code:', error);
            return null;
        }

        return this.loadSession(sessionData.id);
    },

    async loadSession(sessionId: string): Promise<Session | null> {
        // Fetch session
        const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (sessionError || !sessionData) {
            console.error('[SyncEngine] Error loading session:', sessionError);
            return null;
        }

        // Fetch devices
        const { data: devicesData, error: devicesError } = await supabase
            .from('devices')
            .select('*')
            .eq('session_id', sessionId);

        if (devicesError) {
            console.error('[SyncEngine] Error loading devices:', devicesError);
        }

        // Fetch cues
        const { data: cuesData, error: cuesError } = await supabase
            .from('cues')
            .select('*')
            .eq('session_id', sessionId)
            .order('sort_order', { ascending: true });

        if (cuesError) {
            console.error('[SyncEngine] Error loading cues:', cuesError);
        }

        // Map devices back to ScreenUnit
        const loadedDevices: ScreenUnit[] = (devicesData || []).map(d => ({
            id: d.id,
            name: d.name,
            type: d.type as any,
            group: d.group_name || 'No Group',
            isFavorite: d.is_favorite,
            isHero: d.is_hero,
            isOnline: d.is_online,
            baseState: d.base_state as DeviceState,
            currentState: d.current_state as DeviceState
        }));

        // Map cues back to Cue
        const loadedCues: Cue[] = (cuesData || []).map(c => ({
            id: c.id,
            name: c.name,
            type: c.type as any,
            target: c.target as any,
            data: c.data as any,
            delay: Number(c.delay),
            duration: Number(c.duration),
            order: c.sort_order,
            color: c.color || '#f97316',
            fired: c.is_fired
        }));

        return {
            id: sessionData.id,
            code: sessionData.code,
            name: sessionData.name,
            hostId: sessionData.host_id,
            devices: loadedDevices,
            cueStack: loadedCues,
            presets: sessionData.preset_data || [],
            createdAt: sessionData.created_at,
            savedAt: sessionData.updated_at
        };
    },

    // ─── Devices ─────────────────────────────────────────────────────

    async upsertDevice(sessionId: string, device: ScreenUnit) {
        if (!device.id || !sessionId) return;
        const { error } = await supabase
            .from('devices')
            .upsert({
                id: device.id,
                session_id: sessionId,
                type: device.type,
                name: device.name,
                group_name: device.group,
                is_favorite: device.isFavorite,
                is_hero: device.isHero,
                is_online: device.isOnline,
                base_state: device.baseState,
                current_state: device.currentState
            });

        if (error) console.error('[SyncEngine] Upsert device error:', error);
    },

    // ─── Cues ────────────────────────────────────────────────────────

    async upsertCue(sessionId: string, cue: Cue) {
        if (!cue.id || !sessionId) return;
        const { error } = await supabase
            .from('cues')
            .upsert({
                id: cue.id,
                session_id: sessionId,
                name: cue.name,
                type: cue.type,
                target: cue.target,
                data: cue.data,
                delay: cue.delay,
                duration: cue.duration,
                sort_order: cue.order,
                color: cue.color,
                fired: cue.fired
            });

        if (error) console.error('[SyncEngine] Upsert cue error:', error);
    },

    async removeCue(cueId: string) {
        const { error } = await supabase
            .from('cues')
            .delete()
            .eq('id', cueId);

        if (error) console.error('[SyncEngine] Delete cue error:', error);
    },

    async removeDevice(deviceId: string) {
        const { error } = await supabase
            .from('devices')
            .delete()
            .eq('id', deviceId);

        if (error) console.error('[SyncEngine] Delete device error:', error);
    },

    // ─── Realtime ────────────────────────────────────────────────────

    subscribeToSession(sessionId: string, onUpdate: (payload: any) => void) {
        return supabase
            .channel(`session:${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'devices',
                    filter: `session_id=eq.${sessionId}`
                },
                (payload) => {
                    onUpdate({ type: 'device', payload });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cues',
                    filter: `session_id=eq.${sessionId}`
                },
                (payload) => {
                    onUpdate({ type: 'cue', payload });
                }
            )
            .on('broadcast', { event: 'mode_shift' }, ({ payload }) => {
                onUpdate({ type: 'mode_shift', payload });
            })
            .subscribe();
    },

    unsubscribe(channel: ReturnType<typeof supabase.channel>) {
        if (channel) {
            supabase.removeChannel(channel);
        }
    }
};
