import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import IconUpload from "../../../icons/IconUpload";
import IconPicture from "../../../icons/IconPicture";
import IconTrash from "../../../icons/IconTrash";
import Balloon from "../../../components/system/Balloon";

interface DataProps {
    id : number,
    componentType : string,
    linkUrl: string,
    content: string,
    imageUrl: string,
}

function AdminConsultationMenu () {
    const navigate = useNavigate();
    const [ data, setData ] = useState<DataProps[]>([]);
    const [ disabled, setDisabled ] = useState(true);
    const [ newAdd, setNewAddOne ] = useState(false);
    const [ form, setForm ] = useState({
        id : 0,
        componentType : 'HEADER_CONSULTING_INNER_BUTTON',
        linkUrl : '',
        content : '',
        imageUrl : '',
    })

    // 데이터 불러오기
    function getData(){
        axiosInstance
        .get('/homepage/component/HEADER_CONSULTING_INNER_BUTTON')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                const logoData = data.filter((el) => el.componentType === 'HEADER_CONSULTING_INNER_BUTTON' );
                setData(logoData);
            }
        })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); }})
    };

    useEffect(()=>{
        getData();
    },[]);

    function newOne () {
        setDisabled(false);
        setNewAddOne(true);
        setForm({
            id : 0,
            componentType : 'HEADER_CONSULTING_INNER_BUTTON',
            linkUrl : '',
            content : '',
            imageUrl : '',
        });
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
            setForm({ ...form, imageUrl : data.data.imageUrl });
            setDisabled(false);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        if ( !window.confirm('이미지를 삭제하시겠습니까?') ) return;

        setForm((prev) => ({ ...prev, imageUrl: "" }));
        setDisabled(false);
    };


    // 저장하기
    const [ balloon, setBalloon ] = useState(0);
    function handleSave(){
        if ( form.linkUrl === '' ) { setBalloon(1); return false; }
        if ( form.content === '' ) { setBalloon(2); return false; }
        if ( form.imageUrl === '' ) { setBalloon(3); return false; }

        setBalloon(0);
        if ( newAdd === true ) {
            axiosInstance
                .post('/homepage/component', {
                    componentType : form.componentType,
                    linkUrl : form.linkUrl,
                    content : form.content,
                    imageUrl : form.imageUrl,
                })
                .then((res) => { if ( res.data.success === true ) { alert('저장되었습니다'); getData(); }})
                .catch((err) => {if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); }})
        } else {
            axiosInstance
                .patch(`/homepage/component/${form.id}`, {
                    componentType : form.componentType,
                    linkUrl : form.linkUrl,
                    content : form.content,
                    imageUrl : form.imageUrl,
                })
                .then((res) => { if ( res.data.success === true ) { alert('수정되었습니다'); getData(); }})
                .catch((err) => {if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); }})
        }
    }

    // 수정하기
    function handleEdit (data : DataProps) {
        setDisabled(false);
        setNewAddOne(false);
        setForm({
            id : data.id,
            linkUrl : data.linkUrl,
            imageUrl : data.imageUrl,
            content : data.content,
            componentType : 'HEADER_CONSULTING_INNER_BUTTON',
        });
    }

    // 삭제하기
    function handleDelete(){
        if ( !window.confirm('삭제하시겠습니까?') ) return;

        axiosInstance
        .delete(`/homepage/component/${form.id}`)
        .then((res) => { if (res.data.success === true) { alert('삭제되었습니다'); window.location.reload(); } })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); }})
    }






    return(
        <div className="admin-page" id="admin-consultation-menu">
            <div className="admin-body wrapper">
                <h1 className="admin-title">상담문의 설정</h1>

                <div className="contents-view">
                    { data.length > 0 ?
                        <div className="consultation-menu">
                            <ul className="consultation-body">
                                {data.map((el)=>{
                                    return (
                                        <li key={el.id} onClick={() => { handleEdit(el) }}>
                                            <img src={el.imageUrl} alt="퀵 이미지" />
                                            <p>{el.content}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>

                <form className="admin-form">
                    <input type="text" value={form.id} hidden/>
                    
                    <div className="center-menu">
                        <button className="add-btn" type="button" onClick={newOne}>
                            <IconCirclePlus color="var(--color-black)" />
                            메뉴 추가
                        </button>
                    </div>

                    <ul>
                        <li>
                            { balloon === 1 && <Balloon text={'링크를 등록해주세요'} status="notice" /> }
                            <span className="admin-form-title">링크</span>

                            <div className="input-area">
                                <input 
                                    type="text"
                                    value={form.linkUrl}
                                    onChange={(e) => { setForm({...form, linkUrl : e.target.value}); } }
                                    disabled={disabled}
                                />
                            </div>
                        </li>

                        <li>
                            { balloon === 2 && <Balloon text={'텍스트를 등록해주세요'} status="notice" /> }
                            <span className="admin-form-title">텍스트</span>

                            <div className="input-area">
                                <input 
                                    type="text"
                                    value={form.content}
                                    onChange={(e) => { setForm({...form, content : e.target.value}); } }
                                    disabled={disabled}
                                />
                            </div>
                        </li>

                        <li>
                            { balloon === 3 && <Balloon text={'이미지를 등록해주세요'} status="notice" /> }
                            <span className="admin-form-title">이미지</span>

                            <div className="input-area">
                                <div className="seperate-item">
                                    { form.imageUrl === '' ?
                                        <>
                                            <input
                                                type="file"
                                                id="event-sns-upload"
                                                onChange={handleFileChange}
                                                disabled={disabled}
                                            />
                                            <label htmlFor="event-sns-upload">
                                                <IconUpload color="var(--color-white)" width={17} height={17} />
                                                이미지 업로드
                                            </label>
                                        </>
                                        :
                                        <a 
                                            className="image-preview"
                                            rel="noreferrer"
                                            target="_blank"
                                            href={form.imageUrl}
                                        >
                                            <IconPicture color="var(--color-white)"/>
                                            <span>사진 보기</span>
                                        </a>
                                    }
                                </div>
                                
                                { form.imageUrl !== '' &&
                                    <button type="button" className="red-btn" disabled={disabled} onClick={handleDeleteImageFromForm}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        이미지 삭제
                                    </button>
                                }
                            </div>
                        </li>

                        { newAdd === false &&
                            <li>
                                <span className="admin-form-title">메뉴 삭제</span>

                                <div className="input-area">
                                    <button type="button" className="red-btn" disabled={disabled} onClick={handleDelete}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        메뉴 삭제
                                    </button>
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

export default AdminConsultationMenu;