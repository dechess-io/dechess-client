import { ChessBishop } from '@styled-icons/fa-solid'
import { Chess, Square } from 'chess.js'
import { useEffect, useState } from 'react'
import { Chessboard as Board } from 'react-chessboard'
import { useLocation, useNavigate } from 'react-router-dom'
import abi from '../../abi/dechesscontract.json'
import { getGame, selectGame } from '../../redux/game/game.reducer'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { truncateSuiTx } from '../../services/address'
import { socket } from '../../services/socket'
import { DEFAULT_0X0_ADDRESS } from '../../utils/address'
import { apiHeader, default as restApi } from '../../utils/api'
import Button from '../Button/Button'
import Header from '../Header/Header'
import LoadingGame from '../Loading/LoadingGame'
import Popup from '../Popup/Popup'
import { useCurrentAccount } from '@mysten/dapp-kit'

const Game: React.FC<{}> = () => {
  const currentAccount = useCurrentAccount()
  const dispatch = useAppDispatch()
  const gameRx = useAppSelector(selectGame)

  const [isStartGame, setIsStartGame] = useState(true)

  const [game, setGame] = useState<Chess | any>()
  const [raw, setRaw] = useState<any>(null)

  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [moveFrom, setMoveFrom] = useState<any>('')
  const [moveTo, setMoveTo] = useState<Square | null>(null)
  // const [piece, setPiece] = useState<Piece | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<any>({})
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [optionSquares, setOptionSquares] = useState({})
  const [moveSquares, setMoveSquares] = useState({})
  const [isGameOver, setIsGameOver] = useState(new Chess().isGameOver())
  const [isGameDraw, setIsGameDraw] = useState(new Chess().isDraw())

  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [isHiddenGameStatus, setIsHiddenGameStatus] = useState(false)

  const [isDeposit, setIsDeposit] = useState(false)
  const [turnPlay, setTurnPlay] = useState('w')

  const [isClaim, setIsClaim] = useState(false)
  const navigate = useNavigate()

  const location = useLocation()
  console.log('7s200:data', raw)
  useEffect(() => {
    restApi
      .get(`/load-game-v2`, {
        params: {
          game_id: location.pathname.split('/')[2],
        },
      })
      .then(async (res) => {
        if (res.status === 200) {
          const data = res.data.game
          setGame(new Chess(data.fen))
          setRaw(data)
          setPlayer1(data.player_1)
          setPlayer2(data.player_2)
          setTurnPlay(data.turn_player)
          if (data.player_1.length > 0 && data.player_2.length > 0) {
            setIsStartGame(true)
          }
        }
      })
      .catch((err) => {
        // localStorage.removeItem("token");
      })
  }, [isStartGame])

  // useEffect(() => {
  //   if (activeAccount && activeSigner && raw) {
  //     dispatch(getGame({ index: raw.pays.gameIndex, activeAccount, activeSigner }));
  //   }
  // }, [dispatch, activeAccount, activeSigner, isStartGame]);

  useEffect(() => {
    function onConnect() {
      setIsSocketConnected(true)
    }

    function onNewMove(room: any) {
      console.log('new move', room)
      if (room.fen) {
        setGame(new Chess(room.fen))
        setTurnPlay(room.turn)
      }
    }
    function onStart(data: any) {
      console.log('7s200:socket:start', data)
      if (data.start === true) {
        setIsStartGame(data.start)
      }
    }
    socket.connect()

    socket.on('connection', onConnect)

    socket.on('newmove', onNewMove)

    socket.on('start', onStart)

    socket.emit('joinGame', { game_id: location.pathname.split('/')[2] })

    return () => {
      socket.off('connection', onConnect)
      socket.off('newmove', onNewMove)
      socket.off('start', onStart)
    }
  }, [])

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    })
    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: any = {}
    moves.map((move: any) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      }
      return move
    })
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    }
    setOptionSquares(newSquares)
    return true
  }

  function onSquareClick(square: Square) {
    if (currentAccount) {
      if (player1 !== currentAccount.address && turnPlay === 'w') {
        return
      }
      if (player2 !== currentAccount.address && turnPlay === 'b') {
        return
      }

      setRightClickedSquares({})

      // from square

      // to square
      if (!moveTo) {
        if (!moveFrom) {
          const hasMoveOptions = getMoveOptions(square)
          if (hasMoveOptions) setMoveFrom(square)
          return
        }
        // check if valid move before showing dialog
        const moves = game.moves({
          square: moveFrom,
          verbose: true,
        })
        const foundMove = moves.find((m: any) => m.from === moveFrom && m.to === square) as any
        // not a valid move
        if (!foundMove) {
          // check if clicked on new piece
          const hasMoveOptions = getMoveOptions(square)
          // if new piece, setMoveFrom, otherwise clear moveFrom
          setMoveFrom(hasMoveOptions ? square : '')
          return
        }

        // valid move
        setMoveTo(square)
        // if promotion move
        if (
          (foundMove.color === 'w' && foundMove.piece === 'p' && square[1] === '8') ||
          (foundMove.color === 'b' && foundMove.piece === 'p' && square[1] === '1')
        ) {
          setShowPromotionDialog(true)
          return
        }

        // is normal move
        let gameCopy = game

        const move = gameCopy.move({
          from: moveFrom,
          to: square,
          promotion: 'q',
        })

        socket.emit('move', {
          from: moveFrom,
          to: square,
          game_id: location.pathname.split('/')[2],
          turn: game.turn(),
          // address: activeAccount?.address,
          address: '',
          fen: game.fen(),
          isPromotion:
            (foundMove.color === 'w' && foundMove.piece === 'p' && square[1] === '8') ||
            (foundMove.color === 'b' && foundMove.piece === 'p' && square[1] === '1'),
        })

        console.log(location.pathname.split('/')[2])

        // if invalid, setMoveFrom and getMoveOptions
        if (move === null) {
          const hasMoveOptions = getMoveOptions(square)
          if (hasMoveOptions) setMoveFrom(square)
          return
        }

        setGame(gameCopy)

        // setTimeout(makeRandomMove, 300);
        setMoveFrom('')
        setMoveTo(null)
        setOptionSquares({})
        return
      }
    }
  }

  function onPromotionPieceSelect(piece: any) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      let gameCopy: any = game
      console.log(game)
      const newMove = gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? 'q',
      })
      console.log('7s200:pro', { promotion: piece[1].toLowerCase() ?? 'q' })
      if (newMove) {
        setGame(gameCopy)

        // Emit the move to the backend
        socket.emit('move', {
          from: moveFrom,
          to: moveTo,
          game_id: location.pathname.split('/')[2],
          turn: game.turn(),
          // address: activeAccount?.address,
          address: '',
          fen: game.fen(),
          isPromotion: true,
          promotion: piece[1].toLowerCase() ?? 'q',
        })
      }
    }

    setMoveFrom('')
    setMoveTo(null)
    setShowPromotionDialog(false)
    setOptionSquares({})
    return true
  }

  function onSquareRightClick(square: any) {
    const colour = 'rgba(0, 0, 255, 0.4)'
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    })
    // console.log("7s200:onSquareRightClick", rightClickedSquares);
  }

  const onClaim = async () => {
    setIsClaim(true)
    const res = await restApi
      .post(
        '/update-winner-v2',
        {
          params: { game_id: location.pathname.split('/')[2] },
        },
        { headers: apiHeader }
      )
      .then((data) => {
        setIsClaim(false)

        return data
      })
    if (res) {
      navigate(`/game/${location.pathname.split('/')[2]}`)
      setIsClaim(false)
    }
  }

  const onShowFen = () => {
    return game.fen()
  }

  const onShowPlayerTop = () => {
    if (currentAccount?.address !== player1 && currentAccount?.address !== player2) {
      return (
        <div className="px-4 py-2 bg-[#baca44] w-2/3 border border-none rounded-xl shadow-xl">
          <div className="flex justify-center items-center space-x-2">
            <ChessBishop color="white" size={26} />
            <p className="font-bold text-[14px]">
              {raw.player_2 === DEFAULT_0X0_ADDRESS
                ? 'Waiting player...'
                : truncateSuiTx(raw.player_2)}
            </p>
          </div>
        </div>
      )
    } else {
      if (currentAccount?.address === player2) {
        return (
          <div className="px-4 py-2 bg-[#baca44] w-2/3 border border-none rounded-xl shadow-xl">
            <div className="flex justify-center items-center space-x-2">
              <ChessBishop color="white" size={26} />
              <p className="font-bold text-[14px]">{truncateSuiTx(player1)}</p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="px-4 py-2 bg-[#baca44] w-2/3 border border-none rounded-xl shadow-xl">
            <div className="flex justify-center items-center space-x-2">
              <ChessBishop color="white" size={26} />
              <p className="font-bold text-[14px]">{truncateSuiTx(player2)}</p>
            </div>
          </div>
        )
      }
    }
  }

  const onShowPlayerBottom = () => {
    if (currentAccount?.address !== player1 && currentAccount?.address !== player2) {
      return (
        <div className="px-4 py-2 bg-[#baca44] w-2/3 border border-none rounded-xl shadow-xl">
          <div className="flex justify-center items-center space-x-2">
            <ChessBishop color="white" size={26} />
            <p className="font-bold text-[14px]">{truncateSuiTx(raw.player_1)}</p>
          </div>
        </div>
      )
    } else {
      if (currentAccount?.address === player1) {
        return (
          <div className="px-4 py-2 bg-[#baca44] w-2/3 border border-none rounded-xl shadow-xl">
            <div className="flex justify-center items-center space-x-2">
              <ChessBishop color="white" size={26} />
              <p className="font-bold text-[14px]">{truncateSuiTx(player1)}</p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="px-4 py-2 bg-[#baca44] w-2/3 border border-none rounded-xl shadow-xl">
            <div className="flex justify-center items-center space-x-2">
              <ChessBishop color="white" size={26} />
              <p className="font-bold text-[14px]">{truncateSuiTx(player2)}</p>
            </div>
          </div>
        )
      }
    }
  }

  // const onShowDepositPopup = () => {
  //   if (!gameRx.game || !gameRx.game.userA || !gameRx.game.userB) {
  //     return;
  //   }
  //   if ((activeAccount?.address !== gameRx.game.userA && !gameRx.game.userAPayable) || (activeAccount?.address !== gameRx.game.userB && !gameRx.game.userBPayable)) {
  //     if (activeAccount?.address === gameRx.game.userA && gameRx.game.userAPayable) {
  //       return;
  //     }
  //     if (activeAccount?.address === gameRx.game.userB && gameRx.game.userBPayable) {
  //       return;
  //     }
  //     return (
  //       <div className="absolute top-1/3 left-[50px] w-[400px] bg-white border boder-none rounded-xl">
  //         <div className="flex flex-col space-y-4 justify-center items-center h-[150px]">
  //           <div className="font-bold">Deposit 10 AZ0 to play this match</div>
  //           <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-xl font-bold text-white leading-[21px]" onClick={() => Deposit()} loading={isDeposit}>
  //             Deposit
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   }
  // };

  const onShowWaitingStartGame = () => {
    if (!isStartGame) {
      return (
        <div className="absolute top-1/3 left-[50px] w-[400px] bg-white border boder-none rounded-xl">
          <div className="flex flex-col space-y-4 justify-center items-center h-[150px]">
            <div className="font-bold">Waiting player join the game...</div>
          </div>
        </div>
      )
    }
    return <></>
  }

  const isOrientation = () => {
    if (currentAccount?.address === player1) {
      return 'white'
    } else {
      return 'black'
    }
  }

  const onShowGame = () => {
    return (
      <div className="relative" style={{ height: '500px', width: '500px', cursor: 'pointer' }}>
        <div className="flex flex-col space-y-4">
          {onShowPlayerTop()}
          <div className="relative">
            <Board
              boardOrientation={isOrientation()}
              position={game.fen()}
              id="ClickToMove"
              animationDuration={200}
              arePiecesDraggable={false}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onPromotionPieceSelect={onPromotionPieceSelect}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares,
              }}
              promotionToSquare={moveTo}
              showPromotionDialog={showPromotionDialog}
            />
            {(game.isGameOver() || game.isDraw()) && (
              <div
                className={`absolute top-1/3 left-[50px] w-[400px] ${
                  isHiddenGameStatus && 'hidden'
                }`}
                onClick={() => setIsHiddenGameStatus(true)}
              >
                <Popup className="bg-gray-50 w-[400px]">
                  <h1 className="mb-4 text-center font-bold text-[20px]">
                    {game.isGameOver() && (
                      <div>
                        {game.turn() === 'b' ? truncateSuiTx(player1) : truncateSuiTx(player2)}
                      </div>
                    )}
                    {game.isDraw() && <div>Draw</div>}
                    {/* {(raw as any).isPaymentMatch &&
                        game.isGameOver() &&
                        (((raw as any).turn_player === "b" && activeAccount?.address! === raw.player_1) ||
                          ((raw as any).turn_player === "w" && activeAccount?.address! === raw.player_2)) && (
                          <Button
                            className="mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-xl font-bold text-white leading-[21px]"
                            onClick={() => onClaim()}
                            disabled={raw.isClaimed}
                            loading={isClaim}
                          >
                            {raw.isClaimed ? "Claimed" : "Claim"}
                          </Button>
                        )} */}
                  </h1>
                </Popup>
              </div>
            )}
            {onShowWaitingStartGame()}
            {/* {onShowDepositPopup()} */}
          </div>
          {onShowPlayerBottom()}
        </div>
      </div>
    )
  }

  if (!game || !raw) {
    return <LoadingGame />
  } else {
    return (
      <>
        <Header />
        <div className="flex p-8 md:ml-64 mt-14 bg-gray-100 h-screen">{onShowGame()}</div>
      </>
    )
  }
}
export default Game
