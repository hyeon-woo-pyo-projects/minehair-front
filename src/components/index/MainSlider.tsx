import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import IconArrowRight from '../../icons/IconArrowRight';
import IconArrowLeft from '../../icons/IconArrowLeft';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperCore } from 'swiper';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

interface slideProps {
    imageUrl : string,
    link : string
}

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

    const [ slide, setSlide ] = useState<slideProps[]>([]);

    function getSlide () {
        axiosInstance
        .get('/home/slide')
        .then((result)=>{
            if ( result.data.success === true ) {
                const resultData = result.data.data;
                setSlide(resultData);
            }
        })
    }

    useEffect(()=>{
        getSlide();
    },[])

    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={0}
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
                { slide.map((el)=>{
                    console.log(el)
                    return(
                        <SwiperSlide>
                            <Link to={el.link}>
                                <img src={el.imageUrl} alt="슬라이드 이미지"/>
                            </Link>
                        </SwiperSlide>
                    )
                })}
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