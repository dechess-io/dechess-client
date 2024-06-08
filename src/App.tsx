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
          console.log('7s200:games', games)
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
    function onConnect() {}
    function onDisconnect() {}

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
        <div className="border-none rounded-xl bg-gradient-to-r from-gray-900 to-black min-h-screen">
          <div className="mx-auto flex flex-col items-center justify-center text-center text-white px-6 py-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Bring Your Chess to the next level
            </h1>
            <p className="text-lg md:text-xl mb-8">
              <div className="text-[20px] font-bold">Your Chess, Your Narrative</div>
              <div>
                Delve into a journey with bespoke pieces, face novel challenges, and traverse a
                landscape where every move is a reflection of you
              </div>
              <div>
                <div className="text-[20px] font-bold">Maximize Your Chess Mastery</div>
                <div>
                  Train with our tools, solve complex puzzles, and analyze deeply. Outplay rivals
                  move by move
                </div>
              </div>
            </p>
            <div className="space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
                onClick={() => onCreateGame()}
              >
                Start Play
              </button>
            </div>
          </div>
          <div className="mx-auto px-6 py-8">
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
      </div>
    </>
  )
}

export default App
