import { useRef } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    isFullscreen?: boolean;
    zIndex?: number; // Add this prop
  }
  
  export const Modal: React.FC<ModalProps> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOpen,
    onClose,
    children,
    className,
    showCloseButton = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFullscreen = false,
    zIndex = 9999, // Default z-index
  }) => {
    const modalRef = useRef<HTMLDivElement>(null);
  
    // ... other code ...
  
    const backdropZIndex = zIndex;
    const contentZIndex = zIndex + 1;
    const closeButtonZIndex = zIndex + 2;
  
    return (
      <div className={`fixed inset-0 flex items-center justify-center overflow-y-auto modal`} 
           style={{ zIndex: backdropZIndex }}>
        <div
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
          onClick={onClose}
          style={{ zIndex: backdropZIndex }}
        ></div>
        <div
          ref={modalRef}
          className={`relative mx-auto w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl dark:bg-gray-900 sm:p-6 ${className || ''}`}
          style={{ zIndex: contentZIndex }}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-3 top-3 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
              style={{ zIndex: closeButtonZIndex }}
            >
              {/* ... close button SVG ... */}
            </button>
          )}
          <div>{children}</div>
        </div>
      </div>
    );
  };
