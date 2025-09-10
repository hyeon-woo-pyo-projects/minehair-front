import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import Balloon from "../../../../components/system/Balloon";
import IconUpload from "../../../../icons/IconUpload";
import { useNavigate } from "react-router-dom";
import IconCirclePlus from "../../../../icons/IconCirclePlus";
import IconTrash from "../../../../icons/IconTrash";

function EventBanner () {
    const navigate = useNavigate();
    const [ banner, setBanner ] = useState({
        id: 0,
        bannerType: 'NAVIGATION',
        color : '',
        content : '',
        imageUrl : '',
        link : '',
        textColor : '',
    })
    const [ balloon, setBalloon ] = useState(0);
    const [ disabled , setDisabled ] = useState(true);
    
    function getData () {
        axiosInstance
        .get('/banner')
        .then((res)=>{
            if ( res.data.success === true ) {
                const data = res.data.data
                const eventBanner = data.filter((el) => el.bannerType === 'NAVIGATION' )[0];
                if ( !eventBanner ) {
                    setBanner({
                        id: 0,
                        bannerType: '',
                        color : '',
                        content : '',
                        imageUrl : '',
                        link : '',
                        textColor : '',
                    });
                }else {
                    setBanner({
                        id: eventBanner.id,
                        bannerType: eventBanner.bannerType,
                        color : '',
                        content : '',
                        imageUrl : eventBanner.imageUrl,
                        link : '',
                        textColor : '',
                    });
                }
            }
        })
        .catch((err)=>{ if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); } })
    }

    useEffect(()=>{
        getData();
    }, [])

    // 파일 입력 핸들러
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes("image")) {
            alert("이미지 형식만 업로드 가능합니다.");
            return;
        }
        if (file.size > 10485760) {
            alert("10MB 이하의 파일만 업로드 가능합니다.");
            return;
        }

        const formData = new FormData();
        formData.append("imageFile", file);

        try {
            const response = await fetch("https://minehair401.com/api/image/upload/BANNER", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
                },
            });

            if (!response.ok) {
                throw new Error("업로드 실패");
            }

            const data = await response.json();
            // 새 이미지 객체를 배열에 추가
            setBanner({ ...banner, imageUrl : data.data.imageUrl });
            setDisabled(false);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };
    
    function handleSave () {
        axiosInstance
        .post('/banner', {
            bannerType : 'NAVIGATION',
            content : '',
            color : '',
            textColor : '',
            link : '/pages/event',
            imageUrl : banner.imageUrl,
        })
        .then((res)=>{ if ( res.data.success === true ) { alert('저장되었습니다.'); getData(); setDisabled(true); }})
        .catch((err)=>{ if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); } })
    }
    function handleDelete () {
        if ( !window.confirm('삭제하시곘습니까?') ) return;

        axiosInstance
        .delete(`/banner/${banner.id}`)
        .then((res) => { if ( res.data.success === true ) { alert('삭제되었습니다.'); getData(); setBanner({...banner, imageUrl : '', id : 0}); setDisabled(true); }})
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); } });
    }
    
    return (
        <div className="admin-page" id="admin-event-banner">
            <div className="admin-body inner">
                <h1 className="admin-title">이벤트 페이지 배너 설정</h1>

                <div className="banner">
                    { banner.id !== 0 ?
                        <div className="banner-item">
                            <img src={banner.imageUrl} alt="배너 이미지" />
                        </div>
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>

                <form className="admin-form">
                    <ul>
                        { banner.id !== 0 ? 
                            <li>
                                <span className="admin-form-title">삭제하기</span>

                                <div className="input-area">
                                    <div className="seperate-item">
                                        <button type="button" className="red-btn" onClick={handleDelete}>
                                            <IconTrash color="var(--color-white)" width={17} height={17} />
                                            이미지 삭제하기
                                        </button>
                                    </div>
                                </div>
                            </li>
                        :
                            <li>
                                { balloon === 1 && <Balloon text={'이미지를 등록해주세요'} status="notice" /> }
                                <span className="admin-form-title">이미지</span>

                                <div className="input-area">
                                    <div className="seperate-item">
                                        <input
                                            type="file"
                                            id="event-banner-upload"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="event-banner-upload">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
                                    </div>
                                </div>
                            </li>
                        }
                    </ul>

                    <div className="admin-btns">
                        <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                        <button className="primaryBtn" type="button" disabled={disabled} onClick={handleSave}>저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventBanner;