export const messageBuilder = (type, data) => {
  switch (type) {
    case 'mystats':
      return statsMessage(data);
  }
};

const statsMessage = data => {
  const user = data.user;
  const winPercentage = data.winPercentage;
  const revampedGameHistory = data.revampedGameHistory;
  const kda = data.kda;
  const roleInformation = data.roleInformation;
  const bestFriend = data.bestFriend;
  const worstFriend = data.worstFriend;
  const bloodThirstyFriend = data.bloodThirstyFriend;
  const interFriend = data.interFriend;

  return `
 ${user} won ${winPercentage}% of his last ${revampedGameHistory.length} games with a KDA of ${kda}.
 ${"```"}
 +---------+--------------+-------+------+
 | Lane    | Games Played | Win % | KDA  |
 +---------+--------------+-------+------+
 ${
    roleInformation.top.gamesPlayed > 0
      ? `
 | Top     | ${roleInformation.top.gamesPlayed}            | ${formatPercent(roleInformation.top.winPercentage)}  | ${roleInformation.top.kda} |
 +---------+--------------+-------+------+
 `
      : ''
    }${
    roleInformation.jungle.gamesPlayed > 0
      ?
      `
 | Jungle  | ${roleInformation.jungle.gamesPlayed}            | ${formatPercent(roleInformation.jungle.winPercentage)}  | ${roleInformation.jungle.kda} |
 +---------+--------------+-------+------+
   `
      : ''
    }${
    roleInformation.mid.gamesPlayed > 0
      ? `
 | Mid     | ${roleInformation.mid.gamesPlayed}            | ${formatPercent(roleInformation.mid.winPercentage)}  | ${roleInformation.mid.kda} |
 +---------+--------------+-------+------+
   `
      : ''
    }${
    roleInformation.bottom.gamesPlayed > 0
      ? `
 | Bottom  | ${roleInformation.bottom.gamesPlayed}            | ${formatPercent(roleInformation.bottom.winPercentage)}  | ${roleInformation.bottom.kda} |
 +---------+--------------+-------+------+
   `
      : ''
    }${
    roleInformation.support.gamesPlayed > 0
      ? `
 | Support  | ${roleInformation.support.gamesPlayed}            | ${formatPercent(roleInformation.support.winPercentage)}  | ${roleInformation.support.kda} |
 +---------+--------------+-------+------+
   `
      : ''
    }${
    roleInformation.unknown.gamesPlayed > 0
      ? `
 | Unknown | ${roleInformation.unknown.gamesPlayed}            | ${formatPercent(roleInformation.unknown.winPercentage)}  | ${roleInformation.unknown.kda} |
 +---------+--------------+-------+------+
   `
      : ''
    }${"```"}

  **Best Friend** :heart:
  ${user} wins ${bestFriend!.winPercentageWithName}% of his games (${bestFriend.numberOfGames}) with ${bestFriend!.name}.
  with a KDA of ${bestFriend!.kdaInGamesWithName}.

  **Worst Friend** :sob:
  ${user} only wins ${worstFriend!.winPercentageWithName}% of his games (${worstFriend.numberOfGames}) with ${worstFriend!.name}.
  with only a KDA of ${worstFriend!.kdaInGamesWithName}.

  **Bloodthirsty** :crossed_swords: 
  ${user} has the highest KDA when playing with ${bloodThirstyFriend!.name} with a KDA of ${bloodThirstyFriend!.kdaInGamesWithName.toFixed(2)}

  **Inter** :skull:
  ${user} has the lowest KDA when playing with ${interFriend!.name} with a KDA of ${interFriend!.kdaInGamesWithName.toFixed(2)}
 `;
};


const formatPercent = (percent): string => {
  if (percent.length === 2) {
    return `${percent}  `;
  } else if (percent.length === 3) {
    return `${percent} `;
  } else {
    return `${percent}`;
  }
}