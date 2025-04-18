import { useIdleTimer } from 'react-idle-timer';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes
const WARNING_DURATION = 5 * 60 * 1000;  // Show warning 5 minutes before timeout

export const IdleTimeoutHandler: React.FC = () => {
    const { logout, isAuthenticated } = useAuth0();
    const [isWarning, setIsWarning] = useState(false);

    const handleOnIdle = () => {
        if (!isAuthenticated) return;

        // Clear any stored data
        localStorage.clear();
        sessionStorage.clear();

        // Preserve theme preference if needed
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            localStorage.setItem('theme', savedTheme);
        }

        // Logout and redirect
        logout({
            logoutParams: {
                returnTo: window.location.origin,
                clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            },
        });
    };

    const { start, reset, activate } = useIdleTimer({
        onIdle: handleOnIdle,
        onActive: () => setIsWarning(false),
        onPrompt: () => isAuthenticated && setIsWarning(true),
        timeout: TIMEOUT_DURATION,
        promptBeforeIdle: WARNING_DURATION,
        events: [
            'mousemove',
            'keydown',
            'wheel',
            'DOMMouseScroll',
            'mousewheel',
            'mousedown',
            'touchstart',
            'touchmove',
            'MSPointerDown',
            'MSPointerMove',
            'visibilitychange'
        ],
        debounce: 500
    });

    useEffect(() => {
        if (isAuthenticated) {
            start();
        } else {
            reset();
            setIsWarning(false);
        }
        
        return () => {
            reset();
        };
    }, [isAuthenticated, start, reset]);

    // Don't render anything if not authenticated or no warning
    if (!isAuthenticated || !isWarning) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
            <p className="font-semibold">Session Timeout Warning</p>
            <p className="text-sm">
                Your session will expire in {Math.ceil(WARNING_DURATION / 60000)} minutes due to inactivity.
            </p>
            <button
                onClick={() => {
                    activate();
                    setIsWarning(false);
                }}
                className="mt-2 bg-white text-red-500 px-4 py-1 rounded hover:bg-red-100"
            >
                Continue Session
            </button>
        </div>
    );
}
