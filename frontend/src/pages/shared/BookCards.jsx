import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import {FaCartShopping} from "react-icons/fa6"
import { Link } from 'react-router-dom';

const BookCards = ({headline, books}) => {
    return (
        <div className="page-section bg-white">
            <div className="container-custom">
                <div className="section-header">
                    <h2 className="tracking-[-1px]">{headline}</h2>
                    <p>Handpicked titles our community is loving right now</p>
                </div>

                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 24 },
                        1024: { slidesPerView: 4, spaceBetween: 28 },
                    }}
                    modules={[Pagination]}
                >
                    {books.map(book => (
                        <SwiperSlide key={book._id}>
                            <Link to={`/book/${book._id}`} className="group block">
                                <div className="book-card">
                                    <div className="relative bg-[#f4f3ef] p-6 flex items-center justify-center aspect-[4/3.4] overflow-hidden">
                                        <img 
                                            src={book.imageURL} 
                                            alt={book.bookTitle} 
                                            className="book-cover max-h-[210px] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-500" 
                                        />
                                        <div className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur shadow-sm text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <FaCartShopping className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="p-6 pt-5 flex justify-between items-start gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-emerald-700 transition">
                                                {book.bookTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 truncate">{book.authorName}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-emerald-700 text-lg tracking-tight">
                                                {book.price ? `$${Number(book.price).toFixed(2)}` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default BookCards