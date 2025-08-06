import { useState } from "react";
import HeaderBanner from "../../../components/layouts/HeaderBanner";
import AdminWidget from "../layouts/AdminWidget";

function EventBanner () {
    const [ publish, setPublish ] = useState(false);
    function publishing () { setPublish(!publish) }

    return (
        <div className="admin-page event-banner">
            <AdminWidget title={'이벤트 배너'}/>

            <div className="admin-body wrapper">
                <div className="event-banner-header">
                    { publish === true ? 
                        <p className="pulblish-status active">노출 중</p>
                    :
                        <p className="pulblish-status">노출 중단</p>
                    }

                    <div className="publish">
                        <span>게시하기</span>
                        <button className={publish === true ? 'publish-btn active' : 'publish-btn'} onClick={publishing}><i className="ball"></i></button>
                    </div>
                </div>
                <HeaderBanner/>
            </div>
        </div>
    )
}

export default EventBanner;