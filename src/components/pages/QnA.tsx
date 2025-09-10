import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import '../../style/pages/pages.css';
import { useNavigate } from 'react-router-dom';

interface DataProps {
    id : number,
    title : string,
    content : string,
    author : string,
    viewCount : number,
}

function QnA () {
    const navigate = useNavigate();
    const [ data, setData ] = useState<DataProps[]>([]);

    function getData () {
        axiosInstance
        .get('/board/qna/page')
        .then((res)=>{
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData(data);
            }
        })
        .catch((err)=>{
            if ( err.status === 401 ) {
                alert('회원만 조회 가능합니다');
                navigate(-1);
            }else {
                alert('오류가 발생했습니다');
                console.log(err);
            }
        })
    }

    useEffect(()=>{
        getData();
    },[]);


    return (
        <div className="pages" id='pages-qna'>
            <h1 className="page-title">Q&A</h1>

            <div className="pages-body inner">
                <div className="contents-view">
                    { data.length > 0 ?
                        data.map((el) => {
                            return (
                                <div className="qna" key={el.id}>
                                    <div className="question">
                                        <p><span>Q.</span> {el.title}</p>
                                    </div>
                                    
                                    <div className="answer">
                                        <p><span>A.</span> {el.content}</p>
                                    </div>
                                </div>
                            )
                        })
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default QnA;