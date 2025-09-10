import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import Balloon from "../../../components/system/Balloon";
import IconCirclePlus from "../../../icons/IconCirclePlus";
import { title } from "process";
import IconTrash from "../../../icons/IconTrash";

interface QnaProps {
    id : number,
    title : string,
    content : string,
    author : string,
    viewCount : number,
}

function ManagerQna () {
    const navigate = useNavigate();
    const [ data, setData ] = useState<QnaProps[]>([]);
    const [ balloon, setBalloon ] = useState(0);
    const [ disabled, setDisabled ] = useState(true);
    const [ newOne, setNewOne ] = useState(false);
    const [ form, setForm ] = useState({
        id : 0,
        title : '',
        content : '',
        author : '',
        viewCount : 0,
    })

    function getData (){
        axiosInstance
        .get('/board/qna/page')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData(data);
            }
        })
        .catch((err) => {if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); }})
    }

    useEffect(()=>{ getData();},[])

    function handleEdit (data : QnaProps) {
        setDisabled(false)
        setNewOne(false);
        setForm({
            id : data.id,
            title : data.title,
            content : data.content,
            author : data.author,
            viewCount : data.viewCount,
        })
    }

    function handleNew () {
        setDisabled(false);
        setNewOne(true);
        setForm({
            id : 0,
            title : '',
            content : '',
            author : '',
            viewCount : 0,
        })
    }

    function handleSave (){
        if ( newOne === true ) {
            // 신규
            axiosInstance
            .post('/board/qna', { title : form.title, content : form.content, author : '' })
            .then((res) => { if ( res.data.success === true ) { alert('저장되었습니다.'); window.location.reload(); } })
            .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
        } else {
            // 수정
            axiosInstance
            .patch(`/board/qna/${form.id}`, { title : form.title, content : form.content })
            .then((res) => { if ( res.data.success === true ) { alert('수정되었습니다.'); window.location.reload(); } })
            .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
        }
    }

    function handleDelete(){
        if ( !window.confirm('삭제하시겠습니까?') ) return;

        axiosInstance
        .delete(`/board/qna/${form.id}`)
        .then((res) => { if ( res.data.success === true ) { alert('삭제되었습니다.'); window.location.reload(); } })
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err);} })
    }




    return (
        <div className="admin-page" id="manager-qna">
            <div className="admin-body inner">
                <h1 className="admin-title">Q&A 관리</h1>

                <div className="contents-view">
                    { data.length > 0 ?
                        data.map((el) => {
                            return (
                                <div className="qna" key={el.id} onClick={() => { handleEdit(el) }}>
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

                <form className="admin-form">
                    <input type="text" value={form.id} disabled hidden/>
                    <input type="text" value={form.author} disabled hidden/>

                    <div className="center-menu">
                        <button className="add-btn" type="button" onClick={handleNew}>
                            <IconCirclePlus color="var(--color-black)" />
                            Q&A 생성
                        </button>
                    </div>

                    <ul>
                        <li className="w-100">
                            { balloon === 1 && <Balloon text={'질문을 확인해주세요.'} status={'notice'} /> }
                            <span className="admin-form-title">질문</span>

                            <div className="input-area">
                                <input 
                                    type="text" 
                                    placeholder="질문 등록"
                                    disabled={disabled}
                                    value={form.title}
                                    onChange={(e) => { setForm({...form, title: e.target.value}); setDisabled(false); }}
                                />
                            </div>
                        </li>

                        <li className="w-100">
                            { balloon === 2 && <Balloon text={'답변을 확인해주세요.'} status={'notice'} /> }
                            <span className="admin-form-title">답변</span>

                            <div className="input-area">
                                <input 
                                    type="text" 
                                    placeholder="답변 등록"
                                    disabled={disabled}
                                    value={form.content}
                                    onChange={(e) => { setForm({...form, content: e.target.value}); setDisabled(false); }}
                                />
                            </div>
                        </li>

                        { newOne === false ? 
                            <li>
                                <span className="admin-form-title">삭제</span>
                                
                                <div className="input-area">
                                    <button type="button" className="red-btn" onClick={handleDelete}>
                                        <IconTrash color="var(--color-white"/>
                                        삭제하기
                                    </button>
                                </div>
                            </li>
                        : null }
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

export default ManagerQna;