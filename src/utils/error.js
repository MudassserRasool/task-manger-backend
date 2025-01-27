class ExceptionHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  static BadRequest(message = 'Bad Request') {
    return ExceptionHandler._throw(message, 400);
  }

  static Unauthorized(message = 'Unauthorized') {
    return ExceptionHandler._throw(message, 401);
  }

  static Forbidden(message = 'Forbidden') {
    return ExceptionHandler._throw(message, 403);
  }

  static NotFound(message = 'Not Found') {
    return ExceptionHandler._throw(message, 404);
  }

  static MethodNotAllowed(message = 'Method Not Allowed') {
    return ExceptionHandler._throw(message, 405);
  }

  static Conflict(message = 'Conflict') {
    return ExceptionHandler._throw(message, 409);
  }

  static UnprocessableEntity(message = 'Unprocessable Entity') {
    return ExceptionHandler._throw(message, 422);
  }

  static InternalServerError(message = 'Internal Server Error') {
    return ExceptionHandler._throw(message, 500);
  }
  // use case: when a feature is not implemented yet and the user tries to access it
  static NotImplemented(message = 'Not Implemented') {
    return ExceptionHandler._throw(message, 501);
  }

  static ServiceUnavailable(message = 'Service Unavailable') {
    return ExceptionHandler._throw(message, 503);
  }

  // Helper method to throw the error directly
  static _throw(message, statusCode) {
    throw new ExceptionHandler(message, statusCode);
  }
}

export default ExceptionHandler;
