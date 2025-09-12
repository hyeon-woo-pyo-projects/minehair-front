import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import IconPencil from "../../icons/IconPencil";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
    id: number;
    name: string;
}

interface ItemProps {
    categoryId: number;
    content: string;
    id: number;
    imageUrl: string;
    title: string;
}

function Review() {
    const navigate = useNavigate();
    const [category, setCategory] = useState<CategoryProps[]>([]);
    const [items, setItems] = useState<ItemProps[]>([]);
    const [activeCategory, setActiveCategory] = useState<number>(0); // 선택된 카테고리 id

    // 초기 카테고리, 아이템 데이터 가져오기
    const getData = () => {
        // 카테고리
        axiosInstance
            .get('/board/review/category')
            .then((res) => {
                if (res.data.success) {
                    setCategory(res.data.data);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate('/expired');
                else { alert('오류가 발생했습니다'); console.log(err); }
            });

        // 전체 리뷰
        axiosInstance
            .get('/board/review/page')
            .then((res) => {
                if (res.data.success) {
                    setItems(res.data.data);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate('/expired');
                else { alert('오류가 발생했습니다'); console.log(err); }
            });
    };

    // 카테고리 클릭 시 해당 아이템 조회
    const categorySet = (data: CategoryProps) => {
        setActiveCategory(data.id);

        // 전체면 params 없이 호출, 아니면 categoryId 포함
        const params = data.id === 0 ? {} : { categoryId: data.id };

        axiosInstance
            .get('/board/review/page', { params })
            .then((res) => {
                if (res.data.success) {
                    setItems(res.data.data);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate('/expired');
                else { alert('오류가 발생했습니다'); console.log(err); }
            });
    };

    // 리뷰 클릭 시 상세 페이지로 이동
    const handleClick = (data: ItemProps) => {
        navigate('/pages/review-details', { state: { id: data.id } });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="pages" id="pages-review">
            <h1 className="page-title">REVIEW</h1>

            <div className="pages-body wrapper">
                {/* 카테고리 네비 */}
                <div className="nav-view">
                    {category.length > 0 ? (
                        <ul>
                            <li
                                className={activeCategory === 0 ? 'active' : ''}
                                onClick={() => categorySet({ id: 0, name: '전체' })}
                            >
                                전체
                            </li>
                            {category.map((el) => (
                                <li
                                    key={el.id}
                                    className={activeCategory === el.id ? 'active' : ''}
                                    onClick={() => categorySet(el)}
                                >
                                    {el.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty-notice">데이터가 없습니다.</p>
                    )}
                </div>

                {/* 글쓰기 버튼 */}
                <div className="header-menu">
                    <button
                        type="button"
                        className="green-btn small-btn"
                        onClick={() => navigate('/pages/review-write')}
                    >
                        <IconPencil color="var(--color-white)" width={15} height={15} />
                        글쓰기
                    </button>
                </div>

                {/* 리뷰 리스트 */}
                <ul className="items">
                    {items.map((el) => (
                        <li key={el.id} onClick={() => handleClick(el)}>
                            <div className="img-line">
                                <img src={el.imageUrl} alt="리뷰 사진" />
                            </div>
                            <p className="review-title">{el.title}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Review;
