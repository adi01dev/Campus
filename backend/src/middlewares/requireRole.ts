import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (role: 'Admin' | 'Faculty' | 'Student' | Array<string>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthenticated' });

    const allowed = Array.isArray(role) ? role : [role];
    // console.log(`User Role: ${user.role}, Allowed: ${allowed}`); // Debug log

    if (!allowed.includes(user.role)) {
      console.error(`Access denied. User role: ${user.role}, Required: ${allowed}`);
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};
