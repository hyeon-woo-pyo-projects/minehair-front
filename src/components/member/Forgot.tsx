import { Link } from 'react-router-dom';

import '../../style/member/member.css'
import MemberNav from './MemberNav';


function Forgot () {
    return (
        <div id="page-forgot" className="memberComponents">
            <div className="wrapper">
                <MemberNav/>
            </div>
        </div>
    )
}

export default Forgot;