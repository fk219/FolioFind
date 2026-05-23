import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

// react icons
import { FaStar } from 'react-icons/fa6'
import { Avatar } from 'flowbite-react';
import profile from "../../assets/profile.jpg"
import ReviewCard from '../shared/ReviewCard';

const Review = () => {
    return (
        <div className="page-section bg-[#faf9f6]">
            <div className="container-custom">
                <div className="section-header">
                    <div className="badge mx-auto mb-3">Loved by readers</div>
                    <h2 className="text-5xl tracking-tight">Real stories from real book lovers</h2>
                    <p className="mt-4">Thousands of readers have found their next great read on FolioFid.</p>
                </div>

                <Swiper
                    slidesPerView={1}
                    spaceBetween={24}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 24 },
                        768: { slidesPerView: 2, spaceBetween: 28 },
                        1024: { slidesPerView: 3, spaceBetween: 32 },
                    }}
                    className="pb-12"
                >
                    {[1,2,3,4].map((_, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="card p-8 h-full flex flex-col">
                                <div className="flex text-amber-500 mb-6 gap-0.5">
                                    {Array(5).fill(0).map((_, i) => <FaStar key={i} />)}
                                </div>

                                <p className="text-gray-600 flex-1 leading-relaxed">
                                    “FolioFid completely changed how I discover and collect books. The community is incredible and the books are always in beautiful condition.”
                                </p>

                                <div className="flex items-center gap-4 pt-8 mt-auto border-t border-gray-100">
                                    <img src={profile} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm" />
                                    <div>
                                        <div className="font-semibold text-gray-900">Elena Voss</div>
                                        <div className="text-sm text-gray-500">Book curator &amp; founder, Paper &amp; Ink</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}

                    <SwiperSlide>
                        <ReviewCard />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default Review
