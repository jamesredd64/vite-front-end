import { useContext, useCallback } from 'react';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  const navigate = useNavigate();

  const navigateWithGuard = useCallback((to: string) => {
    if (!context) {
      throw new Error('useNavigation must be used within a NavigationProvider');
    }

    const canNavigate = context.handleNavigation(to);
    if (canNavigate) {
      navigate(to, { replace: false });
    }
    return canNavigate;
  }, [context, navigate]);

  return {
    ...context,
    navigate: navigateWithGuard
  };
};
