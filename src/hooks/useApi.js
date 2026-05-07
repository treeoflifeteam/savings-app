import { useState, useCallback } from "react";

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      onSuccess,
      onError,
      showErrorToast = true,
      successMessage,
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();

      if (successMessage) {
        // You can integrate with a toast notification system here
        console.log("Success:", successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "An unexpected error occurred";

      setError(errorMessage);

      if (showErrorToast) {
        // You can integrate with a toast notification system here
        console.error("API Error:", errorMessage);
      }

      if (onError) {
        onError(err);
      }

      throw err; // Re-throw so calling code can handle if needed
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    resetError,
  };
};

// Hook for form submissions with validation
export const useFormSubmit = (submitFn, options = {}) => {
  const { loading, error, execute, resetError } = useApiCall();

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = useCallback(
    async (formData) => {
      setFormErrors({});

      try {
        const result = await execute(() => submitFn(formData), options);
        return result;
      } catch (err) {
        // Handle validation errors from server
        if (err.response?.data?.errors) {
          const fieldErrors = {};
          err.response.data.errors.forEach((error) => {
            fieldErrors[error.field] = error.message;
          });
          setFormErrors(fieldErrors);
        }
        throw err;
      }
    },
    [execute, submitFn, options],
  );

  return {
    loading,
    error,
    formErrors,
    handleSubmit,
    resetError: () => {
      resetError();
      setFormErrors({});
    },
  };
};
