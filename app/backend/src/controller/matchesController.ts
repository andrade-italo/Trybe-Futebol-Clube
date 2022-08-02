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

    const matchesResponse: any = await this.matchesService.createMatches(payload);

    if (matchesResponse.message) {
      const sameTeam = matchesResponse.message.match(/two equal/i);
      if (sameTeam) return res.status(StatusCodes.UNAUTHORIZED).json(matchesResponse);

      return res.status(StatusCodes.NOT_FOUND).json(matchesResponse);
    }

    return res.status(StatusCodes.CREATED).json(matchesResponse);
  };

  public finishMatch = async (req: Request, res: Response) => {
    const { id } = req.params;

    const matchesResponse = await this.matchesService.finishMatches(id);
    if (!matchesResponse) {
      return res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: 'Not created' });
    }
    return res.status(StatusCodes.OK).json({ message: 'Finished' });
  };
}

export default MatchesController;
