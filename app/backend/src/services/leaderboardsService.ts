import { Op } from 'sequelize';
import Team from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';

class LeaderboardService {
  private dataTable = {
    totalPoints: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
  };

  private golsTime: string;
  private golsTimeAway: string;

  private conditionalFunction(teamMatch: any, id: number) {
    if (teamMatch.awayTeam === id) {
      this.golsTime = 'awayTeamGoals';
      this.golsTimeAway = 'homeTeamGoals';
    }
    if (teamMatch.homeTeam === id) {
      this.golsTime = 'homeTeamGoals';
      this.golsTimeAway = 'awayTeamGoals';
    }
  }

  private clearTable() {
    this.dataTable = {
      totalPoints: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
    };
  }

  private helper(arrayTeamsMatch: any, id: number) {
    this.clearTable();
    arrayTeamsMatch.forEach((teamMatch: any) => {
      this.conditionalFunction(teamMatch, id);
      this.dataTable.goalsFavor += teamMatch[this.golsTime];
      this.dataTable.goalsOwn += teamMatch[this.golsTimeAway];
      if (teamMatch[this.golsTime] > teamMatch[this.golsTimeAway]) {
        this.dataTable.totalPoints += 3;
        this.dataTable.totalVictories += 1;
      }
      if (teamMatch[this.golsTime] === teamMatch[this.golsTimeAway]) {
        this.dataTable.totalPoints += 1;
        this.dataTable.totalDraws += 1;
      }
      if (teamMatch[this.golsTime] < teamMatch[this.golsTimeAway]) this.dataTable.totalLosses += 1;
    });
    return this.dataTable;
  }

  private dataPoints = (arrayTeamsMatch: any, id: number, teamName: string) => {
    const dataTable = {
      name: teamName,
      totalGames: arrayTeamsMatch.length,
      ...this.helper(arrayTeamsMatch, id),
      goalsBalance: 0,
      efficiency: '',
    };

    dataTable.goalsBalance = dataTable.goalsFavor - dataTable.goalsOwn;
    dataTable.efficiency = ((dataTable.totalPoints / (dataTable.totalGames * 3)) * 100)
      .toFixed(2);

    return dataTable;
  };

  public getByQuery = async (homeOrAway?: string) => {
    const tabela: any = [];
    const allTeams = await Team.findAll();
    await Promise.all(allTeams.map(async ({ id, teamName }) => {
      const arrayTimesMatch = await Matches.findAll(
        (homeOrAway && { where: { inProgress: false, [homeOrAway]: id } })
        || { where: { inProgress: false, [Op.or]: { homeTeam: id, awayTeam: id } } },
      );
      tabela.push(this.dataPoints(arrayTimesMatch, id, teamName));
    }));

    return tabela.sort((a: any, b: any) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
    ));
  };
}

export default LeaderboardService;
