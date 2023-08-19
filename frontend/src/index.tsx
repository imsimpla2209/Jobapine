import { SocketProvider } from 'next/socket.io'
import { SnackbarProvider } from 'notistack'
import ReactDOM from 'react-dom/client'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './next/view/app'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  <SocketProvider>
    <SnackbarProvider maxSnack={1} preventDuplicate>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SnackbarProvider>
  </SocketProvider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
