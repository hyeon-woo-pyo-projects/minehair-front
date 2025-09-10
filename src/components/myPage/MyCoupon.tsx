import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import IconDownload from "../../icons/IconDownload";
import CouponPopup from "../system/popup/CouponPopup";

interface CouponProps {
    id : number,
    content : string,
    conditionType : string,
    discountType : string,
    discountAmount : number,
    periodStart : string,
    periodEnd : string,
    isPost : boolean,
}

interface MyCouponProps {
    id : number,
    couponId : number,
    usersId : number,
    isUse : boolean,
    issueDate : string,
    useDate : string,
    couponInfo : {
        id : number,
        content : string,
        conditionType : string,
        discountType : string,
        discountAmount : number,
        periodStart : string,
        periodEnd : string,
        isPost : boolean,
    }
}



function MyCoupon () {
    const navigate = useNavigate();
    const [ couponList, setCouponList ] = useState<CouponProps[]>([]);
    const [ myCoupon, setMyCoupon ] = useState<MyCouponProps[]>([]);
    const [ selectedCoupon, setSelectedCoupon ] = useState<MyCouponProps | null>(null);

    // 로그인 확인
    function checkToken () {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('roleCode');
        
        if ( !token && !role ) {
            alert('로그인 정보가 없습니다');
            navigate('/member/login');
        }
    }

    // 날짜 포맷
    function formatDate(date: Date | null) {
        if (!date) return '-';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0~11이므로 +1
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    }

    // 발급가능쿠폰 조회
    function getCouponList () {
        axiosInstance
        .get('/coupon/posted')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setCouponList(data);
            }
        })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })
    }

    // 발급받기
    function getCoupon (getId) {
        axiosInstance
        .post('/coupon/issue', { couponId : getId })
        .then((res) => { if ( res.data.success === true ) { alert('쿠폰을 발급했습니다'); window.location.reload(); } })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err) });
    }

    // 발급받은 쿠폰 조회
    function getMyCoupon () {
        axiosInstance
        .get('/coupon/issue')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                setMyCoupon(data);
            }
        })
        .catch((err) => { alert('오류가 발생했습니다'); console.log(err); })
    }

    useEffect(() => {
        checkToken();
        getMyCoupon();
        getCouponList();
    }, [])

    return (
        <div className="pages wrapper seperate" id="pages-coupon">
            <CouponPopup coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />

            <div className="pages-seperate">
                <h1 className="page-title">내 쿠폰함</h1>

                <form className="pages-form">
                    <ul>
                        { myCoupon.length > 0 ?
                            myCoupon.map((el, index)=>{
                                return (
                                    <li key={index} className={el.isUse === true ? 'used' : ''}>
                                        <input type="text" value={el.id} hidden disabled/>
                                        <input type="text" value={el.couponInfo.conditionType} hidden disabled/>

                                        <div className="text-contents">
                                            <p className="coupon-title">{el.couponInfo.content}</p>
                                            <p className="coupon-discount">
                                                {el.couponInfo.discountAmount}
                                                <span>{el.couponInfo.discountType === 'PRICE' ? '원' : '%' }</span>
                                            </p>
                                            <p className="coupon-period">
                                                사용기간 : {formatDate(el.couponInfo.periodStart ? new Date(el.couponInfo.periodStart) : null)} ~ {formatDate(el.couponInfo.periodEnd ? new Date(el.couponInfo.periodEnd) : null)}
                                            </p>
                                        </div>
                                        
                                        { el.isUse === false ? 
                                            <div className="download" onClick={()=> setSelectedCoupon(el)}>
                                                <p>사용하기</p>
                                            </div>
                                        :
                                            <div className="download">
                                                <p>사용완료</p>
                                            </div>
                                        }
                                    </li>
                                )
                            })
                        :
                            <p className="empty-notice">쿠폰이 없습니다.</p>
                        }
                    </ul>
                </form>
            </div>

            <div className="pages-seperate">
                <h1 className="page-title">발급가능쿠폰</h1>

                <form className="pages-form">
                    <ul>
                        { couponList.length > 0 ?
                            couponList.map((el, index)=>{
                                return (
                                    <li key={index}>
                                        <input type="text" value={el.id} hidden disabled/>
                                        <input type="text" value={el.conditionType} hidden disabled/>

                                        <div className="text-contents">
                                            <p className="coupon-title">{el.content}</p>
                                            <p className="coupon-discount">{el.discountAmount}<span>{el.discountType === 'PRICE' ? '원' : '%' }</span></p>
                                            <p className="coupon-period">사용기간 : {formatDate(el.periodStart ? new Date(el.periodStart) : null)} ~ {formatDate(el.periodEnd ? new Date(el.periodEnd) : null)}</p>
                                        </div>

                                        <div className="download" onClick={()=>{getCoupon(el.id)}}><IconDownload color="var(--color-black)"/></div>
                                    </li>
                                )
                            })
                        :
                            <p className="empty-notice">발급 가능한 쿠폰이 없습니다.</p>
                        }
                    </ul>
                </form>
            </div>
        </div>
    )
}

export default MyCoupon;