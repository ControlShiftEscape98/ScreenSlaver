// Global error tracker for UI feedback
let lastFullscreenError: string | null = null;

export const getFullscreenError = () => lastFullscreenError;
export const clearFullscreenError = () => { lastFullscreenError = null; };

/**
 * Robust cross-browser fullscreen toggle utility.
 * Adheres to strict "One-Shot" gesture rules to prevent browser blocking.
 */
export const toggleFullscreen = () => {
    const d = document as any;
    const root = document.documentElement as any;
    lastFullscreenError = null;

    // 1. Check if fullscreen is even enabled at the browser level
    const isEnabled = d.fullscreenEnabled || d.webkitFullscreenEnabled || d.mozFullScreenEnabled || d.msFullscreenEnabled;
    if (isEnabled === false) {
        lastFullscreenError = "Browser/OS blocks Fullscreen (fullscreenEnabled=false)";
        console.error("[ScreenSlaver]", lastFullscreenError);
        return false;
    }

    // 2. Check current state
    const isFullscreen = !!(d.fullscreenElement || d.webkitFullscreenElement || d.webkitIsFullScreen || d.mozFullScreenElement || d.msFullscreenElement);

    if (!isFullscreen) {
        // 3. PRE-IDENTIFY the best method (Do NOT call yet)
        // Order: Standard -> Webkit (Lower) -> Webkit (Upper) -> Moz -> MS
        const method = root.requestFullscreen ||
            root.webkitRequestFullscreen ||
            root.webkitRequestFullScreen ||
            root.mozRequestFullScreen ||
            root.msRequestFullscreen;

        if (method) {
            console.log(`[ScreenSlaver] Target found. Executing ONE-SHOT request via: ${method.name || 'vendor-method'}`);
            try {
                // 4. EXECUTE Exactly once per gesture
                const result = method.call(root);

                if (result instanceof Promise) {
                    result.catch((e: any) => {
                        lastFullscreenError = `Browser Blocked: ${e.message || String(e)}`;
                        console.error("[ScreenSlaver] Fullscreen Promise Rejected:", e);
                    });
                }
                return true;
            } catch (e: any) {
                lastFullscreenError = `Execution Error: ${e.message || String(e)}`;
                console.error("[ScreenSlaver] Fullscreen Execution Error:", e);
            }
        } else {
            lastFullscreenError = "No compatible Fullscreen method found on this device";
        }
    } else {
        // EXIT logic - also one-shot
        const exitMethod = d.exitFullscreen || d.webkitExitFullscreen || d.webkitCancelFullScreen || d.mozCancelFullScreen || d.msExitFullscreen;
        if (exitMethod) {
            try {
                exitMethod.call(d);
                return false;
            } catch (e: any) {
                console.error("[ScreenSlaver] Exit Error:", e);
            }
        }
    }
    return false;
};

export const isFullscreenSupported = () => {
    const d = document as any;
    return !!(d.fullscreenEnabled || d.webkitFullscreenEnabled || d.mozFullScreenEnabled || d.msFullscreenEnabled);
};
