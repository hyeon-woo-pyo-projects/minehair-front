import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface EventProps {
    id : number,
    contentsType : string,
    orderNo : number,
    slideOrderNo : number,
    imageUrl : string,
    linkUrl : string,
    textContent : string,
    isAddPost : boolean,
}

function EventSlider () {
    const [ slideData, setSlideData ] = useState<EventProps[]>([]);

    function getData () {
        axiosInstance
        .get('/event/page/contents/SLIDE')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setSlideData(data);
            }
        })
        .catch((err) => {
            alert('알 수 없는 오류가 발생했습니다');
            console.log(err);
        })
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
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
            
            className='event-slide'
        >
            { slideData.map((el)=>{
                return(
                    <SwiperSlide>
                        <Link to={el.linkUrl}>
                            <img src={el.imageUrl} alt="슬라이드 이미지"/>
                        </Link>
                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}

export default EventSlider;