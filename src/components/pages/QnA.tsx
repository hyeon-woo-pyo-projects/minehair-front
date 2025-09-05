import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import IconPencil from '../../icons/IconPencil';
import '../../style/pages/pages.css';
import { Link, useNavigate } from 'react-router-dom';

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
    },[])

    function handleClick (id: number) {
        navigate('/pages/qna-details', { state: { id } });
    }


    return (
        <div className="pages">
            <h1 className="page-title">Q&A</h1>

            <div className="pages-body inner">
                <section className="qna-section">
                    <div className="small-btns">
                        <button type='button' className='green-btn small-btn' onClick={() => { navigate('/pages/qna-writer') }}>
                            <IconPencil color='var(--color-white)' width={15} height={15}/>
                            글쓰기
                        </button>
                    </div>

                    <table>
                        <colgroup>
                            <col width={'60%'}/>
                            <col width={'20%'}/>
                            <col width={'20%'}/>
                        </colgroup>
                        
                        <thead>
                            <tr>
                                <th>문의사항</th>
                                <th>작성자</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            { data.length > 0 ? 
                                    data.map((el)=>{
                                        return (
                                            <tr key={el.id} onClick={() => handleClick(el.id)}>
                                                <td>{el.title}</td>
                                                <td>{el.author}</td>
                                                <td>{el.viewCount}</td>
                                            </tr>
                                        )
                                    })
                                :
                                    <tr>
                                        <td colSpan={2}>데이터가 없습니다.</td>
                                    </tr>
                                }
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    )
}

export default QnA;