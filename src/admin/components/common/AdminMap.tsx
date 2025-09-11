import { useEffect, useState } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";

function AdminMap () {
    const navigate = useNavigate();
    const [coords, setCoords] = useState({ lat: 33.450701, lng: 126.570667 });
    const [address, setAddress] = useState("");
    const [kakaoLoaded, setKakaoLoaded] = useState(false);
    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if (window.kakao) {
            setKakaoLoaded(true);
        } else {
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services`;
            script.async = true;
            script.onload = () => setKakaoLoaded(true);
            document.head.appendChild(script);
        }
    }, []);

    const handleSearch = () => {
        if (!kakaoLoaded) return alert("카카오맵이 아직 로드되지 않았습니다.");

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const resultData = result[0];
                const { y, x } = result[0];
                setCoords({ lat: parseFloat(y), lng: parseFloat(x) });
                setDisabled(false);
                setAddress(resultData.address_name);
            } else {
                alert("주소를 찾을 수 없습니다.");
                setDisabled(true);
            }
        });
    };

    function handleSave(){
        
    }

    return (
        <div className="admin-page" id="admin-map">
            <div className="admin-body wrapper">
                <h1 className="admin-title">지도 설정</h1>

                <div className="contents-view">
                    {kakaoLoaded && (
                        <Map
                            center={coords}
                            style={{ width: "100%", height: "350px" }}
                            level={3}
                        >
                            <CustomOverlayMap position={coords} yAnchor={1}>
                                <a
                                    href={`https://map.kakao.com/link/map/${coords.lat},${coords.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textDecoration: "none",
                                        color: "#000",
                                    }}
                                >
                                    {/* 마커 아이콘 */}
                                    <div
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            backgroundImage: "url('https://t1.daumcdn.net/localimg/localimages/07/2018/pc/map/marker_map01.png')",
                                            backgroundSize : 'contain',
                                            backgroundRepeat : 'no-repeat',
                                            backgroundPosition : 'center center',
                                            marginBottom: "-80px",
                                            marginRight: "-15px",
                                        }}
                                    />

                                    {/* 말풍선 */}
                                    <div
                                        style={{
                                            padding: "5px 10px",
                                            background: "#fff",
                                            border: "1px solid #000",
                                            borderRadius: "5px",
                                            fontSize: "14px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {address}
                                    </div>
                                </a>
                            </CustomOverlayMap>
                        </Map>
                    )}
                </div>

                <form className="admin-form">
                    <ul>
                        <li className="w-100">
                            <span className="admin-form-title">주소 검색</span>

                            <div className="input-area">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="주소를 입력하세요"
                                />

                                <button type="button" className="search-btn blackBtn" onClick={handleSearch}>검색</button>
                            </div>
                        </li>
                    </ul>

                    <div className="admin-btns">
                        <button className="blackBtn" type="button" onClick={() => navigate(-1)}>뒤로가기</button>
                        <button className="primaryBtn" type="button" disabled={disabled}>저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminMap;