import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardsService';

class MatchesController {
  leaderboardService: LeaderboardService;

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  public getHomeOrAway = async (req: Request, res: Response) => {
    const homeOrAway = `${(req.url).slice(1)}Team`;
    const matchesResponse = await this.leaderboardService.getByQuery(homeOrAway);
    return res.status(StatusCodes.OK).json(matchesResponse);
  };

  public getAllLeaderbord = async (req: Request, res: Response) => {
    const matchesResponse = await this.leaderboardService.getByQuery();
    return res.status(StatusCodes.OK).json(matchesResponse);
  };
}

export default MatchesController;
