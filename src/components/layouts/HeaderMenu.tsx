import { Link } from 'react-router-dom';
import '../../style/layouts/header.css'

interface ContentsProps {
    contents: {
        parent : string,
        title : string,
        link : string;
    }
    imgSrc? : string;
    isVisible : boolean;
    childrenMenu?: { title: string; link: string }[];
}

function HeaderMenu ({contents, imgSrc, isVisible, childrenMenu}: ContentsProps) {
    return (
        <div className={`perMenu ${isVisible ? 'show' : ''}`}>
            <div className={`category ${ imgSrc !== '' && 'haveImg'}`}>
                <Link to={contents.link}>{contents.title}</Link>

                { childrenMenu !== undefined ?
                    <ul className="grandChildMenu">
                        { childrenMenu?.map((data, index)=>{
                            return(
                                <li key={index}>
                                    <Link to={data.link}>{data.title}</Link>
                                </li>
                            )
                        }) }
                    </ul>
                :
                null
                }
                
            </div>

            { imgSrc !== '' ?
            <div className="thumbnail">
                <img src='' alt="카테고리 썸네일" />
                {imgSrc}
            </div>
            : null}
        </div>
    )
}

export default HeaderMenu;