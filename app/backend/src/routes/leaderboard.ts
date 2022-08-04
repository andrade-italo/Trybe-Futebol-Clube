import { Router } from 'express';
import LeaderboardController from '../controller/leaderboardController';
// import LoginDataValidate from '../middleware/loginDataValidate';

const router: Router = Router();

const leaderboard = new LeaderboardController();
// const loginDataValidate = new LoginDataValidate();

router.get('/home', leaderboard.getHomeOrAway);
router.get('/away', leaderboard.getHomeOrAway);
router.get('/', leaderboard.getAllLeaderbord);

export default router;
