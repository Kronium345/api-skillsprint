import { Router } from 'express';

import {
  getChallengesBadges,
  getChallengesDefinitions,
  getChallengesLeaderboard,
  getChallengesOverview,
  getChallengesSummary,
  getChallengesUserBadges,
  recomputeChallenges,
} from '../controllers/challenges.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/summary', getChallengesSummary);
router.get('/definitions', getChallengesDefinitions);
router.get('/user-badges', getChallengesUserBadges);
router.post('/recompute', recomputeChallenges);

// Backward-compatible aliases.
router.get('/overview', getChallengesOverview);
router.get('/badges', getChallengesBadges);
router.get('/leaderboard', getChallengesLeaderboard);
router.get('/course-leaderboard', getChallengesLeaderboard);

export default router;
