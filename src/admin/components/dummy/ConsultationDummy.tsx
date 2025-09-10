import { useEffect, useState } from "react";
import IconUpload from "../../../icons/IconUpload";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
    id : number,
    code : string,
    name : string,
}

interface ConsultationDummyProps {
    background?: string;
}

function ConsultationDummy ({ background }: ConsultationDummyProps) {
    const navigate = useNavigate();
    const [ category, setCategory ] = useState<CategoryProps[]>([]);

    function getCategory (){
        axiosInstance
        .get('/consultation/categories')
        .then((res) => { if ( res.data.success === true ) { const data = res.data.data; setCategory(data); }})
        .catch((err) => { if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); } })
    }

    useEffect(()=>{
        getCategory();
    },[])

    return (
        <section className="consultation-section" style={ background ? { backgroundImage: `url(${background})` } : {} }>
            <div className="inner-form">
                <div className="title-area">
                    <span className="effect-title">상담문의</span>
                    <h1 className="form-title">· 민이헤어 상담문의 ·</h1>
                </div>

                <form>
                    <ul>
                        <li>
                            <label htmlFor="consultation-name">이름</label>
                            <input type="text" id="consultation-name" placeholder="이름 입력" />
                        </li>

                        <li>
                            <label htmlFor="consultation-phone">연락처</label>
                            <input type="text" id="consultation-phone" placeholder="연락처(-없이)" maxLength={11} />
                        </li>

                        <li>
                            <label htmlFor="consultation-purpose">상담 목적</label>
                            <select name="consultation-purpose" id="consultation-purpose">
                                { category.map((el)=>{
                                    return(
                                        <option value={el.code} key={el.id}>{el.name}</option>
                                    )
                                }) }
                            </select>
                        </li>
                    </ul>

                    <button type="button" className="consultation-btn">상담 문의 남기기</button>
                </form>
            </div>
        </section>
    )
}

export default ConsultationDummy;