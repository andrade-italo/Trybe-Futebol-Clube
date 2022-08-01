import { Router } from 'express';
import MatchesController from '../controller/matchesController';

const router: Router = Router();

const matches = new MatchesController();

router.get('/', matches.getMatches);

export default router;
