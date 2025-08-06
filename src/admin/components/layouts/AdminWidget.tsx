import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSave } from '../../../components/common/UseSave'
import IconArrowLeft from "../../../icons/IconArrowLeft";

interface BannerProps {
    content : string,
    textColor : string,
    color: string,
    link : string,
    imgUrl : string,
    isPost : boolean,
}

interface WidgetProps {
    title : string,
    status : boolean,
    saveData?: BannerProps | null;
}

function AdminWidget ({title, status, saveData} : WidgetProps) {
    const navigate = useNavigate();
    
    // 호출
    const { loading, save } = useSave();

    return (
        <div className="admin-widget">
            <button className="back-btn" onClick={()=>{navigate(-1)}}>
                <IconArrowLeft color="var(--color-black)" width={30}/> 
            </button>

            <h3>{title}</h3>

            <button type="button" className="save-btn" disabled={!status} onClick={() => {save()}}>저장하기</button>
        </div>
    )
}

export default AdminWidget;