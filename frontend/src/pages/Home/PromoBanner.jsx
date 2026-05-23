import bookPic from '../../assets/awardbooks.png'
import { Link } from 'react-router-dom'

const PromoBanner = () => {
    return (
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 py-16 px-4 lg:px-24">
            <div className="container-custom flex flex-col lg:flex-row-reverse items-center gap-12 text-white">
                <div className="lg:w-5/12">
                    <img src={bookPic} alt="Award-winning books" className="w-full max-w-[380px] mx-auto lg:mx-0 drop-shadow-2xl rounded-2xl" />
                </div>
                <div className="lg:w-7/12 space-y-6">
                    <div className="uppercase tracking-[3px] text-emerald-300 text-sm font-medium">Celebrating excellence</div>
                    <h2 className="text-white text-5xl lg:text-6xl leading-none tracking-[-1.5px]">
                        National Book Awards<br />Fiction Shortlist 2025
                    </h2>
                    <p className="max-w-md text-lg text-emerald-100">The most anticipated books of the year — now available to discover and own on FolioFid.</p>
                    
                    <Link to="/shop">
                      <button className="mt-4 px-9 py-3.5 rounded-2xl font-semibold bg-white text-emerald-900 hover:bg-emerald-50 transition shadow-lg active:scale-[0.985]">
                        Explore the shortlist
                      </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PromoBanner
