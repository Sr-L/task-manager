export function createAuthMiddleware(jwtService) {
  return function authMiddleware(req, res, next) {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
      const payload = jwtService.verifyToken(token);
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
}
