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
}

function HeaderMenu ({contents, imgSrc, isVisible}: ContentsProps) {
    return (
        <div className={`perMenu ${isVisible ? 'show' : ''}`}>
            <div className={`category ${ imgSrc !== '' && 'haveImg'}`}>
                <Link to={contents.link}>{contents.title}</Link>
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