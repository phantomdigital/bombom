export default function Header() {
  return (
    <header className="w-full max-w-[120rem] bg-sky-100/85 mx-auto px-4 lg:px-10 xl:px-16 2xl:px-18 [@media(min-width:1795px)]:px-48 py-2 sm:py-3 lg:py-6 border-b border-gray-800/10 backdrop-blur-sm sticky top-0 z-950">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center group">
          <img 
            src="/images/logo/logo.png" 
            alt="BOMBOM" 
            className="h-6 lg:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
          <a 
            href="#menu" 
            className="font-sans text-sm lg:text-base font-medium text-gray-800 hover:text-sky-800 transition-colors duration-300 uppercase tracking-widest"
          >
            Menu
          </a>
          <span className="text-gray-300 text-xs">•</span>
          <a 
            href="#locations" 
            className="font-sans text-sm lg:text-base font-medium text-gray-800 hover:text-sky-800 transition-colors duration-300 uppercase tracking-widest"
          >
            Locations
          </a>
          <span className="text-gray-300 text-xs">•</span>
          <a 
            href="#about" 
            className="font-sans text-sm lg:text-base font-medium text-gray-800 hover:text-sky-800 transition-colors duration-300 uppercase tracking-widest"
          >
            About
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button 
            className="bg-transparent border-2 border-gray-800 text-gray-800 font-sans font-medium text-sm uppercase tracking-widest px-12 py-3 hover:bg-gray-800 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            style={{ borderRadius: '50%' }}
          >
            GET IN TOUCH
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800 font-sans font-medium text-sm uppercase tracking-widest hover:text-gray-400 transition-colors duration-300">
          Menu
        </button>
      </div>
    </header>
  );
}
