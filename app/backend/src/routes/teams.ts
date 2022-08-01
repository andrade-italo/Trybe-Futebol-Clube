import { Router } from 'express';
import TeamsController from '../controller/teamsController';

const router: Router = Router();

const teams = new TeamsController();

router.get('/', teams.getAll);
router.get('/:id', teams.getById);

export default router;
