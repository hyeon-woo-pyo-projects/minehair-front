import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import { useNavigate } from "react-router-dom";
import IconUpload from "../../../icons/IconUpload";
import IconTrash from "../../../icons/IconTrash";
import Balloon from "../../../components/system/Balloon";

function AdminSlider () {
    const navigate = useNavigate();
    const [ save, setSave ] = useState(false);

    const [ getSlider, setGetSlider ] = useState([]);
    const [ imgUrl, setImgUrl ] = useState('')
    const [ link, setLink ] = useState('')
    const [ imageFile, setImageFile ] = useState<File | ''>('');


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
        .catch((err)=>{
            alert('오류가 발생했습니다');
        })

        setBalloonChk(0);
    }

    return(
        <div className="admin-page" id="admin-slider">
            <div className="admin-body wrapper">
                <h1 className="admin-title">홈 슬라이드 편집</h1>

                <form className="admin-form" id="admin-slide">
                    <ul>
                        { getSlider.map((el)=>{
                            return (
                                <li className="sliderChild">
                                    
                                </li>
                            )
                        })}

                        <li className="sliderChild"><IconCirclePlus color="var(--color-black)"/></li>
                    </ul>
                </form>

                <form className="admin-form" id="admin-slider-form">
                    <ul>
                        <li>
                            <span className="admin-form-title">이미지 업로드</span>

                            <div className="input-area">
                                { balloonChk === 1 && <Balloon text={'이미지를 확인해주세요.'} status={'notice'} /> }
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

                                {imgUrl !== "" ? (
                                    <div className="seperate-item">
                                        <button
                                        type="button"
                                        className="red-btn"
                                        onClick={() => {
                                            if (!window.confirm("이미지를 삭제하시겠습니까?")) return;
                                            setImgUrl("");
                                            setImageFile('');
                                            setSave(true);
                                        }}
                                        >
                                        <IconTrash color="var(--color-white)" />
                                        이미지 삭제
                                        </button>
                                    </div>
                                ) : null}
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