import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import EventSlider from "./EventSlider";

interface EventProps {
    id : number,
    orderNo : number,
    slideOrderNo : number,
    imageUrl : string,
    linkUrl : string,
    textContent : string,
    isAddPost : boolean,
}

function Event () {
    const [ eventData, setEventData ] = useState<EventProps[]>([]);
    const [ slideData, setSlideData ] = useState<EventProps[]>([]);

    function getData () {
        axiosInstance
        .get('/event/page/contents/NORMAL')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setEventData(data);
                
                const slideData = data.filter(el => el.isAddPost === true);
                setSlideData(slideData);
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
        <div className="pages" id="page-event">
            <h1 className="page-title">EVENT</h1>

            <div className="pages-body wrapper">
                <div className="slider-area">
                    <EventSlider/>
                </div>

                <div className="grid-area">
                    { eventData.length > 0 ?
                        eventData.map((el) => {
                            return (
                                <div className="events" key={el.id}>
                                    <Link to={el.linkUrl}>
                                        <img src={el.imageUrl} alt="이벤트" />

                                        <div className="hover">
                                            <p>{el.textContent}</p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Event;