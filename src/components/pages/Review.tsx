import { ReactNode, useEffect, useState } from "react";
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

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
}

function Review() {
    const navigate = useNavigate();
    const [role, setRole] = useState<any>("");
    const [category, setCategory] = useState<CategoryProps[]>([]);
    const [items, setItems] = useState<ItemProps[]>([]);
    const [activeCategory, setActiveCategory] = useState<number>(0);
    const [pagination, setPagination] = useState<PaginationProps | null>(null);

    // 데이터 가져오기
    const getData = (page: number = 1, categoryId?: number) => {
        const params: any = { page, size: 6 };
        if (categoryId && categoryId !== 0) {
            params.categoryId = categoryId;
        }

        // 카테고리 가져오기 (최초 1회)
        if (category.length === 0) {
            axiosInstance
                .get("/board/review/category")
                .then((res) => {
                    if (res.data.success) {
                        setCategory(res.data.data);
                    }
                })
                .catch((err) => {
                    if (err.status === 401) navigate("/expired");
                    else {
                        alert("오류가 발생했습니다");
                        console.log(err);
                    }
                });
        }

        // 리뷰 목록 가져오기
        axiosInstance
            .get("/board/review/page", { params })
            .then((res) => {
                if (res.data.success) {
                    setItems(res.data.data);
                    setPagination(res.data.pagination);
                }
            })
            .catch((err) => {
                if (err.status === 401) navigate("/expired");
                else {
                    alert("오류가 발생했습니다");
                    console.log(err);
                }
            });
    };

    // 카테고리 선택
    const categorySet = (data: CategoryProps) => {
        setActiveCategory(data.id);
        getData(1, data.id); // 선택 시 1페이지부터 다시 조회
    };

    // 리뷰 클릭 시 상세 페이지
    const handleClick = (data: ItemProps) => {
        navigate("/pages/review-details", { state: { id: data.id } });
    };

    // 페이지 이동
    const handlePageChange = (page: number) => {
        if (pagination && (page < 1 || page > pagination.totalPages)) return;
        getData(page, activeCategory);
    };

    useEffect(() => {
        const role = localStorage.getItem("roleCode");
        setRole(role);
        getData(1);
    }, []);

    // 페이지네이션 UI
    const renderPagination = () => {
        if (!pagination) return null;

        const { currentPage, totalPages } = pagination;
        const groupSize = 10; // 한 그룹에 최대 10개 버튼
        const currentGroup = Math.floor((currentPage - 1) / groupSize);
        const startPage = currentGroup * groupSize + 1;
        const endPage = Math.min(startPage + groupSize - 1, totalPages);

        const pages: ReactNode[] = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={i === currentPage ? "active" : ""}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination">
                {/* 이전 그룹 */}
                {startPage > 1 && (
                    <button onClick={() => handlePageChange(startPage - 1)}>
                        ◀
                    </button>
                )}

                {/* 개별 페이지 */}
                {pages}

                {/* 다음 그룹 */}
                {endPage < totalPages && (
                    <button onClick={() => handlePageChange(endPage + 1)}>
                        ▶
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="pages" id="pages-review">
            <h1 className="page-title">REVIEW</h1>

            <div className="pages-body wrapper">
                {/* 카테고리 네비 */}
                <div className="nav-view">
                    {category.length > 0 ? (
                        <ul>
                            <li
                                className={activeCategory === 0 ? "active" : ""}
                                onClick={() => categorySet({ id: 0, name: "전체" })}
                            >
                                전체
                            </li>
                            {category.map((el) => (
                                <li
                                    key={el.id}
                                    className={activeCategory === el.id ? "active" : ""}
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
                {role === "ROLE_ADMIN" && (
                    <div className="header-menu">
                        <button
                            type="button"
                            className="green-btn small-btn"
                            onClick={() => navigate("/pages/review-write")}
                        >
                            <IconPencil
                                color="var(--color-white)"
                                width={15}
                                height={15}
                            />
                            글쓰기
                        </button>
                    </div>
                )}

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

                {/* 페이지네이션 */}
                {renderPagination()}
            </div>
        </div>
    );
}

export default Review;
