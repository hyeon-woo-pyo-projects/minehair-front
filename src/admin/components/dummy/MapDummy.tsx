import { useEffect, useState } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";

export default function MapDummy() {
  const [coords, setCoords] = useState({ lat: 33.450701, lng: 126.570667 });
  const [address, setAddress] = useState("");
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

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

  return (
    <div>
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
  );
}
