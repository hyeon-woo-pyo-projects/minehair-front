import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Expired() {
    const navigate = useNavigate();

    useEffect(() => {
        alert("로그인이 만료되었습니다.\n다시 로그인 해주세요");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("roleCode");
        navigate("/member/login", { replace: true });
        window.location.reload();
    }, [navigate]);

    return <></>;
}

export default Expired;
