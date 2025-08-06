import { useNavigate } from "react-router-dom";
import IconArrowLeft from "../../../icons/IconArrowLeft";
import { useState } from "react";

interface WidgetProps {
    title : string,
    status : boolean,
}

function AdminWidget ({title, status} : WidgetProps) {
    const navigate = useNavigate();
    
    // 호출
    const [ loading, setLoading ] = useState(false);
    function save () {
        setLoading(true);
    }

    return (
        <div className="admin-widget">
            <button className="back-btn" onClick={()=>{navigate(-1)}}>
                <IconArrowLeft color="var(--color-black)" width={30}/> 
            </button>

            <h3>{title}</h3>

            <button type="button" className="save-btn" disabled={!status} onClick={save}>저장하기</button>
        </div>
    )
}

export default AdminWidget;