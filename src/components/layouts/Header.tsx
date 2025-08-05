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
};

function Header () {
    const navigate = useNavigate();
    // API 연동 시작
    // 1.메인 메뉴 호출
    const [ mainMenu, setMainMenu ] = useState<menuProps[]>([]);
    let [ subMenu, setSubMenu ] = useState<subMenuProps[]>([])
    
    const getMenu = () => {
        axiosInstance
        .get('/role-menus')
        .then((response) => {
            if ( response.data.success === true ) {
                const setMenu : any[] = [];
                response.data.data.forEach((el: any)=>{
                    if ( el.parentId === null ) {
                        setMenu.push(el);
                    }else {
                        let parentId = el.parentId;

                        document.querySelectorAll('.navMenu').forEach((data)=>{
                            let menuTab = data.getAttribute('data-tab')?.replaceAll('menu', '')
                            
                            if ( parentId === Number(menuTab) ) {
                                setSubMenu((prev) => [
                                    ...prev,
                                    {
                                        parent : el.parentId,
                                        title : el.menuName,
                                        link : el.menuPath,
                                    }
                                ]);
                            }
                        });

                    }
                })
                
                setMainMenu(setMenu);
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
                    <div></div>

                    <Link to="/" id="headerLogo">
                        <img src="" alt="민이헤어_로고" />
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
                                
                                {subMenu.map((data) =>
                                    el.menuId === data.parent ? (
                                        <HeaderMenu
                                            key={data.link}  // 또는 data.title 등 유니크한 값
                                            contents={data}
                                            imgSrc=""
                                            isVisible={isHovered === el.menuId}
                                        />
                                    ) : null
                                )}
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