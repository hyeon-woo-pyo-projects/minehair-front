import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import IconPencil from "../../icons/IconPencil";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
    id : number,
    name : string
}

interface ItemProps {
    categoryId : number,
    content : string,
    id : number,
    imageUrl : string,
    title : string,
}

function Review () {
    const navigate = useNavigate();
    const [ category, setCategory ] = useState<CategoryProps[]>([]);
    const [ items, setItems ] = useState<ItemProps[]>([])

    function getData (){
        axiosInstance
        .get('/board/review/category')
        .then((res) => {
            if (res.data.success === true) {
                const data = res.data.data;
                setCategory(data);
            }
        })

        axiosInstance
        .get('/board/review/page')
        .then((res) => {
            if (res.data.success === true) {
                const data = res.data.data;
                setItems(data);
                console.log(data);
            }
        })
        .catch((err) => {  if ( err.status === 401 ) navigate('/expired'); else { alert('오류가 발생했습니다'); console.log(err); }})
    }

    function handleClick(data:ItemProps){
        navigate('/pages/review-details', { state: { id: data.id } });
    }

    useEffect(()=>{
        getData();
    },[])

    return(
        <div className="pages" id="pages-review">
            <h1 className="page-title">REVIEW</h1>

            <div className="pages-body wrapper">
                <div className="nav-view">
                    {category.length > 0 ?
                        <ul>
                            <li className="active">전체</li>
                            {category.map((el)=>{
                                return (
                                    <li key={el.id}>{el.name}</li>
                                )
                            })}
                        </ul>
                    :
                        <p className="empty-notice">데이터가 없습니다.</p>
                    }
                </div>

                <div className="header-menu">
                    <button type="button" className="green-btn small-btn" onClick={() => { navigate('/pages/review-write') }}>
                        <IconPencil color="var(--color-white)" width={15} height={15}/>
                        글쓰기
                    </button>
                </div>

                <div className="items">
                    { items.map((el)=>{
                        return(
                            <li key={el.id} onClick={() => {handleClick(el)}}>
                                <div className="img-line"><img src={el.imageUrl} alt="리뷰 사진"/></div>

                                <p className="review-title">{el.title}</p>
                            </li>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
}

export default Review;