

import { Link } from "react-router-dom";
import IconArrowLeft from "../../../icons/IconArrowLeft";

import '../../../style/admin/adminHeader.css';

function AdminFixHeader () {
    return (
        <div id="admin-header">
            <Link to={'/'}><IconArrowLeft color="var(--color-black)" width={30} height={30}/></Link>
            <h5>관리자 페이지</h5>
            <div className="btns">
                <button type="button" className="saveBtn">저장하기</button>
            </div>
        </div>
    )
}

export default AdminFixHeader;