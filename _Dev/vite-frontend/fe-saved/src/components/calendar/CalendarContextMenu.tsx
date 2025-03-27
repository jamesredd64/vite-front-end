import React from 'react';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  onDelete?: () => void;
  onAdd?: () => void;
  onClose: () => void;
  mode: 'event' | 'grid';
}

export interface CalendarContextMenuState {
  showContextMenu: boolean;
  contextMenuPosition: ContextMenuPosition;
  contextMenuEventId: string | null;
  contextMenuMode: 'event' | 'grid';
  selectedDate: string;
}

export const CalendarContextMenu: React.FC<ContextMenuProps> = ({ 
  x, 
  y, 
  onDelete, 
  onAdd, 
  onClose, 
  mode 
}) => {
  return (
    <div 
      className="fixed bg-white shadow-lg rounded-md py-2 z-50 context-menu dark:bg-gray-800"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        minWidth: '150px'
      }}
    >
      {mode === 'event' && (
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600 dark:hover:bg-gray-700 dark:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          Delete Event
        </button>
      )}
      {mode === 'grid' && (
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm dark:hover:bg-gray-700 dark:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
        >
          Add Event
        </button>
      )}
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm dark:hover:bg-gray-700 dark:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Close
      </button>
    </div>
  );
};

export const useCalendarContextMenu = () => {
  const [state, setState] = React.useState<CalendarContextMenuState>({
    showContextMenu: false,
    contextMenuPosition: { x: 0, y: 0 },
    contextMenuEventId: null,
    contextMenuMode: 'event',
    selectedDate: '',
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element && 
          !event.target.closest('.context-menu')) {
        setState(prev => ({ ...prev, showContextMenu: false }));
      }
    };

    if (state.showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [state.showContextMenu]);

  const handleEventRightClick = (info: {
    jsEvent: MouseEvent;
    event: {
      id: string;
      title: string;
      extendedProps: {
        calendar: string;
      };
    };
  }) => {
    info.jsEvent.preventDefault();
    const event = info.event;
    
    console.log('[Calendar] Right click event:', {
      id: event.id,
      title: event.title
    });
    
    setState(prev => ({
      ...prev,
      contextMenuEventId: event.id,
      contextMenuMode: 'event',
      contextMenuPosition: {
        x: info.jsEvent.clientX,
        y: info.jsEvent.clientY,
      },
      showContextMenu: true,
    }));
  };

  const handleDateRightClick = (info: { dateStr: string; jsEvent: MouseEvent }) => {
    info.jsEvent.preventDefault();
    console.log('[Calendar] Right click on date:', info.dateStr);
    
    setState(prev => ({
      ...prev,
      selectedDate: info.dateStr,
      contextMenuMode: 'grid',
      contextMenuPosition: {
        x: info.jsEvent.clientX,
        y: info.jsEvent.clientY,
      },
      showContextMenu: true,
    }));
  };

  const closeContextMenu = () => {
    setState(prev => ({ ...prev, showContextMenu: false }));
  };

  return {
    state,
    handleEventRightClick,
    handleDateRightClick,
    closeContextMenu,
  };
};