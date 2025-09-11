import { useEffect, useState } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

function AdminMap() {
  const navigate = useNavigate();

  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({
    id: 0,
    lat: 0,
    lng: 0,
    address: "",
    detailAddress: "",
  });

  // 카카오맵 SDK 로드
  useEffect(() => {
    if (window.kakao) {
      setKakaoLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services`;
      script.async = true;
      script.onload = () => setKakaoLoaded(true);
      document.head.appendChild(script);
    }
  }, []);

  // 서버에서 기존 데이터 가져오기
  const getData = () => {
    axiosInstance
      .get("/map-address")
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          const fetched = res.data.data[0];
          setEdit(true);
          setData({
            id: fetched.id,
            lat: fetched.lat,
            lng: fetched.lng,
            address: fetched.address,
            detailAddress: fetched.detailAddress,
          });
          setDisabled(false);
        }
      })
      .catch((err) => {
        if (err.status === 401) navigate("/expired");
        else {
          alert("오류가 발생했습니다");
          console.log(err);
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // 주소 검색
  const handleSearch = () => {
    if (!kakaoLoaded) return alert("카카오맵이 아직 로드되지 않았습니다.");

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(data.address, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const resultData = result[0];
        setData((prev) => ({
          ...prev,
          lat: parseFloat(resultData.y),
          lng: parseFloat(resultData.x),
          address: resultData.address_name,
        }));
        setDisabled(false);
      } else {
        alert("주소를 찾을 수 없습니다.");
        setDisabled(true);
      }
    });
  };

  // 저장
  const handleSave = () => {
    if (!edit) {
      axiosInstance
        .post("/map-address", {
          lat: data.lat,
          lng: data.lng,
          address: data.address,
          detailAddress: data.detailAddress,
        })
        .then((res) => {
          if (res.data.success) {
            alert("저장되었습니다");
            window.location.reload();
          }
        })
        .catch((err) => {
          if (err.status === 401) navigate("/expired");
          else {
            alert("오류가 발생했습니다");
            console.log(err);
          }
        });
    } else {
      axiosInstance
        .patch(`/map-address/${data.id}`, {
          lat: data.lat,
          lng: data.lng,
          address: data.address,
          detailAddress: data.detailAddress,
        })
        .then((res) => {
          if (res.data.success) {
            alert("저장되었습니다");
            window.location.reload();
          }
        })
        .catch((err) => {
          if (err.status === 401) navigate("/expired");
          else {
            alert("오류가 발생했습니다");
            console.log(err);
          }
        });
    }
  };

  return (
    <div className="admin-page" id="admin-map">
      <div className="admin-body wrapper">
        <h1 className="admin-title">지도 설정</h1>

        <div className="contents-view">
          {kakaoLoaded && data.lat !== 0 && data.lng !== 0 && (
            <Map
              center={{ lat: data.lat, lng: data.lng }}
              style={{ width: "100%", height: "350px" }}
              level={3}
            >
              <CustomOverlayMap position={{ lat: data.lat, lng: data.lng }} yAnchor={1}>
                <a
                  href={`https://map.kakao.com/link/map/${data.lat},${data.lng}`}
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
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundImage:
                        "url('https://t1.daumcdn.net/localimg/localimages/07/2018/pc/map/marker_map01.png')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                    }}
                  />
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
                    {data.address}
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
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  placeholder="주소를 입력하세요"
                />
                <button type="button" className="search-btn blackBtn" onClick={handleSearch}>
                  검색
                </button>
              </div>
            </li>
          </ul>

          <div className="admin-btns">
            <button className="blackBtn" type="button" onClick={() => navigate(-1)}>
              뒤로가기
            </button>
            <button className="primaryBtn" type="button" disabled={disabled} onClick={handleSave}>
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminMap;
