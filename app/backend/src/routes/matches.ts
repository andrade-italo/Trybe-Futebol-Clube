import { Router } from 'express';
import LoginDataValidate from '../middleware/loginDataValidate';
import MatchesController from '../controller/matchesController';

const router: Router = Router();

const matches = new MatchesController();
const loginDataValidate = new LoginDataValidate();

router.get('/', matches.getMatches);
router.post('/', loginDataValidate.authToken, matches.createMatches);

export default router;
