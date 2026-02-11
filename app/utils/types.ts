export type PlayerSessionRow = {
  playerId: number;
  name: string | null;
  playerPoints: number | null;
};

export type PlayerSession = {
  id: number;
  gameName: string;
  points: number | null;
  isWinner: boolean;
  date: Date;
};

export type PlayerWithStats = {
  id: number;
  name: string;
  sessions: PlayerSession[];
  // Include other player fields like email, avatar, etc.
};
