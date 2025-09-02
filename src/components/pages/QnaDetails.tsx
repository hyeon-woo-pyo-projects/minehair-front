import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/pages/pages.css';
import axiosInstance from '../../api/axiosInstance';
import { useEffect, useState } from 'react';
import IconPencil from '../../icons/IconPencil';
import IconTrash from '../../icons/IconTrash';

function QnaDetails () {
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();

    if ( !id ) { alert('해당 문의사항을 조회할 수 없습니다'); navigate(-1); }

    const [ data, setData ] = useState({
        id : 0,
        title : '',
        content : '',
        author : '',
        viewCount : 0,
    });

    function getData () {
        axiosInstance
        .get(`/board/qna/details/${id}`)
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData({
                    id : data.id,
                    title : data.title,
                    content : data.content,
                    author : data.author,
                    viewCount : data.viewCount,
                });
            }
        })
        .catch((err) => {
            alert('오류가 발생했습니다');
            console.log(err);
        })
    }

    useEffect(() => {
        getData();
    }, []);

    function handleDelete () {
        if ( !window.confirm('문의사항을 삭제하시겠습니까?') ) return;
        
        axiosInstance
        .delete(`/board/qna/${data.id}`)
        .then((res)=>{
            if ( res.data.success === true ) {
                alert('삭제되었습니다');
                navigate('/pages/qna');
            }
        })
        .catch((err)=>{
            alert('오류가 발생했습니다');
            console.log(err);
        })
    }

    return (
        <div className="pages" id='qna-details'>
            <h1 className="page-title">문의 보기</h1>

            <div className="pages-body inner">
                <div className="body-header text-contents">
                    <p>작성자 : <span>{data.author}</span></p>
                    <p>조회수 : <span>{data.viewCount}</span></p>
                </div>

                <form className="pages-form">
                    <ul>
                        <li className='flex-contents'>
                            <p>제목 : </p>
                            <span>{data.title}</span>
                        </li>

                        <li className='flex-contents'>
                            <p>문의내용 :</p>
                            <span>{data.content}</span>
                        </li>
                    </ul>

                    <div className="small-btns between">
                        <div>
                            <button type='button' className='blackBtn small-btn' onClick={() => { navigate(-1) }}>뒤로가기</button>
                        </div>

                        <div className='flex'>
                            <button type='button' className='green-btn small-btn' onClick={() => { navigate('/pages/qna-writer', { state: { ...data, mode: 'edit' } }); }}>
                                <IconPencil color='var(--color-white)' width={15} height={15}/>
                                수정하기
                            </button>
                            <button type='button' className='red-btn small-btn' onClick={handleDelete}>
                                <IconTrash color='var(--color-white)' width={15} height={15}/>
                                삭제하기
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default QnaDetails;