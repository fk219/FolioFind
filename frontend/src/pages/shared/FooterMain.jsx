import { Link } from 'react-router-dom'
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'
import { FaBook } from 'react-icons/fa6'

const FooterMain = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0f0d] text-gray-300 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FaBook className="text-white text-xl" />
              </div>
              <span className="text-2xl font-semibold text-white tracking-tight">FolioFid</span>
            </Link>
            <p className="text-sm text-gray-400 pr-6">Curated books for every reader.<br />Buy, sell &amp; discover with love.</p>
          </div>

          {/* Links */}
          <div>
            <div className="text-white font-semibold mb-4 text-sm tracking-wide">Discover</div>
            <div className="space-y-2.5 text-sm">
              <Link to="/shop" className="block hover:text-white transition">Browse Books</Link>
              <Link to="/blog" className="block hover:text-white transition">Stories &amp; Blog</Link>
              <Link to="/about" className="block hover:text-white transition">About Us</Link>
            </div>
          </div>

          <div>
            <div className="text-white font-semibold mb-4 text-sm tracking-wide">Community</div>
            <div className="space-y-2.5 text-sm">
              <a href="#" className="block hover:text-white transition">Book Clubs</a>
              <a href="#" className="block hover:text-white transition">Events</a>
              <a href="#" className="block hover:text-white transition">Authors</a>
            </div>
          </div>

          <div>
            <div className="text-white font-semibold mb-4 text-sm tracking-wide">Support</div>
            <div className="space-y-2.5 text-sm">
              <a href="#" className="block hover:text-white transition">Help Center</a>
              <a href="#" className="block hover:text-white transition">Contact</a>
              <a href="#" className="block hover:text-white transition">Trust &amp; Safety</a>
            </div>
          </div>

          <div>
            <div className="text-white font-semibold mb-4 text-sm tracking-wide">Legal</div>
            <div className="space-y-2.5 text-sm">
              <a href="#" className="block hover:text-white transition">Privacy</a>
              <a href="#" className="block hover:text-white transition">Terms</a>
              <a href="#" className="block hover:text-white transition">Licensing</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-sm gap-4">
          <div className="text-gray-400">
            © {year} FolioFid. Crafted with care for book lovers everywhere.
          </div>

          <div className="flex items-center gap-6 text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition"><BsTwitter className="text-lg" /></a>
            <a href="#" className="hover:text-emerald-400 transition"><BsInstagram className="text-lg" /></a>
            <a href="#" className="hover:text-emerald-400 transition"><BsFacebook className="text-lg" /></a>
            <a href="#" className="hover:text-emerald-400 transition"><BsGithub className="text-lg" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterMain