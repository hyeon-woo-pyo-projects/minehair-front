import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import AdminWidget from "../layouts/AdminWidget";

interface getDataProps {
    id : number,
    code : string,
    description : string,
    name : string,
}

function AdminConsultation () {
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
            <AdminWidget title={'상담 카테고리'}/>

            <div className="admin-body inner">
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
            </div>
        </div>
    )
}

export default AdminConsultation;