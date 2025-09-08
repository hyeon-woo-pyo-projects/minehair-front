import axiosInstance from '../../../api/axiosInstance';
import IconCross from '../../../icons/IconCross';
import '../../../style/system/popup.css';

interface CouponInfo {
    id: number;
    content: string;
    conditionType: string;
    discountType: string;
    discountAmount: number;
    periodStart: string;
    periodEnd: string;
    isPost: boolean;
}

interface MyCouponProps {
    id: number;
    couponId: number;
    usersId: number;
    isUse: boolean;
    issueDate: string;
    useDate: string;
    couponInfo: CouponInfo;
}

interface CouponPopupProps {
    coupon: MyCouponProps | null;
    onClose: () => void;
}

function CouponPopup({ coupon, onClose }: CouponPopupProps) {
    if (!coupon) return null;

    function handleUse () {
        if ( !window.confirm('쿠폰을 사용처리 하시겠습니까?\n(사용 처리 후엔 되돌릴 수 없습니다)') ) return;
        
        axiosInstance
        .post(`/coupon/issue/use/${coupon?.id}`)
        .then((res) => { if ( res.data.success === true ) { alert('쿠폰을 사용했습니다'); window.location.reload(); }})
        .catch((err) => { alert('에러가 발생했습니다'); console.log(err); })
    }

    return (
        <div className="popup" id="popup-coupon">
            <div className="popup-background" onClick={onClose}></div>

            <div className="popup-contents">
                <div className="popup-header">
                    <h3>쿠폰 사용</h3>
                    <div className="close-btn" onClick={onClose}>
                        <IconCross color='var(--color-white)'/>
                    </div>
                </div>
                
                <div className="popup-body">
                    <div className="coupon-details">
                        <div className="coupon">
                            <p className='coupon-title'>{coupon.couponInfo.content}</p>
                            <p className='coupon-discount'>{coupon.couponInfo.discountAmount}{coupon.couponInfo.discountType === 'PRICE' ? '원' : '%'}</p>
                            <p className='coupon-period'>사용기간: {coupon.couponInfo.periodStart} ~ {coupon.couponInfo.periodEnd}</p>
                        </div>
                    </div>
                    <div className="popup-contents">
                        <div className="coupon-notice">
                            <p>쿠폰을 직원에게 보여주세요.</p>
                            <p>쿠폰 사용은 직접 누르지 말아주세요.</p>
                            <p>사용된 쿠폰은 되돌릴 수 없습니다.</p>
                        </div>
                        <button className="use-btn" onClick={handleUse}>사용하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CouponPopup;
