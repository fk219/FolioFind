import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BannerCard from '../shared/BannerCard'

export const Banner = () => {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleSearch = () => {
        navigate('/shop')
    }

    return (
        <div className="bg-[#f8f7f4] pt-20 pb-16 lg:pb-24 px-4 lg:px-24">
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-14 lg:gap-20 max-w-7xl mx-auto">
                <div className="lg:w-5/12">
                    <BannerCard />
                </div>
                
                <div className="lg:w-7/12 space-y-8">
                    <h1 className="text-5xl lg:text-7xl font-semibold tracking-[-2.5px] text-gray-950 leading-[1.02]">
                        Buy &amp; sell your <span className="gradient-brand">favorite books</span><br />at the best prices.
                    </h1>
                    
                    <p className="max-w-lg text-xl text-gray-600">
                        Join the most beautiful community of book lovers. Discover, collect, and trade stories that matter.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="search"
                                placeholder="Search thousands of titles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="input-field w-full pr-4 shadow-sm text-base"
                            />
                        </div>
                        <button 
                            onClick={handleSearch} 
                            className="btn-primary text-base px-10"
                        >
                            Search books
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-8 text-sm pt-2 animate-fade-in-up">
                        <div className="flex items-center -space-x-2">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="User avatar" className="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="User avatar" className="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="User avatar" className="w-8 h-8 rounded-full ring-2 ring-white object-cover" />
                        </div>
                        <span className="text-gray-500">Trusted by <span className="font-semibold text-gray-700">42k+</span> passionate readers</span>
                    </div>
                </div>
            </div>
        </div>
    )
}