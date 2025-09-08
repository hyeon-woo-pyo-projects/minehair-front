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
    coupon: MyCouponProps | null;   // ✅ 선택된 쿠폰
    onClose: () => void;            // ✅ 닫기 함수
}

function CouponPopup({ coupon, onClose }: CouponPopupProps) {
    if (!coupon) return null; // ✅ 선택된 쿠폰 없으면 팝업 안 띄움

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
                        <button className="use-btn" onClick={() => alert(`${coupon.couponInfo.content} 쿠폰 사용!`)}>사용하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CouponPopup;
