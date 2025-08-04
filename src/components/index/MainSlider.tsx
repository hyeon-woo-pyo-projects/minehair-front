import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import IconArrowRight from '../../icons/IconArrowRight';
import IconArrowLeft from '../../icons/IconArrowLeft';
import { useRef, useState } from 'react';
import { Swiper as SwiperCore } from 'swiper';

function MainSlider () {
    // 일시정지 버튼 "my-button-pause"
    const [paused, setPaused] = useState(false);

    //
    const swiperRef = useRef<SwiperCore | null>(null);

    const togglePause = () => {
        if (!swiperRef.current) return;

        if (paused) {
            swiperRef.current.autoplay.start();
        }else {
            swiperRef.current.autoplay.stop();
        }

        setPaused(prev => !prev);
    };

    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                // onSlideChange={() => console.log('slide change')}
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
                onSwiper={(swiper: SwiperClass) => {
                    swiperRef.current = swiper;
                }}
                className='mainSlider'
            >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
            </Swiper>
        
            <div className="my-navigation-buttons">
                <button className="my-button-prev">
                    <IconArrowLeft  color="var(--color-black)" height={30} width={30}/>
                </button>
                <button className={`my-button-pause ${paused ? 'paused' : ''}`} onClick={togglePause}>

                </button>
                <button className="my-button-next">
                    <IconArrowRight color="var(--color-black)" height={30} width={30}/>
                </button>
            </div>
        </>
    )
}

export default MainSlider;