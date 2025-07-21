import '../../style/layouts/header.css'

interface ContentsProps {
    contents: number;
    imgSrc? : string;
}

function HeaderMenu ({contents, imgSrc}: ContentsProps) {
    return (
        <div className='perMenu'>
            <div className={`category ${ imgSrc !== '' && 'haveImg'}`}>
                {contents}
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