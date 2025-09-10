import { useState } from "react";
import { Link } from "react-router-dom";
import IconArrowRight from "../../../../icons/IconArrowRight";

function ConsultNav({ onChangePage }) {
    const [ page, setPage ] = useState(0);

    const handleClick = (num) => {
        setPage(num);
        onChangePage(num);  // 부모에게 알려줌
    }

    return (
        <nav className="side-nav">
            <ul>
                <li><button onClick={() => handleClick(1)}>상담 카테고리 설정</button></li>
                <li><button onClick={() => handleClick(2)}>카테고리 섹션 배경 설정</button></li>
            </ul>
        </nav>
    )
}

export default ConsultNav;
