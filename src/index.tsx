import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import App from './App'
import Game from './components/Chess/Game'
import PopupProvider from './components/Popup/PopupProvider'
import TournamentBoard from './components/Tournament/TournamentBoard'
import { store } from './redux/store'
import './styles/main.scss'

import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@mysten/dapp-kit/dist/index.css'

// const { networkConfig } = createNetworkConfig({
//   testnet: { url: 'https://fullnode.testnet.sui.io:443' },
//   mainnet: { url: 'https://fullnode.mainnet.sui.io:443' },
// })
const networkConfig = {
  testnet: {
    url: 'https://fullnode.testnet.sui.io:443',
  },
  mainnet: {
    url: 'https://fullnode.mainnet.sui.io:443',
  },
}
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: (
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig}>
          <WalletProvider>
            <Outlet />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    ),
    children: [
      {
        path: '/',
        element: <App />,
      },
      { path: '/game/:id', element: <Game /> },
      { path: '/tournament', element: <TournamentBoard /> },
      // { path: "/tournament", element: <Tournament2 /> },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PopupProvider>
        <RouterProvider router={router}></RouterProvider>
      </PopupProvider>
    </Provider>
  </React.StrictMode>
)
