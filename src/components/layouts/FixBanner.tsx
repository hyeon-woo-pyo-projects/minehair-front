
function FixBanner () {
    return (
        <div id="fixedBanner">
            <div className="inner">
                <h5>간편상담신청</h5>

                <form>
                    <input type="text" placeholder="이름" maxLength={10}></input>
                    <input type="text" placeholder="연락처(-없이)" maxLength={11}></input>
                    <select>
                        <option hidden selected>선택</option>
                    </select>

                    <div>
                        <input type="checkbox" id="agreeChk"/>
                        <label htmlFor="agreeChk">
                            개인정보처리방침 동의
                        </label>
                    </div>
                </form>

                <button id="sendCall" type="button">상담신청</button>
            </div>
        </div>
    )
}

export default FixBanner;