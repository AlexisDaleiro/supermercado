import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './jwt';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
  restaurantId?: string | null;
}

export async function getCurrentUserFromRequest(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as Role,
      restaurantId: payload.restaurantId,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export function hasRole(user: AuthenticatedUser, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(user.role);
}

export function hasPermission(
  user: AuthenticatedUser,
  requiredRole: Role
): boolean {
  const roleHierarchy: Record<Role, number> = {
    SUPER_ADMIN: 5,
    OWNER: 4,
    MANAGER: 3,
    EMPLOYEE: 2,
    CASHIER: 1,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

export async function authMiddleware(
  request: NextRequest,
  allowedRoles?: Role[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);

  if (allowedRoles && !hasRole(user, allowedRoles)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return user;
}
