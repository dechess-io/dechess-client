import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameItem from './components/Chess/GameItem'
import Header from './components/Header/Header'
import PopupCreateGame from './components/Popup/PopupCreateGame'
import { usePopups } from './components/Popup/PopupProvider'
import { truncateSuiTx } from './services/address'
import { socket } from './services/socket'
import api, { apiHeader } from './utils/api'

function App() {
  const navigate = useNavigate()
  const { addPopup } = usePopups()

  function hasJWT() {
    let flag = false
    localStorage.getItem('token') ? (flag = true) : (flag = false)
    return flag
  }

  const [games, setGames] = useState([])

  useEffect(() => {
    hasJWT() &&
      api
        .get(`/get-game-v2`, { headers: apiHeader })
        .then((res) => {
          console.log(res)
          if (res.data.status === 200) {
            setGames(res.data.games)
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            localStorage.removeItem('token')
          }
        })
  }, [])

  useEffect(() => {
    function onConnect() {
      // setIsConnected(true);
    }

    function onDisconnect() {
      // setIsConnected(false);
    }

    socket.on('connection', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connection', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])
  if (!games) {
    return <>Loading...</>
  }

  const onShowGames = () => {
    let temp = null
    if (games.length > 0) {
      temp = games.map((e, i) => {
        return (
          <div key={i} className="cursor-pointer relative">
            {(e as any).game_id && (
              <div className=" top-4	 bg-blue-400 text-center font-bold w-[200px] mx-auto border border-none rounded-xl">
                Match ID: {truncateSuiTx((e as any).game_id)}
              </div>
            )}

            <div
              className="mx-auto bg-red-100"
              key={i}
              style={{ height: '250px', width: '250px', cursor: 'pointer', padding: '10px' }}
              onClick={() => onHandleJoinGame((e as any).game_id)}
            >
              <GameItem fen={(e as any).fen} />
            </div>
            <div className="flex justify-between max-w-[250px] mx-auto">
              {(e as any).isPaymentMatch && (
                <div className=" bg-green-500 text-center font-bold w-[150px] mx-auto border border-none rounded-xl text-white">
                  Stake:{' '}
                </div>
              )}
            </div>
            {!(e as any).isPaymentMatch && (
              <div className="bg-blue-400 text-center font-bold w-[150px] mx-auto border border-none rounded-xl">
                Free match
              </div>
            )}
          </div>
        )
      })
    }
    return temp
  }

  const onHandleJoinGame = async (game_id: string) => {
    socket.emit('joinGame', { game_id: game_id })
    navigate(`/game/${game_id}`)
  }

  const onCreateGame = async () => {
    return addPopup({
      Component: () => {
        return <PopupCreateGame />
      },
    })
  }

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-8 p-4 md:ml-64 mt-14 bg-white h-screen">
        <h1 className="text-center text-[30px] font-bold">Dechess</h1>
        <div className="flex">
          <div className="w-2/3">
            <div>
              <div className="text-[20px] font-bold">Your Chess, Your Narrative</div>
              <div>
                Delve into a journey with bespoke pieces, face novel challenges, and traverse a
                landscape where every move is a reflection of you
              </div>
            </div>
            <div>
              <div className="text-[20px] font-bold">Maximize Your Chess Mastery</div>
              <div>
                Train with our tools, solve complex puzzles, and analyze deeply. Outplay rivals move
                by move
              </div>
            </div>
            <div>
              <div className="text-[20px] font-bold">
                Unlock Exclusive Rewards with In-Game NFTs
              </div>
              <div>Collect Dechess NFTs and unlock unmatched rewards</div>
            </div>
          </div>

          <div className="w-1/3 flex flex-col space-y-4 justify-center items-center">
            <div
              onClick={onCreateGame}
              className="min-w-[250px] text-center text-white px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-[32px] font-bold w-fit border border-none rounded-xl cursor-pointer"
            >
              Play Online
            </div>
            <div className="min-w-[250px] text-center text-white px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-[32px] font-bold w-fit border border-none rounded-xl cursor-pointer">
              Matching
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="text-[32px] font-bold text-center">Lobbies</div>
          <div>
            {hasJWT() ? (
              <div className="w-full grid grid-cols-4 gap-8">{onShowGames()}</div>
            ) : (
              <div>
                <div className="text-center font-bold">Login to play</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
