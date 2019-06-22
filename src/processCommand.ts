import { getStats } from './getStats';
export const processCommand = (message: any) => {
  const fullCommand = message.content.substr(1); // Remove the leading exclamation mark
  switch (fullCommand) {
    case 'mystats': {
      return getStats(message, fullCommand);
    }
  }
};
