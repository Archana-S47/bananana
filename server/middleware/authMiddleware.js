export function protect(_req, res, _next) {
  res.status(501).json({
    message: 'JWT authentication middleware is not implemented yet',
  });
}

export function authorize(...roles) {
  return (_req, res, _next) => {
    res.status(501).json({
      message: 'Role authorization middleware is not implemented yet',
      roles,
    });
  };
}
