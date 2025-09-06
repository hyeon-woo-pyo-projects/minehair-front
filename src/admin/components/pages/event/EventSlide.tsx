import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import IconCirclePlus from "../../../../icons/IconCirclePlus";
import { Link, useNavigate } from "react-router-dom";
import IconUpload from "../../../../icons/IconUpload";
import IconTrash from "../../../../icons/IconTrash";
import Balloon from "../../../../components/system/Balloon";
import IconPicture from "../../../../icons/IconPicture";
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface ContentsProps {
    id : number,
    contentsType : string,
    orderNo : number,
    slideOrderNo : number,
    imageUrl : string,
    linkUrl : string,
    textContent : string,
    isAddPost : boolean,
}

function EventSlide () {
    const [ data, setData ] = useState<ContentsProps[]>([]);
    const navigate = useNavigate();
    const [ save, setSave ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);
    const [ deleteBtn, setDeleteBtn ] = useState(false);
    const [ edit, setEdit ] = useState(false);
    const [ clickedData, setClickedData ] = useState({
        id : 0,
        contentsType : 'SLIDE',
        orderNo : 0,
        slideOrderNo : 0,
        imageUrl : '',
        linkUrl : '',
        textContent : '',
        isAddPost : false,
    })

    function getData () {
        axiosInstance
        .get('/event/page/contents/SLIDE')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData(data);
            }
        })
        .catch((err) => {
            alert('오류가 발생했습니다');
            console.log(err);
        })
    };

    useEffect(() => {
        getData();
    }, [])

    // 이벤트 그리드 클릭
    function handleClick (content : ContentsProps) {
        setClickedData({ ...content, });
        setDisabled(false);
        setEdit(true);
        setSave(false);
        setDeleteBtn(true);
    }

    // 새 이벤트 생성
    function handleNewEvent () {
        setClickedData({
            id : 0,
            contentsType : 'SLIDE',
            orderNo : 0,
            slideOrderNo : 0,
            imageUrl : '',
            linkUrl : '',
            textContent : '',
            isAddPost : false,
        });
        setEdit(false);
        setDisabled(false);
        setSave(true);
    }

    // 파일 입력 핸들러
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 이미지 파일 체크
        if (!file.type.includes("image")) {
            alert("이미지 형식만 업로드 가능합니다.");
            return;
        }
        // 10MB 제한
        if (file.size > 10485760) {
            alert("10MB 이하의 파일만 업로드 가능합니다.");
            return;
        }

        // FormData 생성
        const formData = new FormData();
        formData.append("imageFile", file);

        try {
            const response = await fetch("https://minehair401.com/api/image/upload/BANNER", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`, // 토큰 필요 시
                },
            });

            if (!response.ok) {
                throw new Error("업로드 실패");
            }

            const data = await response.json();
            setClickedData({ ...clickedData, imageUrl : data.data.imageUrl });
            setSave(true);
            } catch (error) {
                console.error("에러 발생:", error);
                alert("업로드 중 에러가 발생했습니다.");
        }
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        if ( !window.confirm('이미지를 삭제하시겠습니까?') ) return;

        setClickedData((prev) => ({ ...prev, imageUrl: "" }));
        setSave(true);
    };

    // 저장하기
    const [ ballon, setBalloon ] = useState(0);

    function handleSave () {
        if ( clickedData.linkUrl === '' ) { setBalloon(1); return false; }
        if ( clickedData.textContent === '' ) { setBalloon(2); return false; }
        if ( clickedData.imageUrl === '' ) { setBalloon(3); return false; }
        
        if ( !edit ) {
            axiosInstance
            .post('/event/page/contents', {
                contentsType : 'SLIDE',
                orderNo : clickedData.orderNo,
                slideOrderNo : clickedData.slideOrderNo,
                imageUrl : clickedData.imageUrl,
                linkUrl : clickedData.linkUrl,
                textContent : clickedData.textContent,
                isAddPost : clickedData.isAddPost,
            })
            .then((res) => {
                if ( res.data.success === true ) {
                    alert('저장되었습니다');
                    getData();
                }
            })
            .catch((err) => {
                alert('오류가 발생했습니다');
                console.log(err);
            })
        } else {
            axiosInstance
            .patch(`/event/page/contents/${clickedData.id}`, {
                contentsType : 'SLIDE',
                orderNo : clickedData.orderNo,
                slideOrderNo : clickedData.slideOrderNo,
                imageUrl : clickedData.imageUrl,
                linkUrl : clickedData.linkUrl,
                textContent : clickedData.textContent,
                isAddPost : clickedData.isAddPost,
            })
            .then((res) => {
                if ( res.data.success === true ) {
                    alert('수정되었습니다');
                    getData();
                }
            })
            .catch((err) => {
                alert('오류가 발생했습니다');
                console.log(err);
            })
        }
    }

    // 삭제하기
    function handleDelete () {
        if ( !window.confirm('해당 이벤트를 삭제하시겠습니까?') ) return;
        axiosInstance
        .delete(`/event/page/contents/${clickedData.id}`)
        .then((res) => { if ( res.data.success === true ) { alert('삭제되었습니다'); getData(); } })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })
    }

    return (
        <div className="admin-page" id="event-slide">
            <div className="admin-body wrapper">
                <h1 className="admin-title">이벤트 페이지 슬라이드 설정</h1>

                <div className={`contents-view`}>
                    { data.length > 0 ?
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
                        >
                            { data.map((el) => {
                                return (
                                    <SwiperSlide>
                                        <div className="contents w-100" key={el.id} onClick={() => { handleClick(el) }}>
                                            <div className="img"><img src={el.imageUrl} alt="그리드 이미지"/></div>
                                        </div>
                                    </SwiperSlide>
                                )
                            })} 
                        </Swiper>
                    :
                        <p className="empty-notice">생성된 이벤트가 없습니다.</p>
                    }
                </div>

                <form className="admin-form">
                    <input type="text" value={clickedData.id} hidden disabled/>
                    <input type="text" value={clickedData.orderNo} hidden disabled/>
                    <input type="text" value={clickedData.slideOrderNo} hidden disabled/>

                    <div className="center-menu">
                        <button className="add-btn" type="button" onClick={handleNewEvent}>
                            <IconCirclePlus color="var(--color-black)" />
                            이벤트 생성
                        </button>
                    </div>

                    <ul>
                        <li>
                            { ballon === 1 && <Balloon text={'링크를 입력해주세요'} status="notice" /> }
                            <span className="admin-form-title">링크</span>

                            <div className="input-area">
                                <input
                                    type="text"
                                    value={clickedData.linkUrl}
                                    onChange={(e) => { setClickedData({ ...clickedData, linkUrl : e.target.value }); setSave(true); }}
                                    disabled={disabled}
                                />
                            </div>
                        </li>

                        <li>
                            { ballon === 2 && <Balloon text={'텍스트를 입력해주세요'} status="notice" /> }
                            <span className="admin-form-title">호버 텍스트</span>

                            <div className="input-area">
                                <input
                                    type="text"
                                    value={clickedData.textContent}
                                    onChange={(e) => { setClickedData({ ...clickedData, textContent : e.target.value }); setSave(true); }}
                                    disabled={disabled}
                                />
                            </div>
                        </li>
                        
                        <li>
                            { ballon === 3 && <Balloon text={'이미지를 등록해주세요'} status="notice" /> }
                            <span className="admin-form-title">이미지</span>

                            <div className="input-area">
                                <div className="seperate-item">
                                    { clickedData.imageUrl === '' ?
                                    <>
                                        <input
                                            type="file"
                                            id="event-banner-upload"
                                            onChange={handleFileChange}
                                            disabled={disabled}
                                        />
                                        <label htmlFor="event-banner-upload">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
                                    </>
                                    :
                                        <a 
                                            className="image-preview"
                                            rel="noreferrer"
                                            target="_blank"
                                            href={clickedData.imageUrl}
                                        >
                                            <IconPicture color="var(--color-white)"/>
                                            <span>사진 보기</span>
                                        </a>
                                    }
                                </div>

                                { clickedData.imageUrl !== '' &&
                                    <button type="button" className="red-btn" disabled={disabled} onClick={handleDeleteImageFromForm}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        이미지 삭제
                                    </button>
                                }
                            </div>
                        </li>
                        
                        { deleteBtn === true &&
                            <li>
                                <span className="admin-form-title">삭제하기</span>

                                <div className="input-area">
                                    <button type="button" className="red-btn" disabled={disabled} onClick={handleDelete}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        이벤트 삭제하기
                                    </button>
                                </div>
                            </li>
                        }
                    </ul>

                    <div className="admin-btns">
                        <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                        <button className="primaryBtn" type="button" disabled={!save} onClick={handleSave}>저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventSlide;