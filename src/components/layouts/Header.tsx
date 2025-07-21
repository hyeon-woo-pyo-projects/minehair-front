import { Link } from 'react-router-dom';
import axios from 'axios';

import { useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import HeaderBanner from './HeaderBanner';

import "../../style/layouts/header.css"

interface menuProps {
    menuId : number;
    menuName : string;
    menuOrderNo : number;
    menuPath : string;
    menuVisible : boolean;
    parentId : string;
    status : "active" | ""
}

function Header () {
    // API 연동 시작
    // 1.메인 메뉴 호출
    const [ mainMenu, setMainMenu ] = useState<menuProps[]>([]);
    
    const getMenu = () => {
        axios
        .get('http://woopi.shop:38081/api/role-menus')
        .then((response) => {
            if ( response.data.success === true ) {
                setMainMenu(response.data.data)
            }
        })
        .catch((error) => {
            console.log('error');
        })
    }

    useEffect(() => {
        getMenu();
    }, []);
    // 연동 끝

    
    // 전체메뉴
    const [ openMenu, setOpenMenu ] = useState(false);
    const toggleMenu = () => { setOpenMenu(!openMenu) }

    // 마우스 호버 시, 각각 메뉴
    const [ isHovered, setIsHovered ] = useState(0);
    
    return (
        <header>
            <HeaderBanner/>

            <div id='headerLine'>
                <div className="inner">
                    <div></div>

                    <Link to="/" id="headerLogo">
                        <img src="" alt="민이헤어_로고" />
                    </Link>
                    
                    <div id='member'>
                        <Link to="/member/login">로그인</Link>
                        <Link to="/">회원가입</Link>
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

                    { mainMenu.map((el, idx) => {
                        return(
                            <li
                            className={`${el.menuVisible}`}
                            onMouseEnter={() => setIsHovered(el.menuId)}
                            onMouseLeave={() => setIsHovered(0)}>
                                <Link to={el.menuPath}>{el.menuName}</Link>
                                <HeaderMenu contents={isHovered} imgSrc= '' isVisible = { isHovered === el.menuId }/>
                            </li>
                        )
                    })}
                </ul>

                <div className={`wholeMenu ${openMenu ? "show" : '' }`}></div>
            </nav>
        </header>
    )
}

export default Header;