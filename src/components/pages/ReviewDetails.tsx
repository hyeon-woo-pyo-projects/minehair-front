import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/pages/pages.css';
import axiosInstance from '../../api/axiosInstance';
import { useEffect, useState } from 'react';
import IconPencil from '../../icons/IconPencil';
import IconTrash from '../../icons/IconTrash';

function ReviewDetails () {
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();

    if ( !id ) { alert('해당 문의사항을 조회할 수 없습니다'); navigate(-1); }

    const [ data, setData ] = useState({
        id : 0,
        content : '',
        categoryId : 0,
        imageUrl : '',
        title : '',
    });

    function getData () {
        axiosInstance
        .get(`/board/review/details/${id}`)
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData({
                    id : data.id,
                    categoryId : data.categoryId,
                    content : data.content,
                    imageUrl : data.imageUrl,
                    title : data.title,
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
        .delete(`/board/review/${data.id}`)
        .then((res)=>{
            if ( res.data.success === true ) {
                alert('삭제되었습니다');
                navigate(-1);
            }
        })
        .catch((err)=>{
            alert('오류가 발생했습니다');
            console.log(err);
        })
    }

    return (
        <div className="pages" id='review-details'>
            <h1 className="page-title">리뷰 보기</h1>

            <div className="pages-body inner">
                <form className="pages-form">
                    <input type="text" value={data.id} hidden />
                    <input type="text" value={data.categoryId} hidden />

                    <ul>
                        <li className='flex-contents title'>
                            <span>{data.title}</span>
                        </li>

                        <li className='flex-contents contents'>
                            <a href={data.imageUrl} target='_blank'>
                                <img src={data.imageUrl} alt="리뷰 이미지" />
                            </a>
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

export default ReviewDetails;