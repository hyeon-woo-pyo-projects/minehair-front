import { useEffect, useState } from "react";
import ConsultationDummy from "../../dummy/ConsultationDummy";
import IconUpload from "../../../../icons/IconUpload";
import IconPicture from "../../../../icons/IconPicture";
import { useNavigate } from "react-router-dom";
import IconTrash from "../../../../icons/IconTrash";
import axiosInstance from "../../../../api/axiosInstance";

function ConsultBack({ onChangePage }){
    const navigate = useNavigate();
    const [ disabled, setDisabled ] = useState(true);
    const [ edit, setEdit ] = useState(false);
    const [ data, setData ] = useState({
        id : 0,
        menuId : 0,
        pageUrl : '/',
        contentsType : 'CONSULTING_BACKGROUND',
        contentsUrl : '',
    });

    function getData () {
        axiosInstance
        .get('/page/contents/type/CONSULTING_BACKGROUND')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data || [];
                
                if (data.length > 0) {
                    setData({
                        id: data[0].id || 0,
                        menuId: data[0].menuId || '',
                        pageUrl: data[0].pageUrl || '',
                        contentsType: data[0].contentsType || '',
                        contentsUrl: data[0].contentsUrl || '',
                    });
                } else {
                    setData({
                        id: 0,
                        menuId: 0,
                        pageUrl: '',
                        contentsType: '',
                        contentsUrl: '',
                    });
                }
            }
        })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다.'); console.log(err);} })
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
            setEdit(false);
            setDisabled(false);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };
    
    function handleSave(){
        if ( !window.confirm('저장하시겠습니까?') ) return;

        if ( edit === false ) {
            axiosInstance
            .post('/page/contents', {
                id : 0,
                menuId : 0,
                pageUrl : '/',
                contentsType : 'CONSULTING_BACKGROUND',
                contentsUrl : data.contentsUrl,
            })
            .then((res) => { if ( res.data.success === true ) { alert('저장되었습니다.'); }})
            .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다.'); console.log(err); }})
        } else {
            axiosInstance
            .delete(`/page/contents/${data.id}`)
            .then((res) => { if ( res.data.success === true ) { alert('저장되었습니다.'); getData(); } })
            .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다.'); console.log(err); }})
        }

    }

    useEffect(()=>{
        getData();
    }, [])

    return (
        <div className="admin-page" id="consult-back">
            <div className="admin-body">
                <ConsultationDummy background={data.contentsUrl}/>

                <form className="admin-form">
                    <ul>
                        <li>
                            <span className="admin-form-title">이미지 업로드</span>
                            <div className="input-area">
                                <div className="seperate-item">
                                    { data.contentsUrl === '' ?
                                    <>
                                        <input
                                            type="file"
                                            id="sns-logo"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="sns-logo">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
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
                                    }
                                </div>

                                {data.contentsUrl !== "" ? (
                                    <div className="seperate-item">
                                        <button
                                        type="button"
                                        className="red-btn"
                                        onClick={() => {
                                            if (!window.confirm("이미지를 삭제하시겠습니까?")) return;
                                            setData({...data, contentsUrl : ''});
                                            setDisabled(false);
                                            setEdit(true);
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

                    <div className="admin-btns">
                        <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                        <button className="primaryBtn" type="button" disabled={disabled} onClick={handleSave}>저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConsultBack;