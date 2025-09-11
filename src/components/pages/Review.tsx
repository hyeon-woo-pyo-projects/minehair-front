import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface CategoryProps {
    id : number,
    name : string
}

function Review () {
    const [ category, setCategory ] = useState<CategoryProps[]>([]);

    function getData (){
        axiosInstance
        .get('/board/review/category')
        .then((res) => {
            if (res.data.success === true) {
                const data = res.data.data;
                setCategory(data);
            }
        })
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
                            <li>전체</li>
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
            </div>
        </div>
    )
}

export default Review;