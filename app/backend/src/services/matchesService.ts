import { Op } from 'sequelize';
import Team from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { IMatches } from '../interface/interfaces';

class MatchesService {
  public getByQuery = async (inProgress?: any) => {
    const matches = await Matches.findAll({
      where: inProgress && { inProgress: inProgress === 'true' },
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    return matches;
  };

  public createMatches = async (payload: { awayTeam: string, homeTeam: string }) => {
    const { awayTeam, homeTeam } = payload;

    if (homeTeam === awayTeam) {
      return { message: 'It is not possible to create a match with two equal teams' };
    }

    const finded = await Team.findOne({ where: { [Op.or]: [{ id: homeTeam }, { id: awayTeam }] } });

    if (!finded) return { message: 'There is no team with such id!' };

    const matches: IMatches = await Matches.create(payload);
    return matches;
  };

  public finishMatches = async (id: string) => {
    await Matches.update({ inProgress: false }, { where: { id } });
    return true;
  };

  public updateMatch = async (id: string, payload: any) => {
    await Matches.update({ ...payload }, { where: { id } });
    return true;
  };
}

export default MatchesService;
