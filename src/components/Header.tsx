import Logo from './Logo'
import Navbar from './Navbar'

function Header() {
  return (
    <header className='flex flex-row justify-between align-center py-3 px-5'>
      <Logo />
      <Navbar/>
    </header>
  )
}

export default Header