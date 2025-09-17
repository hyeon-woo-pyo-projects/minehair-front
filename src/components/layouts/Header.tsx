import { Link, useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import HeaderBanner from './HeaderBanner';

import "../../style/layouts/header.css"
import axiosInstance from '../../api/axiosInstance';
import IconCross from '../../icons/IconCross';
import IconArrowDown from '../../icons/IconArrowDown';
import QuickButton from '../index/QuickButton';
import CounsultationIconDummy from '../../admin/components/dummy/ConsultationIconDummy';

interface menuProps {
    menuId : number;
    menuName : string;
    menuOrderNo : number;
    menuPath : string;
    menuVisible : boolean;
    parentId : string;
    status : "active" | "",
    imageUrl : string
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

interface LogoProps {
    id : number,
    logoType : string,
    description : string,
    imageUrl : string,
}

interface SnsProps {
    id : number,
    logoId : number,
    orderNo : number,
    imageUrl : string,
    linkUrl : string,
}

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

    // 모바일 메뉴 열림 상태
    const [ mobileShow, setMobileShow ] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState<number | null>(null);

    const toggleMobileMenu = (menuId: number) => {
        if (openMobileMenu === menuId) {
            setOpenMobileMenu(null); // 이미 열려있으면 닫기
        } else {
            setOpenMobileMenu(menuId); // 클릭한 메뉴 열기
        }
    };

    const [ eventBanner, setEventBanner ] = useState({
        id: 0,
        bannerType : 'NAVIGATION',
        imageUrl : '',
        color: '',
        content: '',
        textColor: '',
        link: '',
        isPost: true,
    });

    // 이벤트 배너
    function getEventBanner () {
        axiosInstance
        .get('/banner')
        .then((res)=>{
            if ( res.data.success === true ) {
                const data = res.data.data;
                const eventBanner = data.filter((el) => el.bannerType === 'NAVIGATION' )[0];
                if ( !eventBanner ) { return false; }
                setEventBanner(eventBanner);
            }
        })
    }


    // SNS 데이터 받아오기
    const [ logoData, setLogoData ] = useState<LogoProps[]>([])
    const [ snsData, setSnsData ] = useState<SnsProps[]>([])

    function getSns () {
        axiosInstance.get('/logo')
            .then((res) => {
                if ( res.data.success ) {
                    const logoData = res.data.data.filter((el: LogoProps) => el.logoType === 'NAVIGATION');
                    setLogoData(logoData);
                }
            })
            .catch((err) => {
                if ( err.status === 401 ) navigate('/expired');
                else { if ( err.status === 401 ) navigate('/expired'); else { alert('SNS 불러오기 오류'); console.log(err);} }
            });

        axiosInstance.get('/sns/platform')
            .then((res) => {
                if ( res.data.success ) setSnsData(res.data.data);
            })
            .catch((err) => {
                if ( err.status === 401 ) navigate('/expired');
                else { alert('SNS 불러오기 오류'); console.log(err); }
            });
    }



    useEffect(() => {
        getMenu();
        getSns();
        getEventBanner();
    }, []);

    const [ mobileQuick, setMobileQuick ] = useState(false);
    
    return (
        <>
            <header>
                <HeaderBanner/>

                <div id='headerLine'>
                    <div className="wrapper">
                        <div className='empty'>
                            <button type='button' id='menuBtn' className={openMenu ? 'show' : ''} onClick={() => { setMobileShow(true); }}>
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
                                <Link to="/mypage">마이페이지</Link>
                            </>
                            }
                        </div>

                        <div className="mobile-quick" onClick={()=>{setMobileQuick(!mobileQuick)}}>
                            <button type='button'>
                                <img src={require('../../img/consult.png')} alt="상담하기" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`mobile-showing${mobileQuick === true ? ' active' : '' }`}><CounsultationIconDummy/></div>

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
                                    data-tab={el.menuId}
                                    className={`navMenu ${el.menuVisible ? 'show' : ''}`}
                                    onMouseEnter={() => setIsHovered(el.menuId)}
                                    onMouseLeave={() => setIsHovered(null)}
                                >
                                    <Link to={`/pages${el.menuPath}?menuId=${el.menuId}`}>{el.menuName}</Link>

                                    { connection.length > 0 &&
                                        <div className={`perMenu${isHovered === el.menuId ? ' show' : ''}${el.imageUrl ? ' have-img' : ''}`}>
                                            <div className="categories">
                                                {connection.map((data) => {
                                                    const grandchildren = subSubMenu.filter(child => child.parentId === data.menuId);
                                                    return (
                                                        <div className="category" key={data.menuId}>
                                                            <Link data-tab={data.menuId} to={`/pages${data.menuPath}?menuId=${data.menuId}`}>{data.menuName}</Link>

                                                            {grandchildren.length > 0 &&
                                                                <ul>
                                                                    {grandchildren.map((ele, index) => (
                                                                        <li key={index}>
                                                                            <Link data-tab={ele.menuId} to={`/pages${ele.menuPath}?menuId=${ele.menuId}`}>{ele.menuName}</Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            }
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            {el.imageUrl ?
                                                <div className="image-line">
                                                    <img src={el.imageUrl} alt='메뉴 이미지'/>
                                                </div>
                                            : null}
                                        </div>
                                    }
                                </li>
                            );
                        })}
                    </ul>

                    <div className={`wholeMenu ${openMenu ? "show" : '' }`}>
                        <div className="inner">
                            <ul>
                                { mainMenu.map((el) => {
                                    const connection = subMenu.filter(ss => ss.parentId === el.menuId);

                                    return (
                                        <li key={el.menuId}>
                                            <Link className='wholeMenu-main' to={`${el.menuPath}?menuId=${el.menuId}`} onClick={() => setOpenMenu(false)}>{el.menuName}</Link>

                                            { connection.length > 0 &&
                                                <div className="categories">
                                                    {connection.map((data) => {
                                                        const grandchildren = subSubMenu.filter(child => child.parentId === data.menuId);
                                                        return (
                                                            <div className="category" key={data.menuId}>
                                                                <Link to={`/pages${data.menuPath}?menuId=${data.menuId}`} onClick={() => setOpenMenu(false)}>{data.menuName}</Link>

                                                                {grandchildren.length > 0 &&
                                                                    <div>
                                                                        {grandchildren.map((ele, index) => (
                                                                            <div key={index}>
                                                                                <Link className='small-menu' to={`/pages${ele.menuPath}?menuId=${ele.menuId}`} onClick={() => setOpenMenu(false)}>{ele.menuName}</Link>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                }
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            }
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <div className={`mobile-menu${mobileShow ? ' show' : ''}`}>
                <div className="menu-top">
                    <div className="close-btn" onClick={() => { setMobileShow(false); }}>
                        <IconCross color='#f49d9f' width={30} height={30} />
                    </div>
                </div>

                <div className="menu-body">
                    <div className='mobile-member'>
                        { userLogin === false ?
                        <>
                            <Link to="/member/login" onClick={()=>{setMobileShow(false)}}>로그인</Link>
                            <Link to="/member/register" onClick={()=>{setMobileShow(false)}}>회원가입</Link>
                        </>
                        :
                        <>
                            <Link to='/'  onClick={()=>{setMobileShow(false); logOut();}}>로그아웃</Link>
                            <Link to="/" onClick={()=>{setMobileShow(false)}}>마이페이지</Link>
                        </>
                        }
                    </div>

                    <ul className={`mobile-categories${mobileShow ? ' show' : ''}`}>
                        { mainMenu.map((el) => {
                            const connection = subMenu.filter(ss => ss.parentId === el.menuId);

                            return (
                                <li key={el.menuId}>
                                    <button
                                        type="button"
                                        className="wholeMenu-main"
                                        onClick={() => {
                                            if (connection.length > 0) {
                                                toggleMobileMenu(el.menuId);
                                            } else {
                                                navigate(`/pages${el.menuPath}?menuId=${el.menuId}`);
                                                setMobileShow(false);
                                            }
                                        }}
                                    >
                                        {el.menuName}
                                        { connection.length > 0 && (
                                            <div className={`arrow${openMobileMenu === el.menuId ? ' show' : ''}`}>
                                                <IconArrowDown
                                                    color='var(--color-black)'
                                                    width={15}
                                                    height={15}
                                                />
                                            </div>
                                        )}
                                    </button>
                                    
                                    { connection.length > 0 && openMobileMenu === el.menuId && (
                                        <div className="categories">
                                            {connection.map((data) => {
                                                const grandchildren = subSubMenu.filter(child => child.parentId === data.menuId);
                                                return (
                                                    <div className="category" key={data.menuId}>
                                                        <Link to={`/pages${data.menuPath}?menuId=${data.menuId}`} onClick={() => setMobileShow(false)}>{data.menuName}</Link>

                                                        {grandchildren.length > 0 &&
                                                            <div>
                                                                {grandchildren.map((ele, index) => (
                                                                    <div key={index}>
                                                                        <Link className='small-menu' to={`/pages${ele.menuPath}?menuId=${ele.menuId}`} onClick={() => setMobileShow(false)}>{ele.menuName}</Link>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="menu-footer">
                    { eventBanner.id !== 0 ? 
                        <div className="event-banner" onClick={() => setMobileShow(false)}>
                            <Link to={'/pages/event'}><img src={eventBanner.imageUrl}/></Link>
                        </div>
                    : null}

                    { logoData.length > 0 ?
                        <div className="sns-platform">
                            {logoData.map((el) => {
                                return (
                                    <section key={el.id}>
                                        <div className="main-logo">
                                            <img src={el.imageUrl} alt="섹션 메인 로고"/>
                                        </div>
    
                                        <div className="sns-child">
                                            { snsData.map((ele) => {
                                                if ( el.id === ele.logoId ) {
                                                    return (
                                                        <a
                                                            href={ele.linkUrl.startsWith('http') ? ele.linkUrl : `https://${ele.linkUrl}`}
                                                            target='_blank'
                                                            rel="noopener noreferrer"
                                                            key={ele.id}
                                                        >
                                                            <img src={ele.imageUrl} alt="SNS 이미지"/>
                                                        </a>
                                                    )
                                                }
                                            }) }
                                        </div>
                                    </section>
                                )
                            })}
                        </div>
                    : null }
                </div>
            </div>
        </>
    )
}

export default Header;