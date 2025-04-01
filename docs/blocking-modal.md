# Implementing Blocking Modal for Unsaved Changes

## Suggested Fixes:
### 1. Simplify State Management for Navigation and Modal:
### Currently, you are using both isBlockingModalOpen and pendingNavigation. You can streamline this by combining their logic into a single state or ensuring ### pendingNavigation is cleared when no navigation is pending.

## Replace:
```

const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
```
## With:

const [navigationState, setNavigationState] = useState({
  isModalOpen: false,
  path: null,
});

```

## 2. Ensure Reliable Cleanup:
### The useEffect for window.beforeunload doesn't remove its listener properly in every scenario. Make sure the cleanup function is always run.


```
## Replace:
```
return () => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
};
```
## With:
```
return function cleanup() {
  window.removeEventListener('beforeunload', handleBeforeUnload);
};
``` 
## 3. Improve Change Detection Logic:
## The use of JSON.stringify() for change detection might fail for nested objects or data with cyclic references. Consider using a deep comparison function like lodash.isEqual.

## Add the dependency:

## npm install lodash.isequal
### Update your useEffect:

```
import isEqual from 'lodash.isequal';

// Use isEqual for comparison
const hasChanges = !isEqual(initialUserData, userData);
setHasUnsavedChanges(hasChanges);
```

## 4. Refactor Modal Handlers for Better Readability:
### The modal handlers (handleConfirmSave and handleDiscardChanges) have overlapping logic. You can consolidate them into a utility function.

```
Example:

const performNavigation = async (saveChanges = false) => {
  if (saveChanges) {
    try {
      await handleSubmit({ preventDefault: () => {} });
    } catch (error) {
      console.error('Error saving changes:', error);
      return;
    }
  }
  setHasUnsavedChanges(false);
  setNavigationState({ isModalOpen: false, path: null });
  if (navigationState.path) {
    navigate(navigationState.path);
  }
};
```
### Update your modal handlers:
#### Use it in the modal:

```

<UnsavedChangesModal
  isOpen={navigationState.isModalOpen}
  onConfirm={() => performNavigation(true)}
  onDiscard={() => performNavigation(false)}
  onClose={() => setNavigationState({ ...navigationState, isModalOpen: false })}
/>
```

## 5. Enhance Logging:
### Your console logging is helpful, but certain areas (e.g., console.log in useEffect) should only log if debug mode is enabled.

## Create a utility logger:

```
const logger = (message, data) => {
  if (process.env.REACT_APP_DEBUG === "true") {
    console.log(message, data);
  }
};
```
## Use it like:

```
logger("Change detection:", { hasChanges, current: cleanCurrent, initial: cleanInitial });
```

6. Optimize Re-Rendering:
### Avoid unnecessary re-renders by memoizing components like UserMetaCard using React.memo. Example:

```
const UserMetaCard = React.memo(({ onUpdate, initialData }) => {
  // Your component logic
});
```

## Final Notes:
### These refinements should improve the efficiency and maintainability of your code while ensuring a smoother user experience. Let me know if you'd like tailored examples for specific parts of the component or additional clarifications!