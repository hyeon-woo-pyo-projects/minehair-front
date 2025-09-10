import { useState } from "react";
import AdminConsultation from "../common/AdminConsultation";
import ConsultNav from "./consultation/ConsultNav";
import ConsultBack from "./consultation/ConsultBack";

function ConsultationPage (){
    const [currentPage, setCurrentPage] = useState(1);

    const renderContent = () => {
        switch (currentPage) {
            case 1: return <AdminConsultation onChangePage={setCurrentPage} />;
            case 2: return <ConsultBack onChangePage={setCurrentPage} />;
            default: return <div>페이지를 선택하세요</div>;
        }
    }

    return (
        <div className="admin-page navigator">
            <div className="nav-area">
                <ConsultNav onChangePage={setCurrentPage}/>
            </div>

            <div className="contents-area">
                {renderContent()}
            </div>
        </div>
    )
}

export default ConsultationPage;