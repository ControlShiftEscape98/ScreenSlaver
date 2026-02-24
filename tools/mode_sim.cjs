const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MODES = {
    lockdown: {
        currentApp: 'lock',
        screenLocked: true,
        displayTool: null,
        displayToolGrid: null,
        displayToolMarkers: false
    },
    scanning: {
        currentApp: 'custom',
        screenLocked: false,
        displayTool: 'calibration-grid',
        displayToolGrid: 'crosshair',
        displayToolMarkers: true
    },
    technical: {
        currentApp: 'custom',
        screenLocked: false,
        displayTool: 'smpte-bars',
        displayToolGrid: null,
        displayToolMarkers: false
    },
    home: {
        currentApp: 'home',
        screenLocked: false,
        displayTool: null,
        displayToolGrid: null,
        displayToolMarkers: false
    }
};

async function simulateMode(sessionId, modeName) {
    const mode = MODES[modeName.toLowerCase()];
    if (!mode) {
        console.error(`❌ Unknown mode: ${modeName}`);
        console.log('Available modes:', Object.keys(MODES).join(', '));
        process.exit(1);
    }

    console.log(`🚀 Simulating [${modeName.toUpperCase()}] for session: ${sessionId}`);

    const channel = supabase.channel(`session:${sessionId}`);

    channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            console.log(`📡 Connected to session channel...`);

            const payload = {
                type: 'global_mode_shift',
                mode: modeName,
                state: mode,
                ts: Date.now()
            };

            const { error } = await channel.send({
                type: 'broadcast',
                event: 'mode_shift',
                payload
            });

            if (error) {
                console.error('❌ Broadcast Error:', error);
                process.exit(1);
            }

            console.log('✅ Global Mode Shift Broadcasted!');
            console.log('Payload:', payload);

            // Exit after a short delay to ensure broadcast is sent
            setTimeout(() => process.exit(0), 1000);
        }
    });

    // Timeout
    setTimeout(() => {
        console.error('❌ Timeout connecting to channel');
        process.exit(1);
    }, 10000);
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node tools/mode_sim.cjs <session_id> <mode_name>');
    console.log('Example: node tools/mode_sim.cjs some-uuid-here lockdown');
    process.exit(1);
}

simulateMode(args[0], args[1]);
