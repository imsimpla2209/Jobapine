import { SocketProvider } from 'next/socket.io'
import ReactDOM from 'react-dom/client'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './next/view/app'
import reportWebVitals from './reportWebVitals'
import { ConfigProvider } from 'antd'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#394c90',
        colorPrimaryBg: '#fff',
        colorPrimaryBorder: '#394c90',
        borderRadius: 10,
        colorBorder: '#606060',

        // Alias Token
        colorBorderBg: '#d5d6e0',
        colorBorderSecondary: '#d5d6e0',
        colorBgContainer: '#fff',
        colorBgBase: '#fff',
        colorBgLayout: '#fff',
      },
    }}
  >
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </ConfigProvider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
