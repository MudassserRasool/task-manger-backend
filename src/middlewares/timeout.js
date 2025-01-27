const timeout = (timeoutDuration) => {
  return (req, res, next) => {
    // Set a timeout for the request
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res
          .status(503)
          .json({ message: 'Request timeout. Please try again later.' });
      }
    }, timeoutDuration);

    // Override res.end to clear the timeout if response is sent before timeout
    const originalEnd = res.end;
    res.end = (...args) => {
      clearTimeout(timeoutId); // Clear the timeout if the response is being sent
      originalEnd.apply(res, args); // Call the original end method
    };

    next();
  };
};

export default timeout;
