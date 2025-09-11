import MainSlider from "./MainSlider";
import "../../style/index/landing.css";
import FixBanner from "../layouts/FixBanner";
import QuickButton from "./QuickButton";
import Home from "./Home";

function Landing() {
    return (
        <>
            <MainSlider />
            <Home/>
            <QuickButton />
            <FixBanner />
        </>
    );
}

export default Landing;
