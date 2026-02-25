import { useEffect } from 'react';
import { useModeStore } from './core/modeManager';
import { useAuthStore } from './core/authManager';
import HomeScreen from './ui/HomeScreen';
import ControllerDashboard from './ui/ControllerDashboard';
import ReceiverView from './ui/ReceiverView';
import QuickTools from './ui/QuickTools';

import ProjectGateway from './ui/ProjectGateway';
import { CloudDiagnosticOverlay } from './ui/components/CloudDiagnosticOverlay';
import SimulatorSandbox from './ui/sandbox/SimulatorSandbox';

function App() {
    const { mode, setMode } = useModeStore();
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();

        // Hidden sandbox access for developers
        const params = new URLSearchParams(window.location.search);
        if (params.get('sandbox') === 'true') {
            setMode('sandbox');
        }
    }, [initialize, setMode]);

    return (
        <div className="h-screen w-screen bg-surface-400 overflow-hidden">
            {mode === 'home' && <HomeScreen />}
            {mode === 'project-gateway' && <ProjectGateway />}
            {mode === 'controller' && <ControllerDashboard />}
            {mode === 'receiver' && <ReceiverView />}
            {mode === 'quick-tools' && <QuickTools />}
            {mode === 'sandbox' && <SimulatorSandbox />}
            <CloudDiagnosticOverlay />
        </div>
    );
}

export default App;
