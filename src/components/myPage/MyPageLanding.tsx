import { Link, useNavigate } from "react-router-dom";
import IconArrowRight from "../../icons/IconArrowRight";
import { useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

function MyPageLanding () {
    const navigate = useNavigate();

    // 로그인 확인
    function checkToken () {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('roleCode');
        
        if ( !token && !role ) {
            alert('로그인 정보가 없습니다');
            navigate('/member/login');
        }
    }

    useEffect(()=>{
        checkToken();
    }, []);

    return (
        <div className="pages" id="pages-mypage">
            <h1 className="page-title">MY PAGE</h1>

            <div className="pages-body body-500">
                <ul className="mypage-category">
                    <li>
                        <Link to={'/mypage/account'}>
                            회원정보 수정
                            <IconArrowRight color="var(--color-black)" width={15} height={15}/>
                        </Link>
                    </li>

                    <li>
                        <Link to={'/mypage/coupon'}>
                            쿠폰함
                            <IconArrowRight color="var(--color-black)" width={15} height={15}/>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default MyPageLanding;