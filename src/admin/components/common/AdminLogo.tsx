import axiosInstance from "../../../api/axiosInstance";
import IconUpload from "../../../icons/IconUpload";

function AdminLogo () {
    function uploadLogo (e) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.includes("image")) {
            alert("이미지 형식만 업로드 가능합니다.");
            return;
        }
        if (file.size > 10485760) {
            alert("10MB 이하의 파일만 업로드 가능합니다.");
            return;
        }

        console.log(file);

        axiosInstance
        .post('image/upload/LOGO', {
            
        })
    }
    
    return (
        <div className="admin-page" id="admin-logo">
            <div className="admin-body inner">
                <h1 className="admin-title">로고 관리</h1>

                <form className="admin-form" id="admin-logo-form">
                    <ul>
                        <li className="form-contents">
                            <span className="admin-form-title">로고</span>

                            <div className="logo-box">
                                <img src={require('../../../img/logo.png')} alt="로고"/>
                            </div>

                            <div className="input-area">
                                <input type="file" id="logo-upload" onChange={uploadLogo}/>
                                <label htmlFor="logo-upload" className="blackBtn"><IconUpload color="var(--color-white)"/>이미지 업로드</label>
                            </div>
                        </li>
                        
                        <li className="form-contents">
                            <span className="admin-form-title">파비콘</span>

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