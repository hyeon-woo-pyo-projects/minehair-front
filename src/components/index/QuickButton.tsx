import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface DataProps {
    id : number,
    logoType: string,
    description: string,
    imageUrl: string,
}

function QuickButton () {
    const [ data, setData ] = useState<DataProps[]>([]);
    const [ show, setShow ] = useState(false);

    function getData(){
        axiosInstance
        .get('/logo')
        .then((res) => {
            if ( res.data.success === true ) {
                const data = res.data.data;
                const logoData = data.filter((el) => el.logoType === 'QUICK' );
                setData(logoData);
                console.log(logoData)
            }
        })
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if ( scrollY > 100 ) { setShow(true) } else { setShow(false) }
        }
        window.addEventListener('scroll', handleScroll);
        getData();
    },[])

    return (
        <>
            { data.length > 0 ?
                <div className={`main-quick-menu${show === true ? ' show' : ''}`}>
                    <h6>QUICK</h6>

                    <div className="quick-body">
                        {data.map((el)=>{
                            return (
                                <li key={el.id}>
                                    <a
                                        href={el.description?.startsWith('http') 
                                            ? el.description 
                                            : `https://${el.description}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >
                                        <img src={el.imageUrl} alt="퀵 이미지" />
                                        </a>
                                </li>
                            )
                        })}
                    </div>
                </div>
            : null }
        </>
    )
}

export default QuickButton;