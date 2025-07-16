import { BrowserRouter, Link } from 'react-router-dom';
import "../../style/layouts/header.css"

function Header () {
    return (
        <BrowserRouter>
            <header>
                <div id='headerLine'>
                    <Link to="/" id='headerLogo'>
                        <img src="" alt="민이헤어_로고" />
                    </Link>
                </div>

                <nav className='inner'>
                    <Link to="">1</Link>
                    <Link to="">12</Link>
                    <Link to="">13</Link>
                </nav>
            </header>
        </BrowserRouter>
    )
}

export default Header;