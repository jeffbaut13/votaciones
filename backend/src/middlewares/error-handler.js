export function errorHandler(error, _request, response, _next) {
  void _next;
  response.status(400).json({
    message: error.message || "Unexpected server error",
  });
}
