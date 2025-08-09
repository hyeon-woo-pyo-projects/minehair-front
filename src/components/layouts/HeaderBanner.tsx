import { Link } from 'react-router-dom';
import "../../style/layouts/headerBanner.css"
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface getBannerData {
    content? : string,
    color? : string,
    link? : string,
    isPost? : Boolean,
    textColor? : string,
    imgUrl? : string
}

function HeaderBanner() {
    // 관리자 감지
    const [ admin, setAdmin ] = useState(false);

    useEffect(()=>{
        const role = localStorage.getItem('roleCode');
        if ( role === 'ROLE_ADMIN' ) { setAdmin(true) } else { setAdmin(false) }
    }, [])

    // 데이터 가져오기
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
    

    // 데이터 담기
    const [ bannerData, setBannerData ] = useState<getBannerData | null>(null);

    return (
        <>
            { admin === true ? <Link to="/admin/index" id="adminBanner">관리자 페이지 바로가기</Link> : '' }
            { bannerData?.isPost === true ?
                <Link 
                    to={bannerData?.link ?? '#'} 
                    id="headerBanner" 
                    style={{ 
                        backgroundColor: bannerData?.color ?? 'var(--color-gray)', 
                        color : bannerData?.textColor ?? '#fff', 
                        backgroundImage : bannerData?.imgUrl ?? '' 
                    }}>
                        {bannerData?.content}
                </Link> : null }
        </>
    )
}

export default HeaderBanner;