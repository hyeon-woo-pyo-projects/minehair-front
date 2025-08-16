import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import AdminWidget from "../layouts/AdminWidget";
import { useNavigate } from "react-router-dom";

interface getDataProps {
    id : number,
    code : string,
    description : string,
    name : string,
}

function AdminConsultation () {
    const [ save, setSave ] = useState(false);
    const navigate = useNavigate();
    const [ current , setCurrent ] = useState<getDataProps[]>([]);

    function getData () {
        axiosInstance
        .get('/consultation/categories')
        .then((response) => {
            if ( response.data.success === true ) {
                setCurrent(response.data.data);
            }
        })
    }

    useEffect(()=>{
        getData();
    }, [])

    return (
        <div className="admin-page" id="admin-consulation">
            <div className="admin-body inner">
                <h1 className="admin-title">상담 카테고리</h1>

                <form className="admin-form" id="admin-consulation-form">
                    <ul>
                        <li>
                            <span className="admin-form-title">현재 목록</span>

                            <div className="input-area">
                                { current.map((data, index)=>{
                                    return (
                                        <p key={data.id}>{data.name}{data.id}</p>
                                    )
                                }) }
                            </div>
                        </li>
                    </ul>
                </form>

                <div className="admin-btns">
                    <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                    <button className="primaryBtn" type="button" disabled={save ? false : true}>저장하기</button>
                </div>
            </div>
        </div>
    )
}

export default AdminConsultation;