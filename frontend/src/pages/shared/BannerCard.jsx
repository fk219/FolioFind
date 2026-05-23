import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import './bannerCard.css'
import { EffectCards } from 'swiper/modules'
import { listBooks } from '../../api/books'

function BannerCard() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await listBooks()
        if (!cancelled) setBooks((data?.books || []).slice(0, 5))
      } catch {
        if (!cancelled) setBooks([])
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className='banner-card'>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {books.length > 0 ? (
          books.map(book => (
            <SwiperSlide key={book._id} className="flex items-center justify-center bg-white rounded-lg">
              <img
                src={book.imageURL}
                alt={book.bookTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'
                }}
              />
            </SwiperSlide>
          ))
        ) : (
          <>
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
          </>
        )}
      </Swiper>
    </div>
  )
}

export default BannerCard