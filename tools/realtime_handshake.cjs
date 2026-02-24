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

async function testHandshake() {
    console.log(`🚀 Starting Realtime Handshake Test...`);
    console.log(`Target: ${supabaseUrl}`);

    const channelId = `handshake-${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId, {
        config: {
            broadcast: { self: true }
        }
    });

    let start = Date.now();

    channel
        .on('broadcast', { event: 'ping' }, ({ payload }) => {
            const latency = Date.now() - payload.ts;
            console.log(`✅ Broadcast Received! Latency: ${latency}ms`);
            console.log(`Payload:`, payload);
            console.log(`\n🎉 HANDSHAKE SUCCESSFUL`);
            process.exit(0);
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`📡 Subscribed to channel: ${channelId}`);

                // Emit a ping to self
                console.log(`📤 Sending Ping...`);
                const ts = Date.now();
                const { error } = await channel.send({
                    type: 'broadcast',
                    event: 'ping',
                    payload: { msg: 'Hello from ScreenSlaver Tool', ts }
                });

                if (error) {
                    console.error(`❌ Send Error:`, error);
                    process.exit(1);
                }
            }
        });

    // Timeout
    setTimeout(() => {
        console.error('❌ Timeout: No broadcast response in 10s');
        process.exit(1);
    }, 10000);
}

testHandshake();
