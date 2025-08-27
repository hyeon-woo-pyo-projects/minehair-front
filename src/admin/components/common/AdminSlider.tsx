import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import { useNavigate } from "react-router-dom";
import IconUpload from "../../../icons/IconUpload";
import IconTrash from "../../../icons/IconTrash";
import Balloon from "../../../components/system/Balloon";

interface SliderProps {
    id : number,
    link : string,
    imageUrl : string,
}

function AdminSlider () {
    const navigate = useNavigate();
    const [ save, setSave ] = useState(false);

    const [ getSlider, setGetSlider ] = useState<SliderProps[]>([]);
    const [ id, setId ] = useState(0);
    const [ imgUrl, setImgUrl ] = useState('');
    const [ link, setLink ] = useState('');

    function getSlide () {
        axiosInstance
        .get('/home/slide')
        .then((result)=>{
            if (result.data.success === true) {
                const slideData = result.data.data
                setGetSlider(slideData);
            }
        })
    }

    useEffect(()=>{
        getSlide();
    }, []);

    // 파일 입력 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImgUrl(reader.result);  // base64 문자열 저장
                setSave(true);
            }
        };
    };
    
    const [ balloonChk, setBalloonChk ] = useState(0);

    function handleSave () {
        if ( imgUrl === '' ) { setBalloonChk(1); return false; }
        if ( link === '' ) { setBalloonChk(2); return false; }
        
        axiosInstance
        .post('/home/slide', {
            imageUrl : imgUrl,
            link : link
        })
        .then((res)=>{
            if ( res.data.success === true ) {
                alert('저장되었습니다');
                window.location.reload();
            }
        })
        .catch((err)=>{
            alert('오류가 발생했습니다');
        })

        
    }

    function handleDelete () {
        if (!window.confirm('해당 슬라이드를 삭제하시겠습니까?')) return;

        axiosInstance
        .delete(`/home/slide/${id}`)
        .then((result)=>{
            if ( result.data.success === true ) {
                alert('삭제되었습니다');
                window.location.reload();
            }
        })
    }
    
    const [ isNew, setIsNew ] = useState(false);

    function newSlide () {
        setIsNew(true);
        setId(0);
        setImgUrl('');
        setLink('');
    }

    return(
        <div className="admin-page" id="admin-slider">
            <div className="admin-body wrapper">
                <h1 className="admin-title">홈 슬라이드 편집</h1>

                <form className="admin-form" id="admin-slide">
                    <input type="number" value={id} hidden/>

                    <ul>
                        {getSlider.map((el) => {
                            return (
                                <li
                                    className="sliderChild"
                                    key={el.id}
                                    style={{ backgroundImage: `url(${el.imageUrl})` }}
                                    onClick={() => {
                                        setId(el.id);
                                        setLink(el.link);
                                        setImgUrl('');
                                        setSave(false);
                                        setIsNew(false);
                                    }}
                                ></li>
                            );
                        })}

                        <li className="sliderChild" onClick={newSlide}>
                            {imgUrl !== "" ? (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundImage: `url(${imgUrl})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: "8px"
                                    }}
                                />
                            ) : (
                                <IconCirclePlus color="var(--color-black)"/>
                            )}
                        </li>
                    </ul>
                </form>

                <form className="admin-form" id="admin-slider-form">
                    <ul>
                        <li>
                            <span className="admin-form-title">컨텐츠</span>

                            <div className="input-area">
                                { balloonChk === 1 && <Balloon text={'이미지를 확인해주세요.'} status={'notice'} /> }
                                { isNew === true ? 
                                    <div className="seperate-item">
                                        <input
                                            type="file"
                                            id="event-banner-upload"
                                            onChange={handleFileChange}
                                            disabled={!isNew}
                                        />
                                        <label htmlFor="event-banner-upload">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
                                    </div>
                                :
                                    <div className="seperate-item">
                                            <button
                                                type="button"
                                                className="red-btn"
                                                onClick={handleDelete}
                                            >
                                            <IconTrash color="var(--color-white)" />
                                            슬라이드 삭제
                                            </button>
                                        </div>
                                    }
                            </div>
                        </li>
                        
                        <li>
                            { balloonChk === 2 && <Balloon text={'링크를 확인해주세요.'} status={'notice'} /> }
                            <span className="admin-form-title">링크</span>
                            
                            <div className="input-area">
                                <input
                                type="text"
                                placeholder="/page"
                                value={link}
                                disabled={!isNew}
                                onChange={(e) => {
                                    setLink(e.target.value)
                                    setSave(true);
                                }}
                                />
                            </div>
                        </li>
                    </ul>
                </form>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>
                        뒤로가기
                    </button>
                    <button
                        className="primaryBtn"
                        type="button"
                        onClick={handleSave}
                        disabled={!save}
                    >
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminSlider;