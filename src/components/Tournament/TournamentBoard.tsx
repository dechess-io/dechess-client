import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import {
  createTournament,
  getTournaments,
  registerTournament,
  selectTournament,
} from '../../redux/tournament/tournament.reducer'
import { truncateSuiTx } from '../../services/address'
import Button from '../Button/Button'
import Header from '../Header/Header'

export function calculateRounds(len: number) {
  return Math.ceil(Math.log2(len))
}

export function getBrackets(_players: Array<any>) {
  let players = _players
  let numRounds = calculateRounds(players.length)
  let tournamentBracket: Array<any> = []

  for (let roundNumber = 1; roundNumber <= numRounds; roundNumber++) {
    const round: { name: string; matches: Array<any> } = {
      name: `Round ${roundNumber}`,
      matches: [],
    }

    const playersInRound = Math.pow(2, numRounds - roundNumber + 1)

    for (let i = 0; i < playersInRound; i += 2) {
      const player1 = players[i] || { player: 'TBD', score: 0 }
      const player2 = players[i + 1] || { player: 'TBD', score: 0 }
      if (player1.score === player2.score) {
        round.matches.push({ player1, player2 })
      } else {
        // Simulate duel if scores are different
        const winner = Math.random() < 0.5 ? { ...player1 } : { ...player2 }
        round.matches.push({ player1, player2 })
      }
    }
    // Filter out losers and keep only winners for the next round

    players = []
    players.push(
      ...round.matches.map((match) => {
        if (match.player1.player !== 'TBD' && match.player1.score >= roundNumber) {
          return match.player1
        }
        if (match.player2.player !== 'TBD' && match.player2.score >= roundNumber) {
          return match.player2
        }
        return { player: 'TBD', score: 0 }
      })
    )

    tournamentBracket.push(round)
  }
  return tournamentBracket
}

const TournamentBoard: React.FC<{}> = ({}) => {
  // const { connect, error, isConnected, activeChain, activeAccount, disconnect, activeSigner } = useInkathon();

  const dispatch = useAppDispatch()
  const tournamentRx = useAppSelector(selectTournament)
  const [isLoadingRegisterTournament, setIsLoadingRegisterTournament] = useState(false)

  useEffect(() => {
    dispatch(getTournaments({}))
  }, [])

  const onShowBoard2 = () => {
    let result = null

    if (tournamentRx.loading || !tournamentRx.tournament) {
      return <>...Loading</>
    }

    result = tournamentRx.tournament.map((tournament: any, index: number) => {
      const players = tournament.players
      const brackets = getBrackets(players)

      const onShowMatchesIn = (round: Array<any>) => {
        let matches: any = []
        if (round.length === 4) {
          console.log('7s200:tour', round, round.length % 2)
        }
        matches = round.map((board, i) => {
          return (
            <React.Fragment key={i + '-item'}>
              <div className="number"></div>
              <div className={`item ${i % 2 === 0 && round.length > 1 && 'show-brackets'}`}>
                <div className="box">
                  <div className={`part partOne  ${false ? 'looser' : ''} `}>
                    <div className="value">
                      {board.player1.player ? truncateSuiTx(board.player1.player, true) : 'TBD'}
                    </div>
                    <div className="score">{board.player1.player ? board.player1.score : 0}</div>
                  </div>
                  <div className={`part partOne  ${false ? 'looser' : ''} `}>
                    <div className="value">
                      {board.player2.player ? truncateSuiTx(board.player2.player, true) : 'TBD'}
                    </div>
                    <div className="score">{board.player2.player ? board.player2.score : 0}</div>
                  </div>
                </div>
                <div className="bracket">
                  <span></span>
                </div>
              </div>
            </React.Fragment>
          )
        })

        if (matches.length % 2 === 0 || matches.length === 1) return matches
        return
      }

      return (
        <TabPanel key={index} value={index} className="py-0 h-full">
          <Tabs value="bracket" className="h-full">
            <TabsBody className="h-full">
              <TabPanel key="bracket" value="bracket" className="h-full">
                <div className="brackets-canvas p-0 lg:pt-0 lg:p-20 h-full">
                  {brackets.map((round: any, round_index: number) => (
                    <div className="column" key={round_index}>
                      {onShowMatchesIn(round.matches)}
                    </div>
                  ))}
                </div>
              </TabPanel>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-xl font-bold text-white leading-[21px] !z-50"
                onClick={() => onHandleRegisterTournament(index)}
                loading={isLoadingRegisterTournament}
              >
                {`Register Tournament ${index}`}
              </Button>
            </TabsBody>
          </Tabs>
        </TabPanel>
      )
    })

    return result
  }

  const onShowTournament = () => {
    let result = null
    if (tournamentRx.loading || !tournamentRx.tournament) {
      return
    }
    result = tournamentRx.tournament.map((tournament: any, index: number) => {
      return (
        <Tab key={index} value={index} className="max-h-[50px] mb-1 !z-50">
          {`tournament ${index}`}
        </Tab>
      )
    })
    return result
  }

  const onHandleCreateTournamnet = () => {
    // dispatch(
    //   createTournament({
    //     activeSigner,
    //     activeAccount,
    //     totalPlayer: 8,
    //     reward: 1_000_000_000,
    //   }),
    // );
  }

  const onHandleRegisterTournament = (tournament_index: number) => {
    setIsLoadingRegisterTournament(true)
    // dispatch(
    //   registerTournament({
    //     activeSigner,
    //     activeAccount,
    //     tournamentIndex: tournament_index,
    //     cb: (data) => {
    //       if (data) setIsLoadingRegisterTournament(false);
    //     },
    //   }),
    // );
  }

  // return (
  //   <>
  //     <Header />
  //     <div className="text-white px-4 py-12 md:ml-64 mt-14 bg-gray-100 h-screen">
  //       <div className="lottery-body px-2 py-2 border border-none rounded-xl ">
  //         {/* <Button
  //           className="bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-xl font-bold text-white leading-[21px] !z-50"
  //           onClick={() => onHandleCreateTournamnet()}
  //         >
  //           Create Tournament
  //         </Button> */}
  //         <Tabs key={'7s62'} value="1" orientation="vertical">
  //           <TabsHeader
  //             className="rounded-none w-32 bg-[#272a33] h-screen py-10"
  //             indicatorProps={{
  //               className:
  //                 'bg-gray-900/50 shadow-none !text-gray-900 border-y-0 border-l-0 border-r-1 border-solid',
  //             }}
  //           >
  //             {onShowTournament()}
  //           </TabsHeader>
  //           <TabsBody className="h-full">
  //             {/* {onShowBoard()} */}
  //             {onShowBoard2()}
  //           </TabsBody>
  //         </Tabs>
  //       </div>
  //     </div>
  //     {/* <div className="space-y-8 p-4 md:ml-64 pl-0 pb-0 pt-14 h-screen relative w-auto min-w-fit flex flex-col bg-[#272a33] mx-auto text-white" id="app">

  //     </div> */}
  //   </>
  // )

  return (
    <>
      <Header />
      <div className="bg-gray-900 h-screen flex flex-col items-center justify-center text-center">
        <div className="text-white">
          <h1 className="text-4xl font-bold">Coming Soon</h1>
          <p className="mt-4 text-lg">We're working on something awesome!</p>
        </div>
        <div className="mt-8">
          <form action="#" method="post" className="flex items-center">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="py-2 px-4 bg-gray-800 text-white rounded-l-md focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 py-2 px-4 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-gray-400 text-sm">Be the first to know when we launch!</p>
        </div>
      </div>
    </>
  )
}
export default TournamentBoard
