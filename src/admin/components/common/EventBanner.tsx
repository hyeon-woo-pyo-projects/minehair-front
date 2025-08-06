import { useEffect, useState } from "react";
import AdminWidget from "../layouts/AdminWidget";
import axiosInstance from "../../../api/axiosInstance";
import EventBannerDummy from "../dummy/EventBannerDummy";
import IconUpload from "../../../icons/IconUpload";
import Loading from "../../../components/system/Loading";

interface BannerProps {
    content : string,
    textColor : string,
    color: string,
    link : string,
    imgUrl : string,
    isPost : boolean
}

function EventBanner () {
    // 배너 데이터 받아오기
    const [bannerData, setBannerData] = useState<BannerProps | null>(null);

    const getBanner = () => {
        axiosInstance
        .get('/banner')
        .then((response) => {
            if ( response.data.success === true ) {
                setBannerData(response.data.data[0]);
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
    const [ content, setContent ] = useState<string>("");
    const [ textColor, setTextColor ] = useState<string>("");
    const [ color, setColor ] = useState<string>("");
    const [ url, setUrl ] = useState<string>("");
    const [ save, setSave ] = useState(false);

    useEffect(()=>{
        setContent(bannerData?.content ?? "");
        setTextColor('#000000' ?? "var(--color-black)");
        setColor(bannerData?.color ?? "var(--color-gray)");
        setColor(bannerData?.color ?? "var(--color-gray)");
        setUrl(bannerData?.link ?? "#");
    }, [bannerData]);

    return (
        <div className="admin-page event-banner">
            <AdminWidget title={'이벤트 배너'} status={save}/>

            <div className="admin-body wrapper">
                <div className="event-banner-header">
                    { bannerData?.isPost === true ? 
                        <p className="pulblish-status active">노출 중</p>
                    :
                        <p className="pulblish-status">노출 중단</p>
                    }

                    <div className="publish">
                        <span>게시하기</span>
                        <button className={bannerData?.isPost === true ? 'publish-btn active' : 'publish-btn'} onClick={() => { setBannerData(prev => prev ? { ...prev, isPost: !prev.isPost } : prev)}}><i className="ball"></i></button>
                    </div>
                </div>

                <EventBannerDummy isPost={bannerData?.isPost} content={content} color={color} textColor={textColor} link=""/>

                <form className="admin-form" id="event-banner-form">
                    <ul>
                        <li className="w-100">
                            <span className="admin-form-title">텍스트</span>

                            <div className="input-area">
                                <input type="text" placeholder="텍스트를 입력하세요" value={content} onChange={(e) => {setContent(e.target.value); setSave(true)}}/>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">텍스트색</span>

                            <div className="input-area">
                                <input type="text" value={textColor} placeholder="#000000" onChange={(e) => {setTextColor(e.target.value); setSave(true)}}/>
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}/>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">배경색</span>

                            <div className="input-area">
                                <input type="text" value={color} placeholder="#000000" maxLength={7} onChange={(e) => {setColor(e.target.value); setSave(true)}}/>
                                <input type="color" value={color} onChange={(e) => {setColor(e.target.value); setSave(true)}}/>
                            </div>
                        </li>
                        
                        <li>
                            <span className="admin-form-title">링크</span>

                            <div className="input-area">
                                <input type="text" value={url} onChange={(e) => {setUrl(e.target.value); setSave(true)}}/>
                            </div>
                        </li>

                        <li>
                            <span className="admin-form-title">이미지 업로드</span>

                            <div className="input-area">
                                <input type="file" id="event-banner-upload" onChange={(e) => { setSave(true) }}/>
                                <label htmlFor="event-banner-upload"><IconUpload color="var(--color-white)" width={17} height={17}/>이미지 업로드</label>
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    )
}

export default EventBanner;