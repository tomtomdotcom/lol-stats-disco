export const processCommand = (message: any) => {
  const fullCommand = message.content.substr(1); // Remove the leading exclamation mark

  switch (fullCommand) {
    case 'mystats': {
      return getStats(message.author);
    }
  }
};

const getStats = (author: string): any => {};

const ratings = async (author: string) => {
  const rating = getTransformedRating(1400);
};

/*
The first step is to compute the transformed rating for each player or team:

R(1) = 10 ^ r(1)/400

*/
const getTransformedRating = (rating: Number): Number => {
  return Math.pow(10, Number(rating) / 400);
};
