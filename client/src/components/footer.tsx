export default function Footer() {
  return (
    <footer className="footer-bg text-white w-full py-16">
      <div className="container mx-auto px-8 max-w-6xl">
        {/* Main Footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start space-y-8 md:space-y-0 md:space-x-8 mb-8">
          {/* Atif Hasan / Bio */}
          <div className="w-full md:w-1/4">
            <h3 className="text-2xl font-bold mb-4">Atif Hasan</h3>
            <p className="text-sm text-gray-400">
              A freelance web designer and developer from Bogura, Bangladesh. I always make websites that have unique designs and also have a good performance rate.
            </p>
          </div>

          {/* Important Links */}
          <div className="w-full md:w-1/4">
            <h3 className="text-2xl font-bold mb-4">Important Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition duration-300">Home</button></li>
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition duration-300">About</button></li>
              <li><button onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition duration-300">Projects</button></li>
              <li><a href="https://github.com/Atifhasan250" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300">GitHub</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/4">
            <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="tel:+8801754020488" className="hover:text-white transition duration-300">+8801754020488</a></li>
              <li><a href="mailto:atifhasan000000@gmail.com" className="hover:text-white transition duration-300">atifhasan000000@gmail.com</a></li>
              <li>Khandar, <br />Bogura, Bangladesh</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="w-full md:w-1/4">
            <h3 className="text-2xl font-bold mb-4">Social Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://www.facebook.com/atifhasan250" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300">Facebook</a></li>
              <li><a href="https://www.linkedin.com/in/atifhasan250/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/_atif_hasan_/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-700 pt-4 mt-8 text-center text-sm text-gray-500">
          &copy; 2026 - Atif Hasan | Designed By Atif Hasan
        </div>
      </div>
    </footer>
  );
}
