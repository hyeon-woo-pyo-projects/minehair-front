import { useState } from "react";
import { Link } from "react-router-dom";
import IconArrowRight from "../../../../icons/IconArrowRight";

function EventNav({ onChangePage }) {
    const [ page, setPage ] = useState(0);

    const handleClick = (num) => {
        setPage(num);
        onChangePage(num);  // 부모에게 알려줌
    }

    return (
        <nav className="side-nav">
            <ul>
                <li><button onClick={() => handleClick(1)}>이벤트 그리드</button></li>
                <li><button onClick={() => handleClick(2)}>이벤트 슬라이드</button></li>
                <li><button onClick={() => handleClick(3)}>이벤트 배너</button></li>
            </ul>

            <div className="side-footer">
                <Link to={'/pages/event'}>페이지 바로가기<IconArrowRight color="var(--color-black)" width={12} height={12}/></Link>
            </div>
        </nav>
    )
}

export default EventNav;
