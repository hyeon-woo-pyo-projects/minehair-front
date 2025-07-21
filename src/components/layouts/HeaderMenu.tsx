import '../../style/layouts/header.css'

interface ContentsProps {
    contents: number;
}

function HeaderMenu ({contents}: ContentsProps) {
    return (
        <div className='perMenu'>
            {contents}
        </div>
    )
}

export default HeaderMenu;