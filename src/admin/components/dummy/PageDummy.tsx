import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import ConsultationDummy from './ConsultationDummy';
import EventSlideDummy from './EventSlideDummy';
import IconArrowDown from '../../../icons/IconArrowDown';

interface DataProps {
    id: number;
    menuId: number;
    orderNo: number;
    pageUrl: string;
    contentsType: string;
    contentsUrl: string;
    consultingBackGroundUrl: string;
    videoBackGroundUrl: string;
}

interface MenuProps {
    id: number;
    menuId: number;
    menuOrderNo: number;
    parentId: number;
    imageUrl: string;
    menuPath: string;
    menuType: string;
    menuName: string;
    isContent: boolean;
    menuVisible: boolean;
    roleIdList: [];
}

function PageDummy() {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const menuId = params.get('menuId');

    const [data, setData] = useState<DataProps[]>([]);
    const [major, setMajor] = useState<MenuProps[]>([]);
    const [minor, setMinor] = useState<MenuProps[]>([]);
    const [sub, setSub] = useState<MenuProps[]>([]);

    function getData() {
        axiosInstance
            .get(`/page/contents/${menuId}`)
            .then((res) => {
                if (res.data.success === true) {
                    const data = res.data.data;
                    setData(data);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate('/expired');
                else {
                    alert('오류가 발생했습니다.');
                    console.log(err);
                }
            });
    }

    function getList() {
        axiosInstance
            .get('/role-menus')
            .then((res) => {
                if (res.data.success === true) {
                    const data = res.data.data;
                    const major = data.filter((el: MenuProps) => el.menuType === 'MAJOR');
                    const minor = data.filter((el: MenuProps) => el.menuType === 'MINOR');
                    const sub = data.filter((el: MenuProps) => el.menuType === 'SUB');

                    setMajor(major);
                    setMinor(minor);
                    setSub(sub);

                    console.log(major, minor, sub);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate('/expired');
                else {
                    alert('오류가 발생했습니다.');
                    console.log(err);
                }
            });
    }

    const [ openNav, setOpenNav ] = useState({
        nav1 : false,
        nav2 : false,
        nav3 : false,
    })

    function closeNav(){
        setOpenNav({
            nav1 : false,
            nav2 : false,
            nav3 : false,
        });
    }

    useEffect(() => {
        getData();
        getList();
    }, [menuId]);

    // 현재 major
    const currentMajor = major.find((el) => el.menuId === parseInt(menuId || '0'));

    // 현재 major를 parentId로 가지는 minor 목록
    const childMinors = minor.filter((el) => el.parentId === parseInt(menuId || '0'));
    const currentMinor = childMinors.length > 0 ? childMinors[0] : null;

    // 현재 minor를 parentId로 가지는 sub 목록
    const childSubs = currentMinor
        ? sub.filter((el) => el.parentId === currentMinor.menuId)
        : [];

    return (
        <div className="main-page">
            <nav className="mobile-nav">
                <ul>
                    {/* major */}
                    <li>
                        <div className="current-menu major" onClick={() => { setOpenNav({ ...openNav ,nav1 : !openNav.nav1}) }}>
                            {currentMajor && <span>{currentMajor.menuName}</span>}
                            <IconArrowDown color="var(--color-white)" width={13} height={13} />
                        </div>

                        <div className={`menus major${ openNav.nav1 === true && ' open' }`}>
                            {major.map((el) => (
                                <Link
                                    key={el.id}
                                    to={`/pages${el.menuPath}?menuId=${el.menuId}`}
                                    onClick={closeNav}
                                >
                                    {el.menuName}
                                </Link>
                            ))}
                        </div>
                    </li>

                    {/* minor */}
                    {childMinors.length > 0 && (
                        <li>
                            <div className="current-menu minor" onClick={() => { setOpenNav({ ...openNav ,nav2 : !openNav.nav2}) }}>
                                <span>{currentMinor?.menuName}</span>
                                <IconArrowDown
                                    color="var(--color-white)"
                                    width={13}
                                    height={13}
                                />
                            </div>

                            <div className={`menus minor${ openNav.nav2 === true && ' open' }`}>
                                {childMinors.map((el) => (
                                    <Link
                                        key={el.id}
                                        to={`/pages${el.menuPath}?menuId=${el.menuId}`}
                                        onClick={closeNav}
                                    >
                                        {el.menuName}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    )}

                    {/* sub */}
                    {childSubs.length > 0 && (
                        <li>
                            <div className="current-menu sub" onClick={() => { setOpenNav({ ...openNav ,nav3 : !openNav.nav3}) }}>
                                <span>{childSubs[0].menuName}</span>
                                <IconArrowDown
                                    color="var(--color-white)"
                                    width={13}
                                    height={13}
                                />
                            </div>

                            <div className={`menus sub${ openNav.nav3 === true && ' open' }`}>
                                {childSubs.map((el) => (
                                    <Link
                                        key={el.id}
                                        to={`/pages${el.menuPath}?menuId=${el.menuId}`}
                                        onClick={closeNav}
                                    >
                                        {el.menuName}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    )}
                </ul>
            </nav>

            {/* contents */}
            {data.length > 0 ? (
                data.map((el) => (
                    <section key={el.id}>
                        {el.contentsType === 'IMAGE' && (
                            <div className="img-line">
                                <img src={el.contentsUrl} alt="이미지" />
                            </div>
                        )}

                        {el.contentsType === 'VIDEO' && (
                            <div
                                className="video-line"
                                style={{
                                    backgroundImage: `url('${el.videoBackGroundUrl}')`,
                                }}
                            >
                                <iframe
                                    width="560"
                                    height="315"
                                    src={el.contentsUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </section>
                ))
            ) : (
                <></>
            )}

            <EventSlideDummy />
            <ConsultationDummy />
        </div>
    );
}

export default PageDummy;
