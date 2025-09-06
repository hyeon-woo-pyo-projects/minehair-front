import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import Balloon from "../../../../components/system/Balloon";
import IconUpload from "../../../../icons/IconUpload";
import IconPicture from "../../../../icons/IconPicture";
import IconTrash from "../../../../icons/IconTrash";
import { useNavigate } from "react-router-dom";
import IconCirclePlus from "../../../../icons/IconCirclePlus";

function EventBanner () {
    const navigate = useNavigate();
    const [ logo, setLogo ] = useState('');
    const [ balloon, setBalloon ] = useState(0);
    const [ disabled , setDisabled ] = useState(true);
    const [ save , setSave ] = useState(false);
    
    function getData () {
        axiosInstance
        .get('/logo')
        .then((res)=>{
            if ( res.data.success === true ) {
                const data = res.data.data
                const eventBanner = data.filter((el) => el.logoType === 'EVENT' );
                setLogo(eventBanner);
            }
        })
        .catch((err)=>{ alert('오류가 발생했습니다'); console.log(err) })
    }

    useEffect(()=>{
        getData();
    }, [])

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
            setLogo(data.data.imageUrl);
            setSave(true);
            } catch (error) {
                console.error("에러 발생:", error);
                alert("업로드 중 에러가 발생했습니다.");
        }
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        if ( !window.confirm('이미지를 삭제하시겠습니까?') ) return;

        setLogo('');
        setSave(true);
    };

    function handleNew () { setDisabled(false); }
    function handleSave () {
        axiosInstance
        .post('/banner', {
            bannerType : 'NAVIGATION',
            content : '',
            color : '',
            textColor : '',
            link : '/pages/event',
            imgageUrl : logo,
        })
        .then((res)=>{ if ( res.data.success === true ) { alert('저장되었습니다.'); getData(); }})
        .catch((err)=>{ alert('오류가 발생했습니다'); console.log(err); })
    }
    
    return (
        <div className="admin-page">
            <div className="admin-body inner">
                <h1 className="admin-title">이벤트 페이지 배너 설정</h1>

                <form className="admin-form">
                    <div className="center-menu">
                        <button className="add-btn" type="button" onClick={handleNew}>
                            <IconCirclePlus color="var(--color-black)" />
                            이벤트 생성
                        </button>
                    </div>

                    <ul>
                        <li>
                            { balloon === 1 && <Balloon text={'이미지를 등록해주세요'} status="notice" /> }
                            <span className="admin-form-title">이미지</span>

                            <div className="input-area">
                                <div className="seperate-item">
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
                                </div>
                            </div>
                        </li>
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

export default EventBanner;