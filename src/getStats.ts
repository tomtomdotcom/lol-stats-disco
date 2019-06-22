import { getKDA, getRoleInformation, getWinPercentage, getFriendStatistics } from './getHelpers';
import { messageBuilder } from './messageBuilder';
import { champions, queues } from './dataMaps';
const fetch = require('node-fetch');
const leagueApiUrl = 'https://euw1.api.riotgames.com/lol';
const leagueApiKey = process.env.LOL_API_KEY;

const requestUrl = 'summoner/v4/summoners/by-name';
const matchHistoryRequestUrl = 'match/v4/matchlists/by-account';
const matchRequestUrl = 'match/v4/matches';

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json ',
    'X-Riot-Token': leagueApiKey,
  },
};

const delay = ms => new Promise(res => setTimeout(res, ms));

export const getStats = async (message: any, command: string): Promise<any> => {
  let user = message.author.username;

  if (user === 'SteakZ') {
    user = 'steakzz';
  }

  if (user === 'sebas') {
    user = 'skryra';
  }

  if (user === 'Ponies') {
    user = 'RavingPonies';
  }

  if (user === 'Jboydilla') {
    user = 'mellicon';
  }

  // Get match history from league api
  console.log('Requesting Match History for user:', user);
  const result = await fetch(`${leagueApiUrl}/${requestUrl}/${user}`, options);
  const summonerInfo = await result.json();
  // message.channel.send(`I'm new to this so please bear with me, any issues @toomyloomy and he'll take a look.`);

  const usersLeagueId = summonerInfo.accountId;

  // Get their last few matches
  const matchHistoryResult = await fetch(`${leagueApiUrl}/${matchHistoryRequestUrl}/${usersLeagueId}?endIndex=20&beginIndex=0`, options);
  const matchHistory = await matchHistoryResult.json();
  const matchIds = matchHistory.matches.map(match => {
    return {
      id: match.gameId,
      championId: match.champion,
      championName: champions[match.champion],
      role: match.role,
      lane: match.lane,
      queueId: match.queue,
      queueType: queues[match.queue] || undefined,
    };
  });

  const chunks = 10;
  const chunkedMatchIds = matchIds.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunks);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  const chunkedGameHistory: any[] = await Promise.all(
    chunkedMatchIds.map(async chunk => {
      const history: any = await Promise.all(
        chunk.map(async games => {
          return { match: await getGameData(games.id), ...games };
        }),
      );
      return history;
    }),
  );

  // const gameHistory: any = await Promise.all(matchIds.map(games => getGameData(games.id)));
  const gameHistory: any = [].concat.apply([], chunkedGameHistory);
  const revampedGameHistory = gameHistory.map((history, index) => {
    if (!history || !history.match || !history.match.participants) {
      console.log({
        err: history,
        status: history.match.status,
      });
    }
    const matchObject = history.match.participants.filter(participant => participant.championId === matchIds[index].championId)[0];

    if (matchObject.stats.deaths === 0) {
      matchObject.stats.deaths = 1; // Cos /0 = infinity.
    }
    const KDA = (matchObject.stats.kills + matchObject.stats.assists) / matchObject.stats.deaths;
    const game = history.match;
    return {
      gameId: game.gameId,
      gameDuration: game.gameDuration,
      seasonId: game.seasonId,
      gameMode: game.gameMode,
      gameType: game.gameType,
      usersTeam: game.teams.filter(teams => teams.teamId === matchObject.teamId),
      enemyTeam: game.teams.filter(teams => teams.teamId !== matchObject.teamId),
      platformId: game.platformId,
      kda: KDA,
      championId: history.championId,
      championName: history.championName,
      role: history.role,
      lane: history.lane,
      queueType: history.queueType,
      gameParticpants: game.participants,
      gameParticipantsIdentities: game.participantIdentities,
    };
  });

  const kda = getKDA(revampedGameHistory).toFixed(2);
  const winPercentage = getWinPercentage(revampedGameHistory, revampedGameHistory.length);
  const roleInformation = getRoleInformation(revampedGameHistory);

  let statsWithFriends = getFriendStatistics(revampedGameHistory, user);
  statsWithFriends = statsWithFriends.filter(stats => stats.winPercentageWithName !== 'N/A');

  const sortedFriendStats = statsWithFriends.sort((a, b) => a.winPercentageWithName - b.winPercentageWithName);
  const worstFriend = sortedFriendStats[0];
  const bestFriend = sortedFriendStats.pop();

  let kdaStatswithFriends = getFriendStatistics(revampedGameHistory, user);
  const kdaStats = kdaStatswithFriends.filter(stats => stats.kdaInGamesWithName !== 'N/A').map(x => {
    return {
      name: x.name,
      kdaInGamesWithName: Number(x.kdaInGamesWithName)
    }
  });

  const kdaSortedFriends = kdaStats.sort((a, b) => a.kdaInGamesWithName - b.kdaInGamesWithName);
  const interFriend = kdaSortedFriends[0];
  const bloodThirstyFriend = kdaSortedFriends.pop();
  /**
   * Build the message to send...
   */
  const messageData = { user, kda, winPercentage, revampedGameHistory, roleInformation, bestFriend, worstFriend, bloodThirstyFriend, interFriend };

  message.channel.send(messageBuilder(command, messageData));
};

const getGameData = async id => {
  await delay(1250);
  const data = await fetch(`${leagueApiUrl}/${matchRequestUrl}/${id}`, options);
  return await data.json();
};
