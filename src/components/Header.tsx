import Logo from './Logo';
import MobileNav from './MobileNav';
import Navbar from './Navbar';

function Header() {
  return (
    <header className="flex flex-row justify-between align-center py-3 pl-3 pr-5 z-20 bg-white">
      <Logo />
      <MobileNav />
      <Navbar />
    </header>
  );
}

export default Header;
