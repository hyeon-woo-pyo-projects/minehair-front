import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import EventBannerDummy from "../dummy/EventBannerDummy";
import IconUpload from "../../../icons/IconUpload";
import IconTrash from "../../../icons/IconTrash";
import { useNavigate } from "react-router-dom";

interface BannerProps {
    bannerType: string,
    content: string;
    textColor: string;
    color: string;
    link: string;
    imageUrl: string;
    isPost: boolean;
    apiUrl: string;
}

function AdminBanner() {
    const navigate = useNavigate();

    // 배너 데이터 받아오기
    const [bannerData, setBannerData] = useState<BannerProps | null>(null);

    // 폼 필드들
    const [content, setContent] = useState<string>("");
    const [textColor, setTextColor] = useState<string>("#000000");
    const [color, setColor] = useState<string>("#ffffff");
    const [url, setUrl] = useState<string>("#");
    const [imgUrl, setImgUrl] = useState<string>("");

    const [save, setSave] = useState(false);

    useEffect(() => {
        // bannerData가 바뀌면 폼 초기값 세팅
        setContent(bannerData?.content ?? "");
        setTextColor(bannerData?.textColor ?? "#000000");
        setColor(bannerData?.color ?? "#ffffff");
        setUrl(bannerData?.link ?? "#");
        setImgUrl(bannerData?.imageUrl ?? "");
    }, [bannerData]);

    // 서버에서 배너 호출
    const getBanner = () => {
        axiosInstance
        .get("/banner")
        .then((response) => {
            if (response.data.success === true) {
                setBannerData(response.data.data[0]);
            }
        })
        .catch((err) => { if (err.status === 401) navigate("/expired"); else { alert("오류가 발생했습니다."); console.log(err); } });
    };

    useEffect(() => {
        getBanner();
    }, []);
    
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
            setImgUrl(data.data.imageUrl);
            setSave(true);
            } catch (error) {
                console.error("에러 발생:", error);
                alert("업로드 중 에러가 발생했습니다.");
        }
    };
    
    function saveData () {
        if (!window.confirm("저장 하시겠습니까?")) return;
        
        axiosInstance
        .patch('/banner/1', {
            bannerType : 'MAIN',
            content : content,
            color : color,
            textColor : textColor,
            link : url,
            imageUrl : imgUrl,
            isPost : bannerData?.isPost
        })
        .then((result)=>{
            if ( result.data.success === true ) {
                alert('저장되었습니다!');
            }
        })
        .catch((err)=>{ if (err.status === 401) navigate("/expired"); else { alert("오류가 발생했습니다."); console.log(err); } })
    }

    return (
        <div className="admin-page event-banner">
            <div className="admin-body wrapper">
                <h1 className="admin-title">메인 배너</h1>

                <div className="admin-body-header">
                    {bannerData?.isPost === true ? (
                        <p className="pulblish-status active">노출 중</p>
                    ) : (
                        <p className="pulblish-status">노출 중단</p>
                    )}

                    <div className="publish">
                        <label htmlFor="publish-toggle">게시하기</label>
                        <button
                        id="publish-toggle"
                        className={bannerData?.isPost === true ? "publish-btn active" : "publish-btn"}
                        onClick={() => {
                            setBannerData((prev) =>
                            prev ? { ...prev, isPost: !prev.isPost } : prev
                            );
                            setSave(true);
                        }}
                        >
                        <i className="ball"></i>
                        </button>
                    </div>
                </div>

                <EventBannerDummy
                    isPost={bannerData?.isPost}
                    content={content}
                    color={color}
                    textColor={textColor}
                    link={bannerData?.link ?? "#"}
                    imgUrl={imgUrl ?? ""}
                />

                <form className="admin-form" id="event-banner-form">
                    <ul>
                        <li className="w-100">
                            <span className="admin-form-title">텍스트</span>
                            <div className="input-area">
                                <input
                                type="text"
                                placeholder="텍스트를 입력하세요"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setSave(true);
                                }}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">텍스트색</span>
                            
                            <div className="input-area">
                                <input
                                type="text"
                                value={textColor}
                                placeholder="#000000"
                                onChange={(e) => {
                                    setTextColor(e.target.value);
                                    setSave(true);
                                }}
                                />
                                <input
                                type="color"
                                value={textColor}
                                onChange={(e) => {
                                    setTextColor(e.target.value);
                                    setSave(true);
                                }}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">배경색</span>
                            <div className="input-area">
                                <input
                                type="text"
                                value={color}
                                placeholder="#000000"
                                maxLength={7}
                                onChange={(e) => {
                                    setColor(e.target.value);
                                    setSave(true);
                                }}
                                />
                                <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                    setColor(e.target.value);
                                    setSave(true);
                                }}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">링크</span>
                            <div className="input-area">
                                <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setSave(true);
                                }}
                                />
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">이미지 업로드</span>

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

                                {imgUrl !== "" ? (
                                <div className="seperate-item">
                                    <button
                                    type="button"
                                    className="red-btn"
                                    onClick={() => {
                                        if (!window.confirm("이미지를 삭제하시겠습니까?")) return;
                                        setImgUrl("");
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
                    </ul>
                </form>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                    <button className="primaryBtn" type="button" onClick={ saveData } disabled={save ? false : true}>저장하기</button>
                </div>
            </div>
        </div>
    );
}

export default AdminBanner;
