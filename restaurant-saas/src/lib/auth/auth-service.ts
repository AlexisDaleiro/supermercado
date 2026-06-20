import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from './password';
import { generateAccessToken, generateRefreshToken, JWTPayload } from './jwt';
import { Role } from '@prisma/client';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  restaurantName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await hashPassword(input.password);

  // Crear restaurante si no se proporciona ID
  let restaurantId: string | undefined;
  
  if (input.restaurantName) {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: input.restaurantName,
        email: input.email,
      },
    });
    restaurantId = restaurant.id;
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: restaurantId ? Role.OWNER : Role.EMPLOYEE,
      restaurantId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      restaurantId: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          currency: true,
          timezone: true,
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials or inactive account');
  }

  const isValidPassword = await verifyPassword(input.password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Actualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  // Guardar refresh token en DB
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Eliminar password del response
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export async function logoutUser(userId: string, refreshToken: string) {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      token: refreshToken,
    },
  });
}

export async function refreshAccessToken(refreshToken: string) {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          restaurantId: true,
          isActive: true,
        },
      },
    },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  if (!storedToken.user.isActive) {
    throw new Error('Account is inactive');
  }

  const payload: JWTPayload = {
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
    restaurantId: storedToken.user.restaurantId,
  };

  const newAccessToken = await generateAccessToken(payload);

  return newAccessToken;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          logo: true,
          currency: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getCurrentUser(userId: string) {
  return getUserById(userId);
}
