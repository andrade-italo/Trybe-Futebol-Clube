import Teams from '../database/models/TeamsModel';

class TeamsService {
  public getAll = async () => {
    const teams = await Teams.findAll();
    return teams;
  };

  public getById = async (id: string) => {
    const teams = await Teams.findOne({ where: { id } });
    return teams;
  };
}

export default TeamsService;
