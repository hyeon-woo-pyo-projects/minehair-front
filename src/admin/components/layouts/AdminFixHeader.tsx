

import { Link, useNavigate } from "react-router-dom";

import '../../../style/admin/adminHeader.css';
import IconArrowLeft from "../../../icons/IconArrowLeft";

function AdminFixHeader () {
    const navigate = useNavigate();

    return (
        <>
            <div id="admin-header">
                <button type='button' onClick={() => { navigate(-1) }}>
                    <IconArrowLeft color="var(--color-black)"/>
                </button>

                <h5>관리자 페이지</h5>
                <div className="btns">
                    <Link to={'/'}><button type="button" className="exit-btn">나가기</button></Link>
                </div>
            </div>
        </>
    )
}

export default AdminFixHeader;