import { BrowserRouter, Link } from 'react-router-dom';
import "../../style/layouts/header.css"
import { useState } from 'react';

function Header () {

    // 전체메뉴
    const [openMenu, setOpenMenu] = useState(false);
    const toggleMenu = () => { setOpenMenu(!openMenu) }

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
                            <Link to="/" id="login">로그인</Link>
                            <Link to="/" id="register">회원가입</Link>
                        </div>
                    </div>
                </div>

                <nav>
                    <div className="inner">
                        <button type='button' id='menuBtn' className={openMenu ? 'show' : ''} onClick={toggleMenu}>
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                        </button>
                        <Link to="">1</Link>
                        <Link to="">12</Link>
                        <Link to="">13</Link>
                    </div>

                    <div className={`wholeMenu ${openMenu ? "show" : '' }`}></div>
                </nav>
            </header>
        </BrowserRouter>
    )
}

export default Header;