// Get win % from last 10 games.
export const getWinPercentage = (games: any, gamesPlayed?: any): any => {
  const played = gamesPlayed;
  const wins = games.filter(games => games.usersTeam[0].win === 'Win');
  const numberOfWins = wins.length;

  return ((numberOfWins / played) * 100).toFixed();
};

export const getKDA = (games: any): any => {
  return games.map(game => game.kda).reduce((a, b) => a + b, 0) / games.length;
};

export const getRoleInformation = (games: any): any => {
  const topLaneGames = games.filter(game => game.lane === 'TOP');
  const jungleGames = games.filter(game => game.lane === 'JUNGLE');
  const midLaneGames = games.filter(game => game.lane === 'MID');
  const adcGames = games.filter(game => game.lane === 'BOTTOM');
  const supportGames = games.filter(game => game.lane === 'SUPPORT');
  const unknownGames = games.filter(game => game.lane === 'NONE');

  const getStatsFromGames = games => {
    if (games.length < 1) {
      return {
        gamesPlayed: 0,
        kda: 'N/A',
        winPercentage: 'N/A',
      };
    }

    const gamesPlayed = games.length;
    const kda = getKDA(games).toFixed(2);
    const winPercentage = `${getWinPercentage(games, gamesPlayed)}%`;

    return {
      gamesPlayed,
      kda,
      winPercentage,
    };
  };

  const topLaneStats = getStatsFromGames(topLaneGames);
  const jungleStats = getStatsFromGames(jungleGames);
  const midLaneStats = getStatsFromGames(midLaneGames);
  const adcStats = getStatsFromGames(adcGames);
  const supportStats = getStatsFromGames(supportGames);
  const unknownStats = getStatsFromGames(unknownGames);

  return {
    top: topLaneStats,
    jungle: jungleStats,
    mid: midLaneStats,
    bottom: adcStats,
    support: supportStats,
    unknown: unknownStats,
  };
};

export const getFriendStatistics = (games, user) => {
  let listOfUs = ['steakzz', 'RavingPonies', 'Toomyloomy', 'skryra', 'mellicon', 'Philvester', 'Peplexus'];
  listOfUs = listOfUs.filter(name => name !== user);
  return listOfUs.map(name => {
    const gamesWithName = games.filter(game => game.gameParticipantsIdentities.find(id => id.player.summonerName === name));
    const winPercentageWithName = getWinPercentage(gamesWithName, gamesWithName.length);
    const kdaInGamesWithName = getKDA(gamesWithName).toFixed(2) || 0;

    if (gamesWithName.length < 1) {
      return {
        winPercentageWithName: 'N/A',
        kdaInGamesWithName: 'N/A',
        name,
      };
    } else {
      return {
        winPercentageWithName,
        kdaInGamesWithName,
        name,
      };
    }
  });
};
