import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';

class MatchesController {
  matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService();
  }

  public getMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    const matchesResponse = await this.matchesService.getByQuery(inProgress);
    return res.status(StatusCodes.OK).json(matchesResponse);
  };

  public createMatches = async (req: Request, res: Response) => {
    const payload = req.body;

    const matchesResponse = await this.matchesService.createMatches(payload);
    return res.status(StatusCodes.CREATED).json(matchesResponse);
  };
}

export default MatchesController;
