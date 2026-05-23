import favBook from '../../assets/favoritebook.jpg'
import { Link } from 'react-router-dom'

const FavoriteBook = () => {
  return (
    <div className="page-section bg-white">
      <div className="container-custom flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
        <div className="lg:w-5/12">
          <div className="relative">
            <img src={favBook} alt="Favorite books" className="rounded-3xl shadow-xl w-full" />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
              <div className="text-xs text-emerald-600 font-semibold tracking-widest">READERS CHOICE</div>
              <div className="text-lg font-semibold text-gray-900">12k+ favorites this month</div>
            </div>
          </div>
        </div>

        <div className="lg:w-7/12 space-y-8">
          <div>
            <div className="badge mb-3">For every reader</div>
            <h2 className="text-5xl lg:text-6xl tracking-[-1.5px] leading-none">
              Find your next<br />favorite book.
            </h2>
          </div>

          <p className="text-xl max-w-md text-gray-600">
            Thousands of handpicked titles. Honest reviews. Beautiful editions. Discover stories that stay with you.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { num: "18k+", label: "Book Listings" },
              { num: "64k+", label: "Happy Readers" },
              { num: "3.2m", label: "Books Traded" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-semibold text-gray-900 tracking-tight">{stat.num}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link to="/shop">
            <button className="btn-primary mt-4">Browse the collection</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FavoriteBook
