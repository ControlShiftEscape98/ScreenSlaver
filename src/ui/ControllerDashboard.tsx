import React, { useState, useEffect } from 'react';
import logoUrl from '../assets/logo.png';
import { useModeStore } from '../core/modeManager';
import { useSessionStore } from '../core/sessionManager';
import { useAuthStore } from '../core/authManager';
import { useSceneStore } from '../core/sceneManager';
import { SyncEngine } from '../core/syncEngine';
import EditDevicePanel from './components/EditDevicePanel';
import AiCopilotPanel from './components/AiCopilotPanel';
import type { CueType, Session } from '../types';
import { createDefaultCue } from '../types';
import { DEMO_SESSION_CODE } from '../utils/demoData';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
    IconCueIncoming, IconCueOutgoing, IconCueText, IconCueNotification,
    IconCueAlarm, IconCueHome, IconCueLock, IconCueIdle,
    IconCueLoading, IconCueTerminal, IconCueVideo, IconCueError,
    IconDevicePhone, IconDeviceTablet, IconDeviceMonitor, IconDeviceTV, IconDeviceLaptop, IconDeviceOther,
    IconGrid, IconList, IconReset, IconTrash, IconStar,
} from './components/Icons';

// Map cue types to Icons
const CUE_ICONS: Record<CueType, React.ElementType> = {
    incoming: IconCueIncoming,
    outgoing: IconCueOutgoing,
    text: IconCueText,
    notification: IconCueNotification,
    alarm: IconCueAlarm,
    home: IconCueHome,
    lock: IconCueLock,
    idle: IconCueIdle,
    loading: IconCueLoading,
    terminal: IconCueTerminal,
    video: IconCueVideo,
    error: IconCueError,
};

const CUE_LABELS: Record<CueType, string> = {
    incoming: 'Incoming Call',
    outgoing: 'Outgoing Call',
    text: 'Text Message',
    notification: 'System Notification',
    alarm: 'Alarm / Timer',
    home: 'Home Screen',
    lock: 'Lock Screen',
    idle: 'Idle / Sleep',
    loading: 'Suspense Loading',
    terminal: 'Hacker Terminal',
    video: 'Video / Surveillance',
    error: 'Critical Error',
};



// --- Drag & Drop Sortable Item wrapper ───
function SortableCueItem({ cue, view, children }: { cue: any, view: 'stack' | 'grid', children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cue.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 60 : undefined,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`${view === 'grid' ? 'h-full' : ''}`}>
            {React.cloneElement(children as React.ReactElement, {
                dragHandleProps: { ...attributes, ...listeners }
            })}
        </div>
    );
}

export default function ControllerDashboard() {
    const { setMode, dashboardView, setDashboardView } = useModeStore();
    const { user } = useAuthStore();
    const {
        sessionCode,
        devices: sessionDevices,
        cueStack,
        createSession,
        fireCue,
        addCue,
        removeCue,
        updateCue,
        toggleFavorite,
        removeDevice,
        setCueStack,
        updateDeviceState,
        addDevice,
        joinSession,
        syncEnabled,
        loadSessionFromDb,
    } = useSessionStore();

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = cueStack.findIndex((c) => c.id === active.id);
            const newIndex = cueStack.findIndex((c) => c.id === over.id);

            const newStack = arrayMove(cueStack, oldIndex, newIndex).map((cue, idx) => ({
                ...cue,
                order: idx,
            }));

            setCueStack(newStack);
        }
    };
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [joinCode, setJoinCode] = useState('');
    const [sceneName, setSceneName] = useState('Sc. 1 Ext. Night - School Bleachers');
    const [showAddCue, setShowAddCue] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showCueStack, setShowCueStack] = useState(true);
    const [showAiCopilot, setShowAiCopilot] = useState(false);
    const [activeCategory, setActiveCategory] = useState<'all' | 'favorites' | 'phone' | 'tablet' | 'monitor' | 'laptop'>('all');

    const [savedWorkspaces, setSavedWorkspaces] = useState<Session[]>([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);

    useEffect(() => {
        if (showSettings) {
            loadWorkspaces();
        }
    }, [showSettings]);

    // Prevent accidental closure if hosting a session
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const store = useSessionStore.getState();
            if (store.connected && store.role === 'host') {
                e.preventDefault();
                e.returnValue = ''; // Standard trigger for browser generic warning dialog
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const loadWorkspaces = async () => {
        setLoadingWorkspaces(true);
        try {
            const workspaces = await SyncEngine.fetchUserWorkspaces();
            setSavedWorkspaces(workspaces);
        } catch (error) {
            console.error("Failed to load workspaces:", error);
        } finally {
            setLoadingWorkspaces(false);
        }
    };

    const handleSaveWorkspace = async () => {
        const store = useSessionStore.getState();
        if (!store.sessionId) return;

        await SyncEngine.saveSession({
            id: store.sessionId,
            code: store.sessionCode || '000000',
            name: store.sessionName || 'Untitled Workspace',
            hostId: '',
            devices: store.devices,
            cueStack: store.cueStack,
            presets: [],
            createdAt: new Date().toISOString()
        });
        setShowSettings(false);
        // Could add a toast notification here
        alert('Workspace saved manually. (Sync is also automatic!)');
    };

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Add Device modal state
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDeviceType, setNewDeviceType] = useState<'phone' | 'tablet' | 'tv' | 'monitor' | 'laptop' | 'other'>('phone');

    // Home confirmation state
    const [showHomeConfirm, setShowHomeConfirm] = useState(false);

    const handleShareSession = async () => {
        if (!sessionCode) return;
        const shareData = {
            title: 'ScreenSlaver Session',
            text: `Join my ScreenSlaver session with code: ${sessionCode}`,
            url: window.location.origin,
        };
        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share not supported');
            }
        } catch (err) {
            navigator.clipboard.writeText(sessionCode);
            alert('Session code copied to clipboard!');
        }
    };

    const handleHomeClick = () => {
        // ALWAYS show confirmation if connected to a session
        if (sessionCode) {
            setShowHomeConfirm(true);
        } else {
            setMode('home');
        }
    };

    // Scene editing & management state
    const [editingScene, setEditingScene] = useState(false);
    const [showSceneMenu, setShowSceneMenu] = useState(false);
    const { scenes, saveScene, deleteScene, getScene } = useSceneStore();

    const handleSaveScene = () => {
        saveScene(sceneName, sessionDevices, cueStack);
        setShowSceneMenu(false);
    };

    const handleLoadScene = (sceneId: string) => {
        const scene = getScene(sceneId);
        if (!scene) return;
        setSceneName(scene.name);
        setCueStack(scene.cueStack);
        // Restore devices through session store
        scene.devices.forEach(d => updateDeviceState(d.id, d.currentState));
        setShowSceneMenu(false);
    };

    // Identify flash state
    const [identifyingDeviceId, setIdentifyingDeviceId] = useState<string | null>(null);

    // Add Cue form state
    const [newCueName, setNewCueName] = useState('');
    const [newCueType, setNewCueType] = useState<CueType>('incoming');
    const [newCueContactName, setNewCueContactName] = useState('');
    const [newCuePhone, setNewCuePhone] = useState('');
    const [selectedTargets, setSelectedTargets] = useState<string[]>(['all']);

    // Extended form state
    const [newCueSubtitle, setNewCueSubtitle] = useState('');
    const [newCueColor, setNewCueColor] = useState('#f97316');
    const [newCueLoadingText, setNewCueLoadingText] = useState('Downloading Data...');
    const [newCueTerminalCode, setNewCueTerminalCode] = useState('sudo rm -rf /');
    const [newCueMessageBody, setNewCueMessageBody] = useState('');
    const [gridEditMode, setGridEditMode] = useState(false);

    const handleAddCue = () => {
        if (!newCueName.trim()) return;

        // Build the precise data object based on type
        let cueData: Record<string, any> = {};
        if (['incoming', 'outgoing', 'text'].includes(newCueType)) {
            cueData = { contactName: newCueContactName, phoneNumber: newCuePhone, messageBody: newCueMessageBody };
        } else if (newCueType === 'loading') {
            cueData = { loadingText: newCueLoadingText, title: newCueName };
        } else if (newCueType === 'terminal') {
            cueData = { terminalCode: newCueTerminalCode };
        } else if (['notification', 'error', 'alarm', 'video'].includes(newCueType)) {
            cueData = { title: newCueName, subtitle: newCueSubtitle };
        }

        const isAll = selectedTargets.includes('all');
        const groups = selectedTargets.filter(t => t.startsWith('cat:'));
        const individualDevices = selectedTargets.filter(t => !t.startsWith('cat:') && t !== 'all');

        const cue = createDefaultCue({
            name: newCueName,
            type: newCueType,
            target: {
                mode: isAll ? 'all' : (selectedTargets.length > 1 ? 'multi-device' : (groups.length > 0 ? 'group' : 'device')),
                deviceId: individualDevices.length === 1 ? individualDevices[0] : undefined,
                deviceIds: selectedTargets,
                groupName: groups.length === 1 ? groups[0].replace('cat:', '') : undefined
            },
            data: Object.keys(cueData).length > 0 ? cueData as any : null,
            color: newCueColor,
            order: cueStack.length,
        });

        addCue(cue);

        // Reset state
        setNewCueName('');
        setNewCueContactName('');
        setNewCuePhone('');
        setNewCueSubtitle('');
        setNewCueLoadingText('Downloading Data...');
        setNewCueTerminalCode('sudo rm -rf /');
        setNewCueMessageBody('');
        setSelectedTargets(['all']);
        setShowAddCue(false);
    };

    const handleFireCue = (cueId: string) => {
        fireCue(cueId);
    };

    const handleResetCue = (cueId: string) => {
        updateCue(cueId, { fired: false });
    };

    const handleDeleteCue = (cueId: string) => {
        removeCue(cueId);
    };

    // List Filtering Logic
    const displayDevices = sessionDevices.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            activeCategory === 'all' ? true :
                activeCategory === 'favorites' ? d.isFavorite :
                    d.type === activeCategory;

        return matchesSearch && matchesCategory;
    });

    const selectedDevice = displayDevices.find(d => d.id === selectedDeviceId);

    const needsContactInfo = ['incoming', 'outgoing', 'text'].includes(newCueType);

    if (!sessionCode) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-surface-base">
                <div className="glass-panel-elevated p-8 max-w-sm w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-600 to-orange-400"></div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Controller<span className="text-accent-500">Host</span></h2>
                    <p className="text-neutral-400 text-sm mb-8 font-medium">Create a new workspace to orchestrate devices, or join an existing session.</p>

                    <button
                        onClick={createSession}
                        className="w-full py-4 bg-accent-500 hover:bg-accent-400 text-white font-black rounded-xl shadow-glow-accent transition-all mb-6 flex items-center justify-center gap-2 group"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform"><path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        START NEW SESSION
                    </button>

                    <div className="relative flex items-center py-4 mb-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-neutral-600 text-[10px] font-black uppercase tracking-widest">or join existing</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="6-DIGIT CODE"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            maxLength={6}
                            className="input-field w-full text-center font-mono text-xl tracking-widest uppercase py-3 placeholder:text-neutral-600"
                        />
                        <button
                            onClick={() => {
                                if (joinCode.length === 6) {
                                    joinSession(joinCode, 'Controller Host');
                                }
                            }}
                            disabled={joinCode.length !== 6}
                            className="w-full py-3 bg-surface-200 hover:bg-surface-100 text-white border border-white/10 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Join Workspace
                        </button>
                    </div>

                    <button onClick={() => setMode('home')} className="mt-8 text-xs font-bold text-neutral-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-surface-400 animate-fade-in">
            {/* ─── Header ────────────────────────────────── */}
            <header className="flex items-center justify-between px-6 py-3 bg-surface-300 border-b border-white/5 relative z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logoUrl}
                            alt="ScreenSlaver Logo"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(249,115,22,0.25)]"
                        />
                        <div>
                            <h1 className="text-sm font-bold text-white leading-none tracking-wide">Screen<span className="text-accent-500">Slaver</span></h1>
                            <p className="text-[10px] text-neutral-500 leading-none mt-1 font-medium">Film Set Orchestration</p>
                        </div>
                    </div>

                    {/* Session Code */}
                    <button onClick={handleShareSession} className="flex items-center gap-2 ml-6 px-4 py-2 bg-surface-base rounded-xl border border-white/5 shadow-inner hover:bg-surface-100 transition-colors group" title="Click to share or copy">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold group-hover:text-neutral-400">Session</span>
                        <span className="text-lg font-mono font-bold text-accent-500 tracking-widest">{sessionCode || DEMO_SESSION_CODE}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500 group-hover:text-accent-500 ml-1"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Cloud Status */}
                    <div className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded-full border ${syncEnabled ? 'bg-accent-500/10 border-accent-500/30 text-accent-500' : 'bg-red-500/10 border-red-500/30 text-red-500'} font-black uppercase tracking-widest`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${syncEnabled ? 'bg-accent-500 animate-pulse' : 'bg-red-500'}`} />
                        {syncEnabled ? 'Cloud Sync' : 'Offline Mode'}
                    </div>

                    <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-surface-100/50 rounded-lg border border-white/5">
                        <div className="status-online shadow-glow-online" />
                        <span className="text-neutral-300 font-medium">{sessionDevices.filter(d => d.isOnline).length}/{sessionDevices.length} devices</span>
                    </div>

                    <button
                        className={`btn-ghost text-xs flex items-center gap-2 ${showAiCopilot ? 'bg-accent-500/20 text-accent-500' : 'bg-surface-200'} transition-colors`}
                        onClick={() => setShowAiCopilot(!showAiCopilot)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.1 12" /><path d="M12 12l8.66 5" /></svg>
                        AI Copilot
                    </button>

                    <button className="btn-ghost text-xs flex items-center gap-2 bg-surface-200" onClick={() => {
                        // Reset all logic would go here
                        setCueStack(cueStack.map(c => ({ ...c, fired: false })));
                    }}>
                        <IconReset className="w-4 h-4" />
                        Reset All
                    </button>

                    <div className="relative">
                        <button className="btn-ghost p-2" onClick={() => setShowSettings(!showSettings)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </button>
                        {showSettings && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-surface-200 border border-white/10 rounded-xl shadow-2xl p-4 z-[100] animate-float-in">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-xs font-bold text-accent-500 border border-accent-500/20">
                                        {user?.email?.[0].toUpperCase() || 'G'}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white leading-none mb-1">{user?.user_metadata?.full_name || user?.email || 'Guest Session'}</h4>
                                        <p className="text-[10px] text-neutral-500 font-medium">Syncing to Cloud</p>
                                    </div>
                                </div>
                                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Current Session</h4>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between p-3 bg-surface-100 rounded-lg border border-white/5">
                                        <span className="text-sm text-neutral-300">Session Code</span>
                                        <span className="text-sm font-mono font-bold text-accent-500">{sessionCode || DEMO_SESSION_CODE}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-surface-100 rounded-lg border border-white/5">
                                        <span className="text-sm text-neutral-300">Connected Devices</span>
                                        <span className="text-sm font-bold text-white">{sessionDevices.length}</span>
                                    </div>
                                    <button
                                        onClick={handleSaveWorkspace}
                                        className="w-full py-2.5 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-lg text-xs font-bold hover:bg-accent-500/20 transition-colors gap-2 flex items-center justify-center"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                        Save Workspace
                                    </button>
                                </div>

                                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Saved Workspaces</h4>
                                <div className="space-y-2 mb-4">
                                    {loadingWorkspaces ? (
                                        <p className="text-[11px] text-neutral-500 text-center py-2 animate-pulse">Loading workspaces...</p>
                                    ) : savedWorkspaces.length > 0 ? (
                                        savedWorkspaces.slice(0, 3).map(ws => (
                                            <button
                                                key={ws.id}
                                                onClick={() => {
                                                    setShowSettings(false);
                                                    loadSessionFromDb(ws.id);
                                                }}
                                                className="w-full text-left p-3 bg-surface-100 hover:bg-surface-50 border border-white/5 hover:border-accent-500/30 rounded-lg transition-all group"
                                            >
                                                <p className="text-sm font-bold text-white group-hover:text-accent-500 transition-colors">{ws.name}</p>
                                                <p className="text-[10px] text-neutral-500">{ws.devices?.length || 0} Devices • {ws.cueStack?.length || 0} Cues</p>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-neutral-500 text-center py-2">No saved workspaces.</p>
                                    )}
                                    {savedWorkspaces.length > 3 && (
                                        <button
                                            onClick={() => { setShowSettings(false); setMode('home'); }}
                                            className="w-full py-2 text-xs font-bold text-neutral-500 hover:text-white transition-colors"
                                        >
                                            View All Workspaces...
                                        </button>
                                    )}
                                </div>

                                <div className="border-t border-white/5 pt-4">
                                    <button
                                        onClick={() => { setShowSettings(false); handleHomeClick(); }}
                                        className="w-full py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors gap-2 flex items-center justify-center"
                                    >
                                        Leave Session
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="btn-ghost p-2 text-neutral-400 hover:text-white" onClick={handleHomeClick}>
                        <IconCueHome className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* ─── Scene Bar ─────────────────────────────── */}
            <div className="flex items-center gap-3 px-6 py-3 bg-surface-300 border-b border-white/5 shadow-sm relative z-10">
                {editingScene ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-100 border border-accent-500/50 rounded-lg">
                        <span className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">Current Scene</span>
                        <input
                            type="text"
                            value={sceneName}
                            onChange={e => setSceneName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingScene(false); }}
                            onBlur={() => setEditingScene(false)}
                            className="bg-transparent text-sm font-semibold text-white outline-none border-l border-white/10 pl-3 flex-1"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => setShowSceneMenu(!showSceneMenu)}
                            className="flex items-center gap-3 px-4 py-2 bg-surface-100 hover:bg-surface-50 border border-white/5 hover:border-accent-500/30 rounded-lg transition-all group"
                        >
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-accent-500 transition-colors">Current Scene</span>
                            <span className="text-sm font-semibold text-white border-l border-white/10 pl-3">{sceneName}</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className={`text-neutral-600 group-hover:text-accent-500 ml-1 transition-transform ${showSceneMenu ? 'rotate-180' : ''}`}>
                                <path d="M2 4l4 4 4-4" />
                            </svg>
                        </button>

                        {/* Scene Dropdown Menu */}
                        {showSceneMenu && (
                            <div className="absolute left-0 top-full mt-2 w-80 bg-surface-200 border border-white/10 rounded-xl shadow-2xl p-3 z-[100] animate-float-in">
                                {/* Scene Name Edit */}
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={sceneName}
                                        onChange={e => setSceneName(e.target.value)}
                                        className="flex-1 bg-surface-100 border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-accent-500/50"
                                        placeholder="Scene name..."
                                    />
                                    <button
                                        onClick={handleSaveScene}
                                        className="px-3 py-2 bg-accent-500 text-white rounded-lg text-xs font-bold hover:bg-accent-600 transition-colors whitespace-nowrap"
                                    >
                                        💾 Save
                                    </button>
                                </div>

                                {/* Saved Scenes List */}
                                {scenes.length > 0 && (
                                    <div className="border-t border-white/5 pt-2">
                                        <h5 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 px-1">Saved Scenes</h5>
                                        <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                            {scenes.map(scene => (
                                                <div key={scene.id} className="flex items-center gap-2 p-2 bg-surface-100 rounded-lg border border-white/5 hover:border-accent-500/30 transition-all group">
                                                    <button
                                                        onClick={() => handleLoadScene(scene.id)}
                                                        className="flex-1 text-left"
                                                    >
                                                        <p className="text-xs font-semibold text-white group-hover:text-accent-500 transition-colors">{scene.name}</p>
                                                        <p className="text-[10px] text-neutral-500">{new Date(scene.savedAt).toLocaleString()}</p>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteScene(scene.id)}
                                                        className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors"
                                                        title="Delete scene"
                                                    >
                                                        <IconTrash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {scenes.length === 0 && (
                                    <p className="text-[11px] text-neutral-500 text-center py-3 italic">No saved scenes yet</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Dashboard View Toggle */}
                <div className="ml-auto flex items-center gap-1 bg-surface-100 rounded-lg p-1 border border-white/5 shadow-inner">
                    <button
                        onClick={() => setDashboardView('devices')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${dashboardView === 'devices' ? 'bg-surface-300 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <IconList className="w-3.5 h-3.5" /> Devices
                    </button>
                    <button
                        onClick={() => setDashboardView('cue-grid')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${dashboardView === 'cue-grid' ? 'bg-surface-300 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <IconGrid className="w-3.5 h-3.5" /> Cue Grid
                    </button>

                    {dashboardView === 'cue-grid' && (
                        <button
                            onClick={() => setGridEditMode(!gridEditMode)}
                            className={`ml-1 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${gridEditMode ? 'bg-orange-500/20 text-orange-400' : 'text-neutral-500 hover:text-white'}`}
                        >
                            {gridEditMode ? 'Done' : 'Edit Grid'}
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Main Content ──────────────────────────── */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel — Devices or Cue Grid */}
                <div className="flex-1 flex flex-col overflow-hidden bg-surface-400 relative">
                    {/* Inner Gradient Shadow */}
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />

                    {dashboardView === 'devices' ? (
                        <>
                            {/* Category Filter Rail */}
                            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-surface-base">
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pr-4">
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'favorites', label: 'Favorites', icon: IconStar },
                                        { id: 'phone', label: 'Phones' },
                                        { id: 'tablet', label: 'Tablets' },
                                        { id: 'monitor', label: 'Displays' },
                                        { id: 'laptop', label: 'Laptops' },
                                    ].map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id as any)}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border flex items-center gap-1.5
                                                ${activeCategory === cat.id
                                                    ? 'bg-accent-500 border-accent-500 text-white shadow-glow-accent'
                                                    : 'bg-surface-200 border-white/5 text-neutral-400 hover:bg-surface-100 hover:text-white'
                                                }`}
                                        >
                                            {cat.icon && <cat.icon className="w-3 h-3" />}
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative group/search">
                                        <input
                                            type="text"
                                            placeholder="Search IDs..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="bg-surface-200 border border-white/5 rounded-lg py-1.5 px-3 pl-8 text-[10px] text-white focus:border-accent-500/50 outline-none w-28 transition-all group-hover/search:w-40"
                                        />
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </div>
                                    <button className="btn-accent px-4 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-2" onClick={() => setShowAddDevice(true)}>
                                        <span className="text-sm">+</span> Add Device
                                    </button>
                                </div>
                            </div>

                            {/* Device Cards */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                                    {displayDevices.map(device => {
                                        const DeviceIcon = device.type === 'phone' ? IconDevicePhone :
                                            device.type === 'tablet' ? IconDeviceTablet :
                                                device.type === 'tv' ? IconDeviceTV :
                                                    device.type === 'laptop' ? IconDeviceLaptop :
                                                        device.type === 'monitor' ? IconDeviceMonitor : IconDeviceOther;

                                        return (
                                            <div key={device.id} className={`device-card group relative overflow-hidden bg-surface-200 border transition-all rounded-xl p-0 ${identifyingDeviceId === device.id ? 'border-accent-500 shadow-glow-accent ring-2 ring-accent-500/50 animate-pulse' : 'border-white/5 hover:border-accent-500/30'}`}>
                                                <div className="p-4 relative z-10">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                                                                <DeviceIcon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-white font-bold text-sm leading-tight">{device.name}</h3>
                                                                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{device.type.toUpperCase()} • ID: {device.id.slice(-4)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavorite(device.id);
                                                                }}
                                                                className={`p-1 transition-colors ${device.isFavorite ? 'text-yellow-400' : 'text-neutral-600 hover:text-neutral-400'}`}
                                                            >
                                                                <IconStar className="w-4 h-4" fill={device.isFavorite ? "currentColor" : "none"} />
                                                            </button>
                                                            <div className={`w-2 h-2 rounded-full ${device.isOnline ? 'bg-green-500 shadow-glow-online' : 'bg-red-500'}`} />
                                                        </div>
                                                    </div>

                                                    {/* Status Grid */}
                                                    <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-neutral-400">
                                                        <div className="bg-surface-100 rounded px-2 py-1 text-center border border-white/5">
                                                            BAT <span className="text-white font-bold">{device.currentState.battery}%</span>
                                                        </div>
                                                        <div className="bg-surface-100 rounded px-2 py-1 text-center border border-white/5">
                                                            SIG <span className="text-white font-bold">{device.currentState.signal}/4</span>
                                                        </div>
                                                        <div className={`rounded px-2 py-1 text-center border border-white/5 ${device.currentState.screenLocked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-surface-100'}`}>
                                                            {device.currentState.screenLocked ? 'LOCKED' : 'UNLOCKED'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Hover Actions */}
                                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                                                    <button className={`btn-accent text-xs px-3 py-2 rounded-lg ${identifyingDeviceId === device.id ? 'ring-2 ring-white' : ''}`} onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdentifyingDeviceId(device.id);
                                                        updateDeviceState(device.id, { signal: 4 });
                                                        setTimeout(() => setIdentifyingDeviceId(null), 1500);
                                                    }}>Identify</button>
                                                    <button
                                                        className="bg-surface-100 hover:bg-white/10 text-white text-xs px-3 py-2 rounded-lg border border-white/10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedDeviceId(device.id);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className={`p-2 rounded-lg border flex items-center justify-center transition-all ${device.isFavorite ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-surface-100 text-neutral-400 border-white/10 hover:text-white'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavorite(device.id);
                                                        }}
                                                        title={device.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                                    >
                                                        <IconStar className="w-4 h-4" fill={device.isFavorite ? "currentColor" : "none"} />
                                                    </button>
                                                    <button
                                                        className="bg-red-500/20 hover:bg-red-500/40 text-red-100 text-xs px-3 py-2 rounded-lg border border-red-500/30 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Remove ${device.name}?`)) {
                                                                removeDevice(device.id);
                                                            }
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ─── Cue Grid (DJ Groove Box) ──────────── */
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={cueStack.map(c => c.id)}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {cueStack.map((cue) => {
                                            const CueIcon = CUE_ICONS[cue.type];
                                            return (
                                                <SortableCueItem key={cue.id} cue={cue} view="grid">
                                                    <button
                                                        onClick={() => !gridEditMode && handleFireCue(cue.id)}
                                                        onContextMenu={(e) => { e.preventDefault(); handleResetCue(cue.id); }}
                                                        {...(gridEditMode ? (cue as any).dragHandleProps : {})}
                                                        className={`p-4 rounded-xl border text-left transition-all duration-150 relative overflow-hidden group aspect-square flex flex-col justify-between w-full
                                                            ${gridEditMode ? 'animate-slow-wobble cursor-move border-accent-500/50' : ''}
                                                            ${cue.fired
                                                                ? 'bg-surface-100 border-white/5 opacity-60'
                                                                : 'bg-surface-200 border-white/10 hover:border-accent-500/50 hover:shadow-glow-accent hover:bg-surface-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <div className={`p-1.5 rounded-lg ${cue.fired ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-white group-hover:bg-accent-500 group-hover:text-white transition-colors'}`}>
                                                                <CueIcon className="w-4 h-4" />
                                                            </div>
                                                            {cue.fired && !gridEditMode && (
                                                                <span className="text-[7px] bg-green-500/10 text-green-500 px-1 py-0.5 rounded border border-green-500/20 font-bold uppercase">Fired</span>
                                                            )}
                                                            {gridEditMode && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteCue(cue.id); }}
                                                                    className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                                                                >
                                                                    <IconTrash className="w-2.5 h-2.5" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="relative z-10">
                                                            <p className="text-[10px] font-bold text-white truncate leading-tight">{cue.name}</p>
                                                            <p className="text-[8px] text-neutral-500 mt-0.5 uppercase tracking-tighter">{CUE_LABELS[cue.type]}</p>
                                                        </div>

                                                        {/* Reset Button Overlay for fired cues */}
                                                        {cue.fired && !gridEditMode && (
                                                            <div
                                                                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                                                onClick={(e) => { e.stopPropagation(); handleResetCue(cue.id); }}
                                                            >
                                                                <span className="bg-surface-600 text-white px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                                                                    <IconReset className="w-2.5 h-2.5" /> RESET
                                                                </span>
                                                            </div>
                                                        )}
                                                    </button>
                                                </SortableCueItem>
                                            );
                                        })}

                                        {cueStack.length === 0 && (
                                            <div className="col-span-full py-20 text-center">
                                                <p className="text-neutral-500">Add cues to populate the grid</p>
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Right Panel — Cue Stack (Collapsible) ─ */}
            <div className="relative flex">
                {/* Toggle Tab */}
                <button
                    onClick={() => setShowCueStack(!showCueStack)}
                    className="absolute -left-8 top-40 z-40 w-8 h-12 bg-surface-300 border border-white/10 border-r-0 rounded-l-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-surface-200 transition-colors shadow-lg"
                    title={showCueStack ? 'Hide Cue Stack' : 'Show Cue Stack'}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-300 ${showCueStack ? 'rotate-0' : 'rotate-180'}`}>
                        <path d="M5 3l4 4-4 4" />
                    </svg>
                </button>

                <aside className={`border-l border-white/5 bg-surface-300 flex flex-col shadow-2xl z-30 transition-all duration-300 ease-in-out overflow-hidden ${showCueStack ? 'w-[320px] opacity-100' : 'w-0 opacity-0'}`}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-surface-200/50">
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-wide">CUE STACK</h2>
                            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">SEQUENTIAL CONTROL</p>
                        </div>
                        <button
                            onClick={() => setShowAddCue(true)}
                            className="bg-accent-500 hover:bg-accent-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-glow-accent"
                        >
                            + ADD
                        </button>
                    </div>

                    {/* Cue List */}
                    <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={cueStack.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-1.5">
                                    {cueStack.map((cue, index) => {
                                        const CueIcon = CUE_ICONS[cue.type];
                                        return (
                                            <SortableCueItem key={cue.id} cue={cue} view="stack">
                                                <div className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${cue.fired ? 'bg-surface-100 border-transparent opacity-60' : 'bg-surface-200 border-white/5 hover:border-accent-500/30'}`}>
                                                    {/* Drag Handle */}
                                                    <span
                                                        className="text-xs font-mono text-neutral-600 w-4 cursor-grab active:cursor-grabbing hover:text-accent-500 transition-colors"
                                                        {...(cue as any).dragHandleProps}
                                                    >
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>

                                                    <div className={`p-2 rounded-lg ${cue.fired ? 'bg-green-500/10 text-green-500' : 'bg-surface-100 text-neutral-300 group-hover:text-white'}`}>
                                                        <CueIcon className="w-5 h-5" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-bold truncate ${cue.fired ? 'text-green-500 line-through decoration-green-500/50' : 'text-white'}`}>{cue.name}</p>
                                                        <p className="text-[10px] text-neutral-500">{CUE_LABELS[cue.type]}</p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        {cue.fired ? (
                                                            <button
                                                                onClick={() => handleResetCue(cue.id)}
                                                                className="p-1.5 rounded-lg text-neutral-500 hover:bg-surface-300 hover:text-white transition-colors"
                                                                title="Reset Cue"
                                                            >
                                                                <IconReset className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleFireCue(cue.id)}
                                                                className="p-1.5 rounded-lg bg-accent-500/10 text-accent-500 hover:bg-accent-500 hover:text-white transition-colors"
                                                                title="Fire Cue"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                                </svg>
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteCue(cue.id)}
                                                            className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <IconTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </SortableCueItem>
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Master Controls */}
                    <div className="p-4 bg-surface-200 border-t border-white/5">
                        <button
                            onClick={() => {
                                const next = cueStack.find(c => !c.fired);
                                if (next) fireCue(next.id);
                            }}
                            className="w-full py-4 bg-accent-500 text-white font-black text-xl rounded-xl flex items-center justify-center gap-3 shadow-glow-accent hover:shadow-glow-accent-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={cueStack.every(c => c.fired)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            GO
                        </button>
                    </div>
                </aside>
            </div>

            {/* Edit Device Panel */}
            {
                selectedDevice && (
                    <EditDevicePanel
                        device={selectedDevice}
                        onClose={() => setSelectedDeviceId(null)}
                    />
                )
            }

            {/* ─── Add Cue Modal ──────────────────────────── */}
            {
                showAddCue && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddCue(false)}>
                        <div className="glass-panel-elevated p-0 w-full max-w-lg overflow-hidden animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-4 bg-surface-100 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Create New Cue</h3>
                                <button onClick={() => setShowAddCue(false)} className="text-neutral-500 hover:text-white">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* Cue Name */}
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Cue Name</label>
                                <input
                                    type="text"
                                    value={newCueName}
                                    onChange={e => setNewCueName(e.target.value)}
                                    placeholder="e.g., Hero Phone Ring"
                                    className="input-field mb-6 w-full text-lg font-medium"
                                    autoFocus
                                />

                                {/* Cue Type Grid */}
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Trigger Type</label>
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {(Object.keys(CUE_ICONS) as CueType[]).map(type => {
                                        const TypeIcon = CUE_ICONS[type];
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => setNewCueType(type)}
                                                className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all text-center aspect-[5/4]
                                            ${newCueType === type
                                                        ? 'border-accent-500 bg-accent-500/10 text-accent-500 shadow-glow-accent/20'
                                                        : 'border-white/5 bg-surface-200 text-neutral-400 hover:bg-surface-100 hover:text-white'
                                                    }`}
                                            >
                                                <TypeIcon className="w-5 h-5" />
                                                <span className="text-[9px] font-bold leading-tight">{CUE_LABELS[type]}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Base Customization (For most cues) */}
                                <div className="mb-6 animate-fade-in space-y-4">
                                    {/* Conditional Inputs for Phone/Contact */}
                                    {needsContactInfo && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={newCueContactName}
                                                    onChange={e => setNewCueContactName(e.target.value)}
                                                    placeholder="e.g. Mom"
                                                    className="input-field"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={newCuePhone}
                                                    onChange={e => setNewCuePhone(e.target.value)}
                                                    placeholder="e.g. 555-0123"
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading Bar Inputs */}
                                    {newCueType === 'loading' && (
                                        <div>
                                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Loading Text</label>
                                            <input
                                                type="text"
                                                value={newCueLoadingText}
                                                onChange={e => setNewCueLoadingText(e.target.value)}
                                                placeholder="e.g. Downloading Data..."
                                                className="input-field w-full"
                                            />
                                        </div>
                                    )}

                                    {/* Terminal Inputs */}
                                    {newCueType === 'terminal' && (
                                        <div>
                                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Terminal Code / Command</label>
                                            <textarea
                                                value={newCueTerminalCode}
                                                onChange={e => setNewCueTerminalCode(e.target.value)}
                                                placeholder="e.g. sudo rm -rf /"
                                                className="input-field w-full font-mono text-xs custom-scrollbar min-h-[80px]"
                                            />
                                        </div>
                                    )}

                                    {newCueType === 'text' && (
                                        <div className="animate-fade-in-up">
                                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Message Content</label>
                                            <textarea
                                                rows={2}
                                                value={newCueMessageBody}
                                                onChange={e => setNewCueMessageBody(e.target.value)}
                                                placeholder="Type message content here..."
                                                className="input-field w-full resize-none py-3"
                                            />
                                        </div>
                                    )}

                                    {/* Subtitle for Notification, Alarm, Error, Video */}
                                    {['notification', 'error', 'alarm', 'video'].includes(newCueType) && (
                                        <div>
                                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Subtitle / Description</label>
                                            <input
                                                type="text"
                                                value={newCueSubtitle}
                                                onChange={e => setNewCueSubtitle(e.target.value)}
                                                placeholder="Optional subtitle text..."
                                                className="input-field w-full"
                                            />
                                        </div>
                                    )}

                                    {/* Color Picker - Customization (Hacker Terminal style) */}
                                    {newCueType === 'terminal' && (
                                        <div>
                                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Highlight Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={newCueColor}
                                                    onChange={e => setNewCueColor(e.target.value)}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-surface-100 p-0.5 shadow-inner"
                                                />
                                                <input
                                                    type="text"
                                                    value={newCueColor}
                                                    onChange={e => setNewCueColor(e.target.value)}
                                                    className="input-field font-mono text-sm uppercase flex-1 max-w-[120px]"
                                                    maxLength={7}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Target Selection */}
                                {/* Destination Selection (Unified) */}
                                <div className="mb-8">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Target Destination</label>
                                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        {/* Broadcast Option */}
                                        <button
                                            onClick={() => setSelectedTargets(['all'])}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedTargets.includes('all') ? 'bg-accent-500 border-accent-500 text-white shadow-glow-accent/20' : 'bg-surface-200 border-white/5 text-neutral-400 hover:bg-surface-100'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                                <span className="text-sm font-bold tracking-wide">Broadcast to All Devices</span>
                                            </div>
                                            {selectedTargets.includes('all') && <div className="w-2 h-2 rounded-full bg-white shadow-glow-white" />}
                                        </button>

                                        {/* Categories */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'cat:favorites', label: 'Favorites', icon: IconStar },
                                                { id: 'cat:phone', label: 'Phones', icon: IconDevicePhone },
                                                { id: 'cat:tablet', label: 'Tablets', icon: IconDeviceTablet },
                                                { id: 'cat:monitor', label: 'Displays', icon: IconDeviceMonitor },
                                                { id: 'cat:laptop', label: 'Laptops', icon: IconDeviceLaptop },
                                            ].map(cat => {
                                                const isSelected = selectedTargets.includes(cat.id);
                                                const Icon = cat.icon;
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            const next = selectedTargets.includes('all') ? [cat.id] : (
                                                                isSelected ? selectedTargets.filter(t => t !== cat.id) : [...selectedTargets, cat.id]
                                                            );
                                                            setSelectedTargets(next.length === 0 ? ['all'] : next);
                                                        }}
                                                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${isSelected ? 'bg-accent-500/10 border-accent-500 text-accent-500' : 'bg-surface-200 border-white/5 text-neutral-400 hover:bg-surface-100'}`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        <span className="text-xs font-bold leading-none">{cat.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Specific Devices */}
                                        {sessionDevices.length > 0 && (
                                            <div className="space-y-1.5 pt-2">
                                                <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-1">Specific Devices</h4>
                                                {sessionDevices.map(device => {
                                                    const isSelected = selectedTargets.includes(device.id);
                                                    const DeviceIcon = device.type === 'phone' ? IconDevicePhone :
                                                        device.type === 'tablet' ? IconDeviceTablet :
                                                            device.type === 'laptop' ? IconDeviceLaptop :
                                                                device.type === 'monitor' ? IconDeviceMonitor : IconDeviceOther;
                                                    return (
                                                        <button
                                                            key={device.id}
                                                            onClick={() => {
                                                                const next = selectedTargets.includes('all') ? [device.id] : (
                                                                    isSelected ? selectedTargets.filter(t => t !== device.id) : [...selectedTargets, device.id]
                                                                );
                                                                setSelectedTargets(next.length === 0 ? ['all'] : next);
                                                            }}
                                                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${isSelected ? 'bg-accent-500/10 border-accent-500 text-accent-500 shadow-glow-accent/5' : 'bg-surface-200 border-white/5 text-neutral-400 hover:bg-surface-100'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <DeviceIcon className="w-4 h-4" />
                                                                <span className="text-xs font-bold">{device.name}</span>
                                                            </div>
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-glow-accent" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0">
                                <button
                                    onClick={handleAddCue}
                                    disabled={!newCueName.trim()}
                                    className={`w-full py-3.5 text-base font-bold rounded-xl transition-all active:scale-[0.98] border
                                ${newCueName.trim()
                                            ? 'bg-white text-surface-400 border-white hover:bg-neutral-100 shadow-lg'
                                            : 'bg-surface-200 text-neutral-600 border-white/5 cursor-not-allowed'}`}
                                >
                                    Create Cue
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ─── Add Device Modal ──────────────────────── */}
            {
                showAddDevice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddDevice(false)}>
                        <div className="glass-panel-elevated p-0 w-full max-w-md overflow-hidden animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-4 bg-surface-100 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Add Device</h3>
                                <button onClick={() => setShowAddDevice(false)} className="text-neutral-500 hover:text-white">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Device Name</label>
                                <input
                                    type="text"
                                    value={newDeviceName}
                                    onChange={e => setNewDeviceName(e.target.value)}
                                    placeholder="e.g., Hero Phone B"
                                    className="input-field mb-4 w-full"
                                    autoFocus
                                />

                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Device Type</label>
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {(['phone', 'tablet', 'monitor', 'tv', 'laptop', 'other'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setNewDeviceType(t)}
                                            className={`py-2 rounded-lg text-xs font-bold border transition-all ${newDeviceType === t ? 'border-accent-500 bg-accent-500 text-white' : 'border-white/5 bg-surface-200 text-neutral-400 hover:text-white'}`}
                                        >
                                            {t.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (newDeviceName.trim()) {
                                            addDevice(newDeviceName.trim(), newDeviceType);
                                            setNewDeviceName('');
                                            setShowAddDevice(false);
                                        }
                                    }}
                                    disabled={!newDeviceName.trim()}
                                    className={`w-full py-3.5 text-base font-bold rounded-xl transition-all active:scale-[0.98] border
                                    ${newDeviceName.trim()
                                            ? 'bg-white text-surface-400 border-white hover:bg-neutral-100 shadow-lg'
                                            : 'bg-surface-200 text-neutral-600 border-white/5 cursor-not-allowed'}`}
                                >
                                    Add Device
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ─── Home Confirmation Modal ─────────────────── */}
            {
                showHomeConfirm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="glass-panel-elevated p-8 max-w-sm w-full text-center border border-white/10 animate-scale-in">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                                <IconCueHome className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Leave Session?</h3>
                            <p className="text-sm text-neutral-400 mb-8">Unsaved changes will be lost. Do you want to save this workspace before leaving?</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={async () => {
                                        const store = useSessionStore.getState();
                                        if (store.sessionId) {
                                            await SyncEngine.saveSession({
                                                id: store.sessionId,
                                                code: store.sessionCode || '000000',
                                                name: store.sessionName || 'Untitled Workspace',
                                                hostId: '', // host auth handled by RLS/SyncEngine currently
                                                devices: store.devices,
                                                cueStack: store.cueStack,
                                                presets: [],
                                                createdAt: new Date().toISOString()
                                            });
                                        }
                                        setShowHomeConfirm(false);
                                        setMode('home');
                                    }}
                                    className="w-full py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-400 transition-colors shadow-glow-accent"
                                >
                                    Save Workspace & Leave
                                </button>
                                <button
                                    onClick={() => {
                                        setShowHomeConfirm(false);
                                        setMode('home');
                                    }}
                                    className="w-full py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 border border-red-500/30 transition-colors"
                                >
                                    Leave Without Saving
                                </button>
                                <button
                                    onClick={() => setShowHomeConfirm(false)}
                                    className="w-full py-3 bg-transparent text-neutral-400 font-bold rounded-xl hover:text-white transition-colors mt-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* AI Copilot Panel */}
            {showAiCopilot && <AiCopilotPanel onClose={() => setShowAiCopilot(false)} />}
        </div >
    );
}


