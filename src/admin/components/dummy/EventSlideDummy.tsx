import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface DataProps {
    contentsType: string;
    id: number;
    imageUrl: string;
    isAddPost: boolean;
    linkUrl: string;
    orderNo: number;
    slideOrderNo: number;
    textContext: string;
}

function EventSlideDummy() {
    const navigate = useNavigate();
    const [data, setData] = useState<DataProps[]>([]);

    const getData = async () => {
        try {
            const res = await axiosInstance.get("/event/page/contents/NORMAL");
            if (res.data.success) {
                const showData = res.data.data.filter((el: DataProps) => el.isAddPost);
                setData(showData);
            }
        } catch (err: any) {
            if (err.status === 401) navigate("/expired");
            else {
                alert("오류가 발생했습니다.");
                console.error(err);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (data.length === 0) return null;

    return (
        <div className="event-slide">
            <h1 className="title">🎁&nbsp;&nbsp;&nbsp;민이 헤어가 준비한 특별한 이벤트&nbsp;&nbsp;&nbsp;🎁</h1>
            <h3 className="sub-title">나에게 딱 맞는 맞춤 이벤트 확인하고 신청해보세요!</h3>

            <div className="wrapper">
                <div className="my-button-prev"></div>
            
                <Swiper
                    key={data.length}
                    modules={[Navigation, Pagination, Autoplay]}
                    loop={true}
                    slidesPerView={1.5}       // 중앙 1 + 양쪽 일부 노출
                    slidesPerGroup={1}
                    centeredSlides={true}
                    spaceBetween={10}          // 슬라이드 간격
                    speed={800}
                    navigation={{
                        nextEl: ".my-button-next",
                        prevEl: ".my-button-prev",
                    }}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    observer={true}
                    observeParents={true}
                    breakpoints={{
                        768: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false }, // 태블릿 이상은 일반 3개 보기
                        1200: { slidesPerView: 4, spaceBetween: 30, centeredSlides: false },
                    }}
                    className="page-event-slide"
                >
                    {data.map((el) => (
                        <SwiperSlide key={el.id}>
                        <Link to={el.linkUrl || "/pages/event"}>
                            <img
                            src={el.imageUrl}
                            alt={el.textContext || "슬라이드 이미지"}
                            />
                        </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="my-button-next"></div>
            </div>

            <Link to={'/pages/event'} className="event-btn">이벤트 바로가기</Link>
        </div>
    );
}

export default EventSlideDummy;
