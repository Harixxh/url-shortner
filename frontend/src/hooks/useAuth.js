import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Custom hook to redirect if user is not authenticated
 */
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return token;
};

/**
 * Custom hook to redirect if user is authenticated
 */
export const useRedirectIfAuth = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return !token;
};

/**
 * Custom hook for handling async operations with loading state
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle');
  const [value, setValue] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = React.useCallback(
    async (...args) => {
      setStatus('pending');
      setValue(null);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        setValue(response);
        setStatus('success');
        return response;
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    },
    [asyncFunction]
  );

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};
