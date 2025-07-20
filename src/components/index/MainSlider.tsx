import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import IconArrowRight from '../../icons/IconArrowRight';

function MainSlider () {
    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.my-button-next',
                    prevEl: '.my-button-prev',
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className='mainSlider'
            >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
            </Swiper>
        
            <div className="my-navigation-buttons">
                <button className="my-button-prev"></button>
                <button className="my-button-next">
                    <IconArrowRight color="var(--color-black)" height={30} width={30}/>
                </button>
            </div>
        </>
    )
}

export default MainSlider;