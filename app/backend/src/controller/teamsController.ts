import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import TeamsService from '../services/teamsService';

class TeamsController {
  teamsService: TeamsService;

  constructor() {
    this.teamsService = new TeamsService();
  }

  public getAll = async (_req: Request, res: Response) => {
    const teamsResponse = await this.teamsService.getAll();
    return res.status(StatusCodes.OK).json(teamsResponse);
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const teamsResponse = await this.teamsService.getById(id);
    return res.status(StatusCodes.OK).json(teamsResponse);
  };
}

export default TeamsController;
