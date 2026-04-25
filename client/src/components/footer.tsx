export default function Footer() {
  return (
    <footer className="footer-bg w-full py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        {/* Main Footer content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {/* Atif Hasan / Bio */}
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-4">Atif Hasan</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>
              A freelance web designer and developer from Bogura, Bangladesh. I always make websites that have unique designs and also have a good performance rate.
            </p>
          </div>

          {/* Important Links */}
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-4">Important Links</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-body)' }}>
              <li><button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link transition duration-300">Home</button></li>
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link transition duration-300">About</button></li>
              <li><button onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link transition duration-300">Projects</button></li>
              <li><a href="https://github.com/Atifhasan250" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">GitHub</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm break-all sm:break-normal" style={{ color: 'var(--color-text-body)' }}>
              <li><a href="tel:+8801754020488" className="footer-link transition duration-300">+8801754020488</a></li>
              <li><a href="mailto:atifhasan000000@gmail.com" className="footer-link transition duration-300">atifhasan000000@gmail.com</a></li>
              <li>Khandar, <br />Bogura, Bangladesh</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-4">Social Links</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-body)' }}>
              <li><a href="https://www.facebook.com/atifhasan250" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">Facebook</a></li>
              <li><a href="https://www.linkedin.com/in/atifhasan250/" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/_atif_hasan_/" target="_blank" rel="noopener noreferrer" className="footer-link transition duration-300">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t pt-4 mt-8 text-center text-sm" style={{ borderColor: 'var(--color-border-default)', color: 'var(--color-text-muted)' }}>
          &copy; 2026 - Made with ❤️ by Atif Hasan
        </div>
      </div>
    </footer>
  );
}
