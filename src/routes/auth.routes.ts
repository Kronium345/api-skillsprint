import bcrypt from 'bcryptjs';
import { Router } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { requireAuth, signToken } from '../middleware/auth';
import { User } from '../models/User';
import { fail, ok, serverError } from '../utils/apiResponse';
import { serializeUser } from '../utils/serializeUser';

const router = Router();

const MIN_PASSWORD_LENGTH = 8;

function defaultUsername(email: string, username?: string): string {
  const trimmed = typeof username === 'string' ? username.trim() : '';
  if (trimmed) return trimmed;
  const local = email.split('@')[0]?.replace(/[^a-zA-Z0-9_-]/g, '_') || 'user';
  return local.slice(0, 30) || 'user';
}

router.post('/signup', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      subscriptionPlan,
      careerGoal,
      experienceLevel,
      targetRole,
    } = req.body;

    if (!email || !password) {
      return fail(res, 'email and password are required');
    }

    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return fail(res, `password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (!normalizedEmail.includes('@')) {
      return fail(res, 'email must be valid');
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return fail(res, 'Email already registered', 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: defaultUsername(normalizedEmail, username),
      email: normalizedEmail,
      password: hashed,
      subscriptionPlan: subscriptionPlan ?? 'free',
      careerGoal: careerGoal ?? '',
      experienceLevel: experienceLevel ?? '',
      targetRole: targetRole ?? '',
    });

    const token = signToken(user._id.toString());
    return ok(res, { token, user: serializeUser(user) }, 201);
  } catch (error) {
    return serverError(res, error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 'email and password are required');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return fail(res, 'Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return fail(res, 'Invalid credentials', 401);

    user.lastActiveAt = new Date();
    await user.save();

    const token = signToken(user._id.toString());
    return ok(res, { token, user: serializeUser(user) });
  } catch (error) {
    return serverError(res, error);
  }
});

router.get('/get-profile', requireAuth, (req: AuthRequest, res) => {
  return ok(res, serializeUser(req.user!));
});

router.post('/update-career-profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { careerGoal, experienceLevel, targetRole } = req.body;
    const user = req.user!;
    if (careerGoal !== undefined) user.careerGoal = careerGoal;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (targetRole !== undefined) user.targetRole = targetRole;
    await user.save();
    return ok(res, serializeUser(user));
  } catch (error) {
    return serverError(res, error);
  }
});

export default router;
