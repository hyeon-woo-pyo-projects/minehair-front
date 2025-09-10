import { useEffect, useState } from "react";
import PageDummy from "../../dummy/PageDummy";
import { useNavigate } from "react-router-dom";
import Balloon from "../../../../components/system/Balloon";
import IconPicture from "../../../../icons/IconPicture";
import IconUpload from "../../../../icons/IconUpload";
import axiosInstance from "../../../../api/axiosInstance";

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

interface SettingContentsProps {
    selectedMenu: MenuProps | null;
}

function SettingContents({ selectedMenu }: SettingContentsProps) {
    const dataId = selectedMenu?.menuId || 1;
    const navigate = useNavigate();
    const [ balloon, setBalloon ] = useState(0);
    const [ disabled, setDisabled ] = useState(true);
    const [ data, setData ] = useState({
        id: 0,
        menuId : 0,
        orderNo : 0,
        pageUrl : '',
        contentsType : '',
        contentsUrl : '',
        videoBackGroundUrl : '',
        consultingBackGroundUrl : '',
    })

    function getId(){
        axiosInstance
        .get(`/page/contents/${dataId}`)
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData({
                    id: data.id,
                    menuId : data.menuId,
                    orderNo : data.orderNo,
                    pageUrl : data.pageUrl,
                    contentsType : data.contentsType,
                    contentsUrl : data.contentsUrl,
                    videoBackGroundUrl : data.videoBackGroundUrl,
                    consultingBackGroundUrl : data.consultingBackGroundUrl,
                })
            }
        })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
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
            setData({ ...data, contentsUrl : data.data.imageUrl });
            setDisabled(false);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        if ( !window.confirm('이미지를 삭제하시겠습니까?') ) return;

        setData((prev) => ({ ...prev, contentsUrl: "" }));
        setDisabled(false);
    };

    function handleSave(){
        if ( !window.confirm('저장하시겠습니까?') ) return;
        
        axiosInstance
        .post('/page/contents')
        .then((res)=>{if(res.data.success===true) { if ( res.data.success === true ) { alert('저장했습니다'); getId(); } }})
            .catch((err) => { if( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })

        // axiosInstance
        // .patch(`/page/contents/${dataId}`)
        // .then((res) => { if ( res.data.success === true ) { alert('저장했습니다'); getId(); } })
        // .catch((err) => { if( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
    }

    useEffect(() => {
        getId();
    },[dataId]);

    return (
        <div className="admin-page" id="page-setting">
            <div className="admin-body">
                <form className="admin-form">
                    <ul>
                        <li>
                            { balloon === 2 && <Balloon text={'링크를 입력해주세요'} status="notice" /> }
                            <span className="admin-form-title">링크</span>

                            <div className="input-area">
                                <div className="seperate-item">
                                    <input
                                            type="file"
                                            id="sns-logo"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="sns-logo">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
                                    {/* { data.contentsUrl === '' ?
                                    <>
                                        
                                    </>
                                    :
                                        <a 
                                            className="image-preview"
                                            rel="noreferrer"
                                            target="_blank"
                                            href={data.contentsUrl}
                                        >
                                            <IconPicture color="var(--color-white)"/>
                                            <span>사진 보기</span>
                                        </a>
                                    } */}
                                </div>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">저장하기</span>

                            <div className="input-area">
                                <button type="button" className="primaryBtn" onClick={handleSave}>저장하기</button>
                            </div>
                        </li>
                    </ul>
                </form>

                <PageDummy selectedMenu={selectedMenu} />
            </div>
        </div>
    );
}

export default SettingContents;
