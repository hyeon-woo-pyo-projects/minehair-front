import { useState } from "react";
import EventGrid from "./event/EventGrid";
import EventNav from "./event/EventNav";
import EventSlide from "./event/EventSlide";
import EventBanner from "./event/EventBanner";

function EventPage() {
    const [currentPage, setCurrentPage] = useState(1); // 기본값 1번

    const renderContent = () => {
        switch (currentPage) {
            case 1: return <EventGrid />;
            case 2: return <EventSlide />;
            case 3: return <EventBanner />;
            default: return <div>페이지를 선택하세요</div>;
        }
    }

    return (
        <div className="admin-page navigator">
            <div className="nav-area">
                <EventNav onChangePage={setCurrentPage}/>
            </div>

            <div className="contents-area">
                {renderContent()}
            </div>
        </div>
    )
}

export default EventPage;
