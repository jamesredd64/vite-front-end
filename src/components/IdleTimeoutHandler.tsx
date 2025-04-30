import { useIdleTimer } from 'react-idle-timer';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const TIMEOUT_DURATION = 20 * 60 * 1000; // 20 minutes
const WARNING_DURATION = 5 * 60 * 1000;  // Show warning 5 minutes before timeoutS

export const IdleTimeoutHandler: React.FC = () => {
    const { logout, isAuthenticated } = useAuth0();
    const [isWarning, setIsWarning] = useState(false);
    // const savedTheme = localStorage.getItem('theme');

    const handleOnIdle = () => {
        if (!isAuthenticated) return;

        //const savedTheme = localStorage.getItem('theme');
    //   const userRole = localStorage.getItem('userRole');
      
      // Clear specific items instead of everything
    //   for (const key of Object.keys(localStorage)) {
    //     if (key !== 'theme' && key !== 'userRole') {
    //       localStorage.removeItem(key);
    //     }
    //   }
    //   sessionStorage.clear();
        

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
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-[9999]">
            <div 
                className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
                onClick={() => setIsWarning(false)}
            />
            <div className="relative z-[10000] w-full max-w-md mx-auto p-4">
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-500/15 rounded-full">
                                <svg 
                                    className="w-6 h-6 text-warning-500 dark:text-warning-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white/90 mb-2">
                                Session Timeout Warning
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Your session will expire in {Math.ceil(WARNING_DURATION / 60000)} minutes due to inactivity. 
                                Any unsaved changes will be lost.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        activate();
                                        setIsWarning(false);
                                    }}
                                    className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    Continue Session
                                </button>
                                <button
                                    onClick={handleOnIdle}
                                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:focus:ring-offset-gray-900"
                                >
                                    Logout Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
