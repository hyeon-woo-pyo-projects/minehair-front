import { Link, useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import HeaderBanner from './HeaderBanner';

import "../../style/layouts/header.css"
import axiosInstance from '../../api/axiosInstance';

interface menuProps {
    menuId : number;
    menuName : string;
    menuOrderNo : number;
    menuPath : string;
    menuVisible : boolean;
    parentId : string;
    status : "active" | ""
}

type subMenuProps = {
    id : number;
    imageUrl : string,
    menuId : number;
    menuName : string;
    menuOrderNo : number;
    menuPath : string;
    menuType : string;
    menuVisible : boolean;
    parentId : number;
    roleIdList : []
};

type subSubMenuProps = {
    id : number;
    imageUrl : string,
    menuId : number;
    menuName : string;
    menuOrderNo : number;
    menuPath : string;
    menuType : string;
    menuVisible : boolean;
    parentId : number;
    roleIdList : []
};

function Header () {
    const navigate = useNavigate();
    // API 연동 시작
    // 1.메인 메뉴 호출
    const [ mainMenu, setMainMenu ] = useState<menuProps[]>([]);
    const [ subMenu, setSubMenu ] = useState<subMenuProps[]>([]);
    const [ subSubMenu, setSubSubMenu] = useState<subSubMenuProps[]>([]);
    
    const getMenu = () => {
        axiosInstance
            .get('/role-menus')
            .then((response) => {
                if (response.data.success === true) {
                    const rawMenu: any[] = response.data.data;

                    // 1. 메인 메뉴 추출
                    const mainMenus = rawMenu.filter((el) => el.menuType === 'MAJOR');
                    setMainMenu(mainMenus);

                    // 2. 서브 메뉴 추출 (메인 메뉴의 자식)
                    const subMenus = rawMenu.filter((el) => el.menuType === 'MINOR');
                    setSubMenu(subMenus);

                    // 3. 서브서브 메뉴 추출 (서브 메뉴의 자식)
                    const subSubMenus = rawMenu.filter((el) => el.menuType === 'SUB');
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
    const [isHovered, setIsHovered] = useState<number | null>(null);

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
                    <div className='empty'>
                        <button type='button' id='menuBtn' className={openMenu ? 'show' : ''} onClick={toggleMenu}>
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                        </button>
                    </div>

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
                        const connection = subMenu.filter(ss => ss.parentId === el.menuId);
                        
                        return (
                            <li
                                key={el.menuId}
                                data-tab={`menu${el.menuId}`}
                                className={`navMenu ${el.menuVisible ? 'show' : ''}`}
                                onMouseEnter={() => setIsHovered(el.menuId)}
                                onMouseLeave={() => setIsHovered(null)}
                            >
                                <Link to={`/pages${el.menuPath}`}>{el.menuName}</Link>

                                { connection.length > 0 &&
                                    <div className={`perMenu ${isHovered === el.menuId ? 'show' : ''}`}>
                                        <div className="categories">
                                            {connection.map((data) => {
                                                const grandchildren = subSubMenu.filter(child => child.parentId === data.menuId);
                                                return (
                                                    <div className="category" key={data.menuId}>
                                                        <Link to={`/pages${data.menuPath}`}>{data.menuName}</Link>

                                                        {grandchildren.length > 0 &&
                                                            <ul>
                                                                {grandchildren.map((ele, index) => (
                                                                    <li key={index}>
                                                                        <Link to={`/pages${ele.menuPath}`}>{ele.menuName}</Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                }
                            </li>
                        );
                    })}
                </ul>

                <div className={`wholeMenu ${openMenu ? "show" : '' }`}>
                    <div className="wrapper">
                        { mainMenu.map((el) => {
                            return (
                                <>{el.menuName}</>
                            )
                        })}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;