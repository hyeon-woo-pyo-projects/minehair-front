import { useNavigate } from "react-router-dom";
import IconArrowLeft from "../../../icons/IconArrowLeft";

interface WidgetProps {
    title : string
}

function AdminWidget ({title} : WidgetProps) {
    const navigate = useNavigate();
    return (
        <div className="admin-widget">
            <button className="back-btn" onClick={()=>{navigate(-1)}}>
                <IconArrowLeft color="var(--color-black)" width={30}/> 
            </button>

            <h3>{title}</h3>

            <button type="button" className="save-btn">저장하기</button>
        </div>
    )
}

export default AdminWidget;