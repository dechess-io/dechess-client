export interface Match {
  matchNumber: number
  playerOne: { address: string; score: number }
  playerTwo: { address: string; score: number }
  winner: number
}
export interface Round {
  roundName: string
  matches: Match[]
}

export interface Standings {
  rank: string
  address: string
  totalWin: number
  totalLose: number
  pts: number
}

export interface Tournament {
  id: string
  name: string
  totalPlayer: string
  prize: string
  totalView: string
  date: string
  volume: string
  rounds: Round[]
  standings: Standings[]
}

// Mock data - replace this with your actual data
export const mockTournament: Tournament[] = [
  {
    id: '1',
    name: 'Queen Cup',
    totalPlayer: '8',
    prize: '$1000',
    totalView: '1042',
    date: 'Jan 31 2024',
    volume: '$1,050.32',
    rounds: [
      {
        roundName: 'Quarterfinals',
        matches: [
          {
            matchNumber: 1,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZyfsa2', score: 2 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZykfSa', score: 0 },
            winner: 1,
          },
          {
            matchNumber: 2,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZymfSA', score: 2 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZyPo9N', score: 1 },
            winner: 1,
          },
          {
            matchNumber: 3,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZy6L2Sm', score: 1 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZRsm2', score: 2 },
            winner: 2,
          },
          {
            matchNumber: 4,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZy2mKl', score: 0 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZy47Hs', score: 0 },
            winner: 0,
          },
        ],
      },
      {
        roundName: 'Semifinals',
        matches: [
          {
            matchNumber: 5,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZyfsa2', score: 0 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZymfSA', score: 0 },
            winner: 0,
          },
          {
            matchNumber: 6,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZRsm2', score: 0 },
            playerTwo: { address: 'TBD', score: 0 },
            winner: 0,
          },
        ],
      },
      {
        roundName: 'Finals',
        matches: [
          {
            matchNumber: 7,
            playerOne: { address: 'TBD', score: 0 },
            playerTwo: { address: 'TBD', score: 0 },
            winner: 0,
          },
        ],
      },
    ],
    standings: [
      {
        rank: '1',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZyfsa2',
        totalWin: 2,
        totalLose: 0,
        pts: 1,
      },
      {
        rank: '2',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZymfSA',
        totalWin: 2,
        totalLose: 1,
        pts: 1,
      },
      {
        rank: '3',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZRsm2',
        totalWin: 2,
        totalLose: 1,
        pts: 1,
      },
      {
        rank: '4',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZyPo9N',
        totalWin: 1,
        totalLose: 2,
        pts: 0,
      },
      {
        rank: '5',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZy6L2Sm',
        totalWin: 1,
        totalLose: 2,
        pts: 0,
      },
      {
        rank: '6',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZy2mKl',
        totalWin: 0,
        totalLose: 0,
        pts: 0,
      },
      {
        rank: '7',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZy47Hs',
        totalWin: 0,
        totalLose: 0,
        pts: 0,
      },
      {
        rank: '8',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZykfSa',
        totalWin: 0,
        totalLose: 2,
        pts: 0,
      },
    ],
  },
  {
    id: '2',
    name: 'King Cup',
    totalPlayer: '4',
    prize: '$500',
    totalView: '42',
    date: 'Feb 01 2024',
    volume: '$50.52',
    rounds: [
      {
        roundName: 'Semifinals',
        matches: [
          {
            matchNumber: 1,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZns9eM', score: 0 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZMt5P7S', score: 0 },
            winner: 0,
          },
          {
            matchNumber: 2,
            playerOne: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZ2EkS', score: 0 },
            playerTwo: { address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumt5P7Spe', score: 0 },
            winner: 0,
          },
        ],
      },
      {
        roundName: 'Finals',
        matches: [
          {
            matchNumber: 3,
            playerOne: { address: 'TBD', score: 0 },
            playerTwo: { address: 'TBD', score: 0 },
            winner: 0,
          },
        ],
      },
    ],
    standings: [
      {
        rank: '1',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZns9eM',
        totalWin: 0,
        totalLose: 0,
        pts: 0,
      },
      {
        rank: '2',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZMt5P7S',
        totalWin: 0,
        totalLose: 0,
        pts: 0,
      },
      {
        rank: '3',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumZ2EkS',
        totalWin: 0,
        totalLose: 0,
        pts: 0,
      },
      {
        rank: '4',
        address: '5HrN7fHLXWcFiXPwwtq2EkSGns9eMt5P7SpeTPewumt5P7Spe',
        totalWin: 0,
        totalLose: 0,
        pts: 0,
      },
    ],
  },
]
