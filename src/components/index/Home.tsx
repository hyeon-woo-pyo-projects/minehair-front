import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ConsultationDummy from "../../admin/components/dummy/ConsultationDummy";
import EventSlideDummy from "../../admin/components/dummy/EventSlideDummy";


function Home(){
    const [ data, setData ] = useState<any[]>([])

    function getData(){
        axiosInstance
        .get('/page/contents/0')
        .then((res) => {
            if (res.data.success === true) {
                const data = res.data.data;
                setData(data);
            }
        })
        
    }

    useEffect(()=>{
        getData();
    },[])

    return (
        <div className="main-page">
            { data.length > 0 ? 
                data.map((el)=>{
                    return(
                        <section>
                            { el.contentsType === 'IMAGE' &&
                                <div className="img-line">
                                    <img src={el.contentsUrl} alt='이미지'/>
                                </div>
                            }

                            { el.contentsType === 'VIDEO' &&
                                <div className="video-line" style={{backgroundImage: `url('${el.videoBackGroundUrl}')`}}>
                                    <iframe width="560" height="315"
                                        src={el.contentsUrl}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            }
                        </section>
                    )
                })
            :
                <></>
            }

            <EventSlideDummy/>
            <ConsultationDummy/>
        </div>
    )
}

export default Home;