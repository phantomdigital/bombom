export default function Header() {
  return (
    <header className="w-full  mx-auto px-4 lg:px-48 py-4 lg:py-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/images/logo/logo.png" 
            alt="BOMBOM" 
            className="h-6 lg:h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
          <a 
            href="#menu" 
            className="font-sans text-sm lg:text-base font-medium text-gray-800 hover:text-white transition-colors duration-200 uppercase tracking-widest"
          >
            Menu
          </a>
          <a 
            href="#locations" 
            className="font-sans text-sm lg:text-base font-medium text-gray-800 hover:text-white transition-colors duration-200 uppercase tracking-widest"
          >
            Locations
          </a>
          <a 
            href="#about" 
            className="font-sans text-sm lg:text-base font-medium text-gray-800 hover:text-white transition-colors duration-200 uppercase tracking-widest"
          >
            About
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="bg-transparent border-2 border-gray-800 text-gray-800 font-sans font-medium text-sm uppercase tracking-widest px-6 py-3 hover:bg-gray-800 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent">
            CONTACT US
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white font-sans font-medium text-sm uppercase tracking-widest">
          Menu
        </button>
      </div>
    </header>
  );
}
