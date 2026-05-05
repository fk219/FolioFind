
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './pages/shared/Navbar'
import FooterMain from './pages/shared/FooterMain'

function App() {
  return (
    <>
      <Navbar/>
      <div className='min-h-screen'>
      <Outlet/>
      </div>
      <FooterMain/>
    </>
  )
}

export default App
