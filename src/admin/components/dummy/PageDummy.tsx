import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

interface DataProps {
    id : number,
    menuId : number,
    orderNo : number,
    pageUrl : string,
    contentsType : string,
    contentsUrl : string,
    consultingBackGroundUrl : string,
    videoBackGroundUrl : string,
}

function PageDummy() {
    const location = useLocation();
    
    const params = new URLSearchParams(location.search);
    const menuId = params.get('menuId');

    const [ data, setData ] = useState<DataProps[]>([]);

    function getData () {
        axiosInstance
        .get(`/page/contents/${menuId}`)
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setData(data);
            }
        })
    }

    useEffect(()=>{
        getData();
    },[menuId])

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
        </div>
    );
}

export default PageDummy;
