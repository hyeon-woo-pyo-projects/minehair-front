import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/pages/pages.css';
import { useEffect, useState } from 'react';
import Balloon from '../system/Balloon';
import axiosInstance from '../../api/axiosInstance';

function QnaWriter () {
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state || null // 넘어온 데이터
    const isEdit = editData?.mode === 'edit'; // 수정 모드

    const [ save, setSave ] = useState(false);

    const [ formData, setFormData ] = useState({
        id : 0,
        title : '',
        content : '',
        author : 'test',
        viewCount : 0,
    })

    // 수정 모드일 경우 데이터 맵핑
    useEffect(() => {
        if ( isEdit ) {
            setFormData({
                id : editData.id,
                title : editData.title,
                content : editData.content,
                author : editData.author,
                viewCount : editData.viewCount,
            })
        }
    }, [isEdit, editData])

    // 유효성 검사
    const [ balloon, setBalloon ] = useState(0);
    function handleSave () {
        if ( formData.title === '' ) { setBalloon(1); return false; }
        if ( formData.content === '' ) { setBalloon(2); return false; }

        if ( isEdit ) {
            axiosInstance
            .patch(`/board/qna/${formData.id}`, {
                title : formData.title,
                content : formData.content
            })
            .then((res) => {
                if ( res.data.success === true ) {
                    alert('수정되었습니다');
                    navigate(-1);
                }
            })
            .catch((err) => {
                alert('오류가 발생했습니다');
                console.log(err);
            })
        } else {
            axiosInstance
            .post('/board/qna', {
                title : formData.title,
                content : formData.content,
                author : formData.author,
            })
            .then((res)=>{
                if ( res.data.success === true ) {
                    setBalloon(0);
                    alert('문의를 남겼습니다');
                    navigate('/pages/qna');
                }
            })
            .catch((err) => {
                alert('오류가 발생했습니다');
                console.log(err);
            });
        }
    }

    return (
        <div className="pages" id='qna-writer'>
            <h1 className="page-title">문의 남기기</h1>

            <div className="pages-body body-500">
                <form className="pages-form">
                    <input type="text" value={formData.author} disabled hidden />
                    
                    <ul>
                        <li>
                            { balloon === 1 && <Balloon text={'제목을 입력해주세요'} status={'notice'} /> }
                            <label htmlFor="qna-title">제목</label>
                            <input type="text" id='qna-title' value={formData.title} onChange={(e) => { setFormData({...formData, title : e.target.value}); setSave(true); }} />
                        </li>

                        <li>
                            { balloon === 2 && <Balloon text={'내용을 입력해주세요'} status={'notice'} /> }
                            <label htmlFor="qna-description">내용</label>
                            <textarea name="qna-description" id="qna-description" value={formData.content} onChange={(e) => { setFormData({...formData, content : e.target.value}); setSave(true); }}></textarea>
                        </li>
                    </ul>
                </form>

                <div className="main-btns">
                    <button type='button' className='blackBtn' onClick={() => { navigate(-1) }}>돌아가기</button>
                    <button type='button' className='primaryBtn' disabled={!save} onClick={handleSave}>저장하기</button>
                </div>
            </div>
        </div>
    )
}

export default QnaWriter;