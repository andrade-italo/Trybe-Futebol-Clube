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
    const matches = await Matches.create(payload);
    return matches;
  };

  public finishMatches = async (id: any) => {
    await Matches.update({ inProgress: false }, { where: { id } });
    return { message: 'Finished' };
  };
}

export default MatchesService;
