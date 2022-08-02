import Team from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';

class MatchesService {
  public getByQuery = async (inProgress: any) => {
    const matches = await Matches.findAll({
      where: inProgress && { inProgress: inProgress === 'true' },
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    return matches;
  };

  public createMatches = async (payload: any) => {
    const { awayTeam, homeTeam } = payload;

    if (homeTeam === awayTeam) {
      return { message: 'It is not possible to create a match with two equal teams' };
    }

    const findedHome = await Team.findOne({ where: { id: homeTeam } });
    const findedAway = await Team.findOne({ where: { id: awayTeam } });

    if (!findedHome || !findedAway) return { message: 'There is no team with such id!' };

    const matches = await Matches.create(payload);
    return matches;
  };

  public finishMatches = async (id: any) => {
    await Matches.update({ inProgress: false }, { where: { id } });
    return true;
  };

  public updateMatch = async (id: any, payload: any) => {
    await Matches.update({ ...payload }, { where: { id } });
    return true;
  };
}

export default MatchesService;
