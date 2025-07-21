import { BrowserRouter, Link } from 'react-router-dom';
import "../../style/layouts/header.css"
import { useState } from 'react';
import HeaderMenu from './HeaderMenu';

function Header () {

    // 전체메뉴
    const [ openMenu, setOpenMenu ] = useState(false);
    const toggleMenu = () => { setOpenMenu(!openMenu) }

    // 마우스 호버 시, 각각 메뉴
    const [ isHovered, setIsHovered ] = useState(0);

    return (
        <BrowserRouter>
            <header>
                <div id='headerLine'>
                    <div className="inner">
                        <div></div>

                        <Link to="/" id="headerLogo">
                            <img src="" alt="민이헤어_로고" />
                        </Link>
                        
                        <div id='member'>
                            <Link to="/member/login" id="login">로그인</Link>
                            <Link to="/" id="register">회원가입</Link>
                        </div>
                    </div>
                </div>

                <nav>
                    <ul id='headerCategory' className="inner">
                        <button type='button' id='menuBtn' className={openMenu ? 'show' : ''} onClick={toggleMenu}>
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                        </button>

                        <li onMouseEnter={() => setIsHovered(1)} onMouseLeave={() => setIsHovered(0)}>
                            <Link to="">1</Link>
                            { isHovered === 1 ? <HeaderMenu contents={isHovered} imgSrc=''/> : null }
                        </li>

                        <li onMouseEnter={() => setIsHovered(2)} onMouseLeave={() => setIsHovered(0)}>
                            <Link to="">12</Link>
                            { isHovered === 2 ? <HeaderMenu contents={isHovered} imgSrc='12'/> : null }
                        </li>

                        <li onMouseEnter={() => setIsHovered(3)} onMouseLeave={() => setIsHovered(0)}>
                            <Link to="">13</Link>
                            { isHovered === 3 ? <HeaderMenu contents={isHovered} imgSrc=''/> : null }
                        </li>
                    </ul>

                    <div className={`wholeMenu ${openMenu ? "show" : '' }`}></div>
                </nav>
            </header>
        </BrowserRouter>
    )
}

export default Header;