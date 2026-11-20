
import { Outlet } from 'react-router-dom'
import Navbar from './pages/shared/Navbar'
import FooterMain from './pages/shared/FooterMain'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar/>
      <div className='min-h-screen'>
      <Outlet/>
      </div>
      <FooterMain/>
    </>
  )
}

export default App
