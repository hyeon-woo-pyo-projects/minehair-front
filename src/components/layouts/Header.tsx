import { Link, useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import HeaderBanner from './HeaderBanner';

import "../../style/layouts/header.css"
import axiosInstance from '../../api/axiosInstance';

interface menuProps {
    menuId : string;
    menuName : string;
    menuOrderNo : number;
    menuPath : string;
    menuVisible : boolean;
    parentId : string;
    status : "active" | ""
}

type subMenuProps = {
    parent : string,
    title: string,
    link: string,
    menuId : string,
};

type subSubMenuProps = {
    parent: string;
    title: string;
    link: string;
};

function Header () {
    const navigate = useNavigate();
    // API 연동 시작
    // 1.메인 메뉴 호출
    const [ mainMenu, setMainMenu ] = useState<menuProps[]>([]);
    let [ subMenu, setSubMenu ] = useState<subMenuProps[]>([]);
    const [subSubMenu, setSubSubMenu] = useState<subSubMenuProps[]>([]);
    
    const getMenu = () => {
        axiosInstance
            .get('/role-menus')
            .then((response) => {
                if (response.data.success === true) {
                    const rawMenu: any[] = response.data.data;

                    // 1. 메인 메뉴 추출
                    const mainMenus = rawMenu.filter((el) => el.parentId === null);
                    setMainMenu(mainMenus);

                    // 2. 서브 메뉴 추출 (메인 메뉴의 자식)
                    const mainMenuIds = mainMenus.map((menu) => menu.menuId);
                    const subMenus = rawMenu.filter(
                        (el) => el.parentId !== null && mainMenuIds.includes(el.parentId)
                    );

                    const formattedSubMenus = subMenus.map((el) => ({
                        parent: el.parentId,
                        menuId : el.menuId,
                        title: el.menuName,
                        link: el.menuPath,
                    }));

                    setSubMenu(formattedSubMenus);

                    // 3. 서브서브 메뉴 추출 (서브 메뉴의 자식)
                    const subMenuIds = subMenus.map((menu) => menu.menuId);
                    const subSubMenus = rawMenu
                        .filter((el) => el.parentId !== null && subMenuIds.includes(el.parentId))
                        .map((el) => ({
                            parent: el.parentId,
                            title: el.menuName,
                            link: el.menuPath,
                        }));

                    setSubSubMenu(subSubMenus);
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    };


    useEffect(() => {
        getMenu();
    }, []);
    // 연동 끝

    
    // 전체메뉴
    const [ openMenu, setOpenMenu ] = useState(false);
    const toggleMenu = () => { setOpenMenu(!openMenu) }

    // 마우스 호버 시, 각각 메뉴
    const [ isHovered, setIsHovered ] = useState('');

    // 로그인 감지
    const [ userLogin, setUserLogin ] = useState(false);
    useEffect(()=>{
        const token = localStorage.getItem('accessToken');
        setUserLogin(!!token);
    }, [])

    // 로그아웃
    const logOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('roleCode');
        setUserLogin(false);
        navigate('/');
        window.location.reload();
    }
    
    return (
        <header>
            <HeaderBanner/>

            <div id='headerLine'>
                <div className="wrapper">
                    <div className='empty'></div>

                    <Link to="/" id="headerLogo">
                        <img src={require('../../img/logo.png')} alt="민이헤어_로고" />
                    </Link>
                    
                    <div id='member'>
                        { userLogin === false ?
                        <>
                            <Link to="/member/login">로그인</Link>
                            <Link to="/member/register">회원가입</Link>
                        </>
                        :
                        <>
                            <Link to='/' onClick={logOut}>로그아웃</Link>
                            <Link to="/">마이페이지</Link>
                        </>
                        }
                    </div>
                </div>
            </div>

            <nav>
                <ul id='headerCategory' className="wrapper">
                    <button type='button' id='menuBtn' className={openMenu ? 'show' : ''} onClick={toggleMenu}>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                    </button>

                    { mainMenu.map((el) => {
                        return (
                            <li
                                key={el.menuId}
                                data-tab={`menu${el.menuId}`}
                                className={`navMenu ${el.menuVisible}`}
                                onMouseEnter={() => setIsHovered(el.menuId)}
                                onMouseLeave={() => setIsHovered('')}
                                onClick={() => {
                                    const firstSub = subMenu.find((data) => data.parent === el.menuId);
                                    if (firstSub) {
                                        navigate(firstSub.link);
                                    }
                                }}
                            >
                                <Link to={el.menuPath}>{el.menuName}</Link>
                                
                                {subMenu.map((data) => {
                                    if (el.menuId === data.parent) {
                                        const grandchildren = subSubMenu.filter(
                                            (child) => child.parent === data.menuId
                                        );

                                        return (
                                            <HeaderMenu
                                                key={data.link}
                                                contents={data}
                                                imgSrc=""
                                                isVisible={isHovered === el.menuId}
                                                childrenMenu={grandchildren}
                                            />
                                        );
                                    }

                                    return null;
                                })}
                            </li>
                        );
                    })}

                </ul>

                <div className={`wholeMenu ${openMenu ? "show" : '' }`}></div>
            </nav>
        </header>
    )
}

export default Header;