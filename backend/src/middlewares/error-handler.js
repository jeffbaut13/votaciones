export function errorHandler(error, _request, response, _next) {
  void _next;
  console.error(`[Error] ${error.message}`);
  response.status(error.status || 400).json({
    message: error.message || "Error inesperado en el servidor.",
  });
}
