import axios from 'axios'

const restApi = axios.create({
  baseURL: 'http://localhost:3001',
})

export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else delete axios.defaults.headers.common['Authorization']
}
export const apiHeader = {
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}
export default restApi

export function flipFEN(FEN: any) {
  const invertCase = (char: any) => {
    if (char == char.toLowerCase()) return char.toUpperCase()
    return char.toLowerCase()
  }

  let position = FEN.split(' ')[0].split('/')
  position = position.map((row: any) => {
    return row.split('').map(invertCase).join('')
  })
  position = position.reverse().join('/')

  let turn = FEN.split(' ')[1]
  turn = turn == 'w' ? 'b' : 'w'

  let castle = FEN.split(' ')[2]
  if (castle != '-') {
    castle = castle.split('').map(invertCase)
    castle.sort()
    castle = castle.join('')
  }

  let ep = FEN.split(' ')[3]
  if (ep != '-') {
    ep = ep.split('')
    ep[1] = ep[1] == '6' ? '3' : '6'
    ep = ep.join('')
  }

  const rest = FEN.split(' ').slice(4)

  return [position, turn, castle, ep, ...rest].join(' ')
}
