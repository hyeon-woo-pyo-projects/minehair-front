import { useEffect, useState } from "react";
import AdminWidget from "../layouts/AdminWidget";
import axiosInstance from "../../../api/axiosInstance";
import EventBannerDummy from "../dummy/EventBannerDummy";

interface BannerProps {
    content : string,
    textColor : string,
    color: string,
    link : string,
    imgUrl : string
}

function EventBanner () {
    const [ publish, setPublish ] = useState(false);
    function publishing () { setPublish(!publish) }

    // 배너 데이터 받아오기
    const [bannerData, setBannerData] = useState<BannerProps | null>(null);
    const [ bannerTitle, setBannerTitle ] = useState('');

    const getBanner = () => {
        axiosInstance
        .get('/banner')
        .then((response) => {
            if ( response.data.success === true ) {
                setBannerData(response.data.data[0]);
                console.log(response.data.data[0])
            }
        })
        .catch((error) => {
            console.log('error');
        })
    }

    useEffect(()=>{
        getBanner();
    },[])

    // 폼 데이터 변경 시
    const [content, setContent] = useState<string>("");
    useEffect(()=>{
        setContent(bannerData?.content ?? "");
    }, [bannerData])

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

                <EventBannerDummy title={content}/>

                <form className="admin-form" id="event-banner-form">
                    <ul>
                        <li>
                            <span className="admin-form-title">텍스트</span>

                            <div className="input-area">
                                <input type="text" placeholder="텍스트를 입력하세요" value={content} onChange={(e) => setContent(e.target.value)}/>
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    )
}

export default EventBanner;