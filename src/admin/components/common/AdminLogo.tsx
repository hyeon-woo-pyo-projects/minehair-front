import axiosInstance from "../../../api/axiosInstance";
import IconUpload from "../../../icons/IconUpload";
import AdminWidget from "../layouts/AdminWidget";

function AdminLogo () {

    function uploadImg () {
        // axiosInstance.post('/image/upload/')
    }
    
    return (
        <div className="admin-page" id="admin-logo">
            <AdminWidget title={'로고 관리'}/>

            <div className="admin-body inner">
                <form className="admin-form" id="admin-logo-form">
                    <ul>
                        <li className="form-contents">
                            <span className="admin-form-title">현재 로고</span>

                            <div className="logo-box">
                                <img src={require('../../../img/logo.png')} alt="로고"/>
                            </div>

                            <div className="input-area">
                                <input type="file" id="logo-upload"/>
                                <label htmlFor="logo-upload" className="blackBtn"><IconUpload color="var(--color-white)"/>이미지 업로드</label>
                            </div>
                        </li>
                        
                        <li className="form-contents">
                            <span className="admin-form-title">현재 파비콘</span>

                            <div className="logo-box">
                                <img src={process.env.PUBLIC_URL + '/favicon.jpg'} alt="로고"/>
                            </div>

                            <div className="input-area">
                                <input type="file" id="favicon-upload"/>
                                <label htmlFor="favicon-upload" className="blackBtn"><IconUpload color="var(--color-white)"/>이미지 업로드</label>
                            </div>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    )
}

export default AdminLogo;