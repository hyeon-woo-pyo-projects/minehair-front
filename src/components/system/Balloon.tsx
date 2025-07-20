import Warning from '../../icons/Warning';
import '../../style/system/system.css';

interface BalloonProps {
    text : string;
    status : 'notice' | 'error' | '';
}

function Balloon({ text, status }: BalloonProps) {

    return (
        <div id="balloon" className={`balloon ${status}`}>
            {status === 'notice' ? <Warning color='var(--color-white)'/> : null}
            {text}
        </div>
    );
}

export default Balloon;
