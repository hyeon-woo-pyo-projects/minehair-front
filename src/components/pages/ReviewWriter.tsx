import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Balloon from '../system/Balloon';
import axiosInstance from '../../api/axiosInstance';
import IconPicture from '../../icons/IconPicture';
import IconUpload from '../../icons/IconUpload';
import '../../style/pages/pages.css';
import IconTrash from '../../icons/IconTrash';

function ReviewWriter () {
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state || null // 넘어온 데이터
    const isEdit = editData?.mode === 'edit'; // 수정 모드

    const [ save, setSave ] = useState(false);

    const [ formData, setFormData ] = useState({
        id : 0,
        categoryId : 0,
        title : '',
        content : '',
        imageUrl : '',
    })

    // 수정 모드일 경우 데이터 맵핑
    useEffect(() => {
        if ( isEdit ) {
            setFormData({
                id : editData.id,
                categoryId : editData.categoryId,
                title : editData.title,
                content : editData.content,
                imageUrl : editData.imageUrl,
            })
        }
    }, [isEdit, editData])

    const [ cate, setCate ] = useState<any[]>([])
    function getCategory (){
        axiosInstance
        .get('/board/review/category')
        .then((res) => { if(res.data.success === true) {
            const data = res.data.data;
            setCate(data);
        } })
        .catch((err) => {  if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); } });
    }

    useEffect(()=>{
        getCategory();
    }, [])

    // 유효성 검사
    const [ balloon, setBalloon ] = useState(0);
    function handleSave () {
        if ( formData.categoryId === 0 ) { setBalloon(1); return false; }
        if ( formData.title === '' ) { setBalloon(2); return false; }
        if ( formData.imageUrl === '' ) { setBalloon(3); return false; }

        setBalloon(0);

        if ( isEdit ) {
            axiosInstance
            .patch(`/board/review/${formData.id}`, {
                categoryId : formData.categoryId,
                title : formData.title,
                content : formData.content,
                imageUrl : formData.imageUrl
            })
            .then((res) => {
                if ( res.data.success === true ) {
                    alert('수정되었습니다');
                    navigate(-1);
                }
            })
            .catch((err) => { if (err.status === 401) navigate("/expired"); else { alert("오류가 발생했습니다."); console.log(err); } })
        } else {
            axiosInstance
            .post('/board/review', {
                categoryId : formData.categoryId,
                title : formData.title,
                content : formData.content,
                imageUrl : formData.imageUrl
            })
            .then((res)=>{
                if ( res.data.success === true ) {
                    setBalloon(0);
                    alert('리뷰를 등록했습니다');
                    navigate(-1);
                }
            })
            .catch((err) => { if (err.status === 401) navigate("/expired"); else { alert("오류가 발생했습니다."); console.log(err); } });
        }
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
            setFormData((prev) => ({  ...prev, imageUrl: data.data.imageUrl, }));
            setSave(true);
        } catch (error) {
            console.error("에러 발생:", error);
            alert("업로드 중 에러가 발생했습니다.");
        }
    };

    /** 이미지 삭제 (폼의 imageUrl 제거) */
    const handleDeleteImageFromForm = () => {
        if ( !window.confirm('이미지를 삭제하시겠습니까?') ) return;

        setFormData((prev) => ({ ...prev, imageUrl: "" }));
        setSave(true);
    };

    return (
        <div className="pages" id='review-writer'>
            <h1 className="page-title">글쓰기</h1>

            <div className="pages-body body-500">
                <form className="pages-form">
                    <input type="text" value={formData.content} disabled hidden />
                    
                    <ul>
                        <li>
                            { balloon === 1 && <Balloon text={'카테고리를 선택해주세요'} status={'notice'} /> }
                            <label htmlFor="qna-title">카테고리</label>

                            <div className="input-area w-100">
                                <select
                                    className="w-100"
                                    value={formData.categoryId}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            categoryId: Number(e.target.value),
                                        }))
                                    }
                                >
                                    <option value="0" hidden>선택</option>
                                    {cate.map((el) => (
                                        <option key={el.id} value={el.id}>
                                            {el.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>

                        <li>
                            { balloon === 2 && <Balloon text={'제목을 입력해주세요'} status={'notice'} /> }
                            <label htmlFor="qna-title">제목</label>
                            <input type="text" id='qna-title' value={formData.title} onChange={(e) => { setFormData({...formData, title : e.target.value}); }} />
                        </li>

                        <li>
                            { balloon === 3 && <Balloon text={'이미지를 등록해주세요'} status={'notice'} /> }
                            <label htmlFor="qna-title">이미지</label>
                            
                            <div className="input-area">
                                <div className="seperate-item">
                                    { formData.imageUrl === '' ?
                                    <>
                                        <input
                                            type="file"
                                            id="img"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="img">
                                            <IconUpload color="var(--color-white)" width={17} height={17} />
                                            이미지 업로드
                                        </label>
                                    </>
                                    :
                                        <a 
                                            className="image-preview"
                                            rel="noreferrer"
                                            target="_blank"
                                            href={formData.imageUrl}
                                        >
                                            <IconPicture color="var(--color-white)"/>
                                            <span>사진 보기</span>
                                        </a>
                                    }
                                </div>
                                { formData.imageUrl !== '' &&
                                    <button type="button" className="red-btn" onClick={handleDeleteImageFromForm}>
                                        <IconTrash color="var(--color-white)" width={17} height={17} />
                                        이미지 삭제
                                    </button>
                                }
                            </div>
                        </li>
                    </ul>
                </form>

                <div className="main-btns">
                    <button type='button' className='blackBtn' onClick={() => { navigate(-1) }}>돌아가기</button>
                    <button type='button' className='primaryBtn' onClick={handleSave}>저장하기</button>
                </div>
            </div>
        </div>
    )
}

export default ReviewWriter;