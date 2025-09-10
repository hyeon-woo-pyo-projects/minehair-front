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

    // 회원탈퇴
    function handleRemove(){
        if ( !window.confirm('탈퇴하면 모든 정보가 사라집니다.\n정말로 탈퇴하시겠습니까?') ) return;

        axiosInstance
        .delete('/user')
        .then((res) => { if ( res.data.success === true ) { alert('삭제되었습니다'); navigate('/'); window.location.reload(); } })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })
    }

    return (
        <div className="pages" id="pages-mypage">
            <h1 className="page-title">MY PAGE</h1>

            <div className="pages-body body-500">
                <ul className="mypage-category">
                    <li>
                        <Link to={''}>
                            회원정보수정
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

                <div className="btns">
                    <button type="button" className="red-btn" onClick={handleRemove}>회원 탈퇴</button>
                </div>
            </div>
        </div>
    )
}

export default MyPageLanding;