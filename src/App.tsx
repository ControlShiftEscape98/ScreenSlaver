import { useModeStore } from './core/modeManager';
import HomeScreen from './ui/HomeScreen';
import ControllerDashboard from './ui/ControllerDashboard';
import ReceiverView from './ui/ReceiverView';
import QuickTools from './ui/QuickTools';

function App() {
    const { mode } = useModeStore();

    return (
        <div className="h-screen w-screen bg-surface-400 overflow-hidden">
            {mode === 'home' && <HomeScreen />}
            {mode === 'controller' && <ControllerDashboard />}
            {mode === 'receiver' && <ReceiverView />}
            {mode === 'quick-tools' && <QuickTools />}
        </div>
    );
}

export default App;
