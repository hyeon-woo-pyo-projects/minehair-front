import { useEffect, useState } from "react";
import PageDummy from "../../dummy/PageDummy";
import { useNavigate } from "react-router-dom";
import Balloon from "../../../../components/system/Balloon";
import IconPicture from "../../../../icons/IconPicture";
import IconUpload from "../../../../icons/IconUpload";
import axiosInstance from "../../../../api/axiosInstance";
import IconVideo from "../../../../icons/IconVideo";
import IconTrash from "../../../../icons/IconTrash";
import IconCross from "../../../../icons/IconCross";

interface MenuProps {
    id: number;
    menuId: number;
    parentId: number;
    menuName: string;
    menuPath: string;
    imageUrl: string;
    menuVisible: boolean;
    menuType: string;
    menuOrderNo: number;
    roleIdList: number[];
    isContents: boolean;
}

interface ContentsProps {
    id? : number,
    menuId: number;
    pageUrl: string;
    contentsType: string;
    contentsUrl: string;
}

interface SettingContentsProps {
    selectedMenu: MenuProps | null;
}

function SettingContents({ selectedMenu }: SettingContentsProps) {
    const dataId = selectedMenu?.menuId || 0;
    const navigate = useNavigate();
    
    const [data, setData] = useState<ContentsProps[]>([]);
    const [ imgUpload, setImgUpload ] = useState(false);

    const [saveForm, setSaveForm] = useState({
        id: 0,
        menuId: selectedMenu?.menuId || 0,
        pageUrl: "",
        contentsType: "",
        contentsUrl: "",
    });

    // 데이터 불러오기
    const getId = () => {
        axiosInstance
            .get(`/page/contents/${dataId}`)
            .then((res) => {
                if (res.data.success === true) {
                    const data = res.data.data;
                    setData(data);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate("/expired");
                else { alert("오류가 발생했습니다"); console.log(err); }
            });
    };

    // 파일 입력 핸들러
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes("image")) { alert("이미지 형식만 업로드 가능합니다."); return; }
        if (file.size > 10485760) { alert("10MB 이하의 파일만 업로드 가능합니다."); return; }

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

            if (!response.ok) throw new Error("업로드 실패");

            const data = await response.json();
            setSaveForm(prev => ({ ...prev, contentsUrl: data.data.imageUrl }));
            setPopupData({...popupData, contentsUrl: data.data.imageUrl});
            setImgUpload(true);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };

    // 이미지 삭제
    const handleDeleteImageFromForm = () => {
        if (!window.confirm("이미지를 삭제하시겠습니까?")) return;
        setSaveForm(prev => ({ ...prev, contentsUrl: "" }));
        setImgUpload(false);
    };

    // 저장
    const handleSave = () => {
        if (!window.confirm("저장하시겠습니까?")) return;
        
        if ( popupData.isNew === true ) {
            axiosInstance
                .post("/page/contents", {
                    menuId: saveForm.menuId,
                    pageUrl: saveForm.pageUrl,
                    contentsType: popupData.contentsType,
                    contentsUrl: popupData.contentsUrl,
                })
                .then((res) => {
                    if (res.data.success) { 
                        alert("저장했습니다");
        
                        // 저장 후 다시 불러오기
                        getId();
        
                        // 상태 초기화
                        setSaveForm({
                            id: 0,
                            menuId: selectedMenu?.menuId || 0,
                            pageUrl: "",
                            contentsType: "",
                            contentsUrl: "",
                        });
                        
                        setPopup(false);
                    }
                })
                .catch((err) => { 
                    if (err.status === 401) navigate("/expired"); 
                    else { alert("오류가 발생했습니다"); console.log(err); } 
                });
        } else {
            console.log(popupData);
            return
            axiosInstance
            .patch(`/page/contents/${popupData.id}`, {
                menuId : popupData.menuId,
                pageUrl : popupData.pageUrl,
                contentsType : popupData.contentsType,
                contentsUrl : popupData.contentsUrl,
            })
            .then((res) => {
                if (res.data.success) { 
                    alert("수정했습니다");
    
                    // 저장 후 다시 불러오기
                    getId();
    
                    // 상태 초기화
                    setSaveForm({
                        id: 0,
                        menuId: selectedMenu?.menuId || 0,
                        pageUrl: "",
                        contentsType: "",
                        contentsUrl: "",
                    });
                }
            })
            .catch((err) => { 
                if (err.status === 401) navigate("/expired"); 
                else { alert("오류가 발생했습니다"); console.log(err); } 
            });
        }
        
    };

    function handleDelete (){
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        
        axiosInstance
            .delete(`/page/contents/${popupData.id}`)
            .then((res) => { 
                if (res.data.success === true) { 
                    alert('삭제했습니다');
                    
                    getId();
                    
                    setSaveForm({
                        id: 0,
                        menuId: selectedMenu?.menuId || 0,
                        pageUrl: "",
                        contentsType: "",
                        contentsUrl: "",
                    });
                    setPopup(false);
                }
            })
            .catch((err) => { 
                if (err.status === 401) navigate("/expired"); 
                else { alert("오류가 발생했습니다"); console.log(err); } 
            });
    }

    // selectedMenu 변경 시
    useEffect(() => {
        setSaveForm({
            id: 0,
            menuId: selectedMenu?.menuId || 0,
            pageUrl: selectedMenu?.menuPath || '',
            contentsType: "",
            contentsUrl: "",
        });
        getId();
    }, [dataId]);

    const [ popup, setPopup ] = useState(false);
    const [ popupVal, setPopupVal ] = useState(0);
    const [ popupData, setPopupData ] = useState({
        id : 0,
        menuId : 0,
        orderNo : 0,
        contentsType : '',
        contentsUrl : '',
        consultingBackGroundUrl : '',
        videoBackGroundUrl : '',
        pageUrl : '',
        isNew : false,
    })

    function popupOpen(data) {
        if ( data.contentsUrl !== '' ) { setImgUpload(true); }
        if ( data !== 'new-image' || data !== 'new-video' ) {
            setPopupData({
                id : data.id,
                menuId : data.menuID,
                orderNo : data.orderNo,
                contentsType : data.contentsType,
                contentsUrl : data.contentsUrl,
                consultingBackGroundUrl : data.consultingBackGroundUrl,
                videoBackGroundUrl : data.videoBackGroundUrl,
                pageUrl : data.pageUrl,
                isNew : false,
            })
        }

        setPopup(true);
        if ( data === 'new-image' ) { setPopupData({...popupData, isNew : true , contentsType : 'IMAGE'}); setPopupVal(1); }
        if ( data.contentsType === 'IMAGE' ) { setPopupVal(1) }
    }

    function popupClose () {
        setPopup(false);
        setPopupVal(0);
        setImgUpload(false);
        setSaveForm({
            id: 0,
            menuId: selectedMenu?.menuId || 0,
            pageUrl: "",
            contentsType: "",
            contentsUrl: "",
        });
        setPopupData({
            id : 0,
            menuId : 0,
            orderNo : 0,
            contentsType : '',
            contentsUrl : '',
            consultingBackGroundUrl : '',
            videoBackGroundUrl : '',
            pageUrl : '',
            isNew : false,
        })
    }

    return (
        <div className="admin-page" id="page-setting">
            <div className="admin-body">
                <div className="page-preview">
                    {data.length > 0 ?
                        data.map((el, index) => {
                            return(
                                <section className="page-section" key={index} onClick={()=>{popupOpen(el)}}>
                                    { el.contentsType === 'IMAGE' &&
                                        <div className="img-section">
                                            <img src={el.contentsUrl} alt="이미지"/>
                                        </div>
                                    }
                                    { el.contentsType === 'VIDEO' &&
                                        <div className="video-section">
                                            <iframe width="560" height="315" 
                                                src="https://youtube.com/embed/RS-H7y6k-vw?si=iF4wGq97MIH1q5Jq"
                                                title="YouTube video player" 
                                                frameBorder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                            >
                                            </iframe>
                                        </div>
                                    }
                                </section>
                            )
                        })
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>

                <div className="contents-view">
                    <div className="btns">
                        <button type="button" onClick={() => { popupOpen('new-image'); }}>
                            <IconPicture color="var(--color-placeholder)" width={30} height={30} /><p>이미지 추가</p>
                        </button>
                        <button type="button" onClick={() => { popupOpen('new-video'); }}>
                            <IconVideo color="var(--color-placeholder)" width={30} height={30} /><p>동영상 추가</p>
                        </button>
                    </div>
                </div>
            </div>

            { popup === true &&
                <div className="popup">
                    <div className="popup-background" onClick={popupClose}></div>

                    <div className="popup-contents">
                        <div className="popup-header">
                            <h3>
                                { popupVal === 1 ? '이미지 수정' : '비디오 수정' }
                            </h3>

                            <div className="close-btn" onClick={popupClose}>
                                <IconCross color='var(--color-white)'/>
                            </div>
                        </div>
                
                        <div className="popup-body">
                                <div className="popup-contents">
                                    { popupVal === 1 &&
                                        <ul>
                                            <li className="w-100">
                                                <div className="input-area w-100 flex">
                                                    { imgUpload === true ?
                                                            <div className="seperate-item">
                                                                <div className="item">
                                                                    <input
                                                                        type="file"
                                                                        id="sns-logo"
                                                                        onChange={handleFileChange}
                                                                    />
                                                                    <label htmlFor="sns-logo">
                                                                        <IconUpload color="var(--color-white)" width={17} height={17} />
                                                                        이미지 업로드
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        :
                                                            <div className="seperate-item">
                                                                <div className="item">
                                                                    <a 
                                                                        className="image-preview"
                                                                        rel="noreferrer"
                                                                        target="_blank"
                                                                        href={saveForm.contentsUrl}
                                                                    >
                                                                        <IconPicture color="var(--color-white)"/>
                                                                        <span>사진 보기</span>
                                                                    </a>
                                                                </div>

                                                                <div className="item">
                                                                    <button type="button" className="red-btn" onClick={handleDeleteImageFromForm}>
                                                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                                                        이미지 삭제
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }
                                                </div>
                                            </li>
                                        </ul>
                                    }

                                    <div className="btns">
                                        { popupData.isNew === false && <button type="button" className="red-btn" onClick={handleDelete}>삭제하기</button> }
                                        <button type="button" className="primaryBtn" onClick={handleSave}>저장하기</button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default SettingContents;
