import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '../components/Snackbar';

const SnackbarContext = createContext({
  showSnackbar: () => {},
  hideSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    title: '',
    variant: 'info',
    autoHideDuration: 6000,
    position: 'bottom-center',
  });

  const showSnackbar = useCallback((options) => {
    setSnackbar({
      open: true,
      ...options,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const value = {
    showSnackbar,
    hideSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        title={snackbar.title}
        message={snackbar.message}
        variant={snackbar.variant}
        autoHideDuration={snackbar.autoHideDuration}
        position={snackbar.position}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext; 