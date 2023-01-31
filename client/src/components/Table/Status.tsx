import {FaCircle} from "react-icons/fa";
import {ConverterStatus} from "../../types/ConverterStatus";

type Props = {
    status: ConverterStatus
}

export default function Status({status}: Props) {
    let color;
    switch (status) {
        case ConverterStatus.COMPLETE:
            color = "green"
            break
        case ConverterStatus.IN_PROGRESS:
            color = "lightgreen"
            break
        case ConverterStatus.PENDING:
            color = "orange"
            break
        case ConverterStatus.ERROR:
            color = "red"
    }

    return (
        <div className={'status-container'}>
            <FaCircle className={'status-icon' + (status === ConverterStatus.IN_PROGRESS ? ' blink' : '')} style={{
                color: color
            }}/>
            <p>{status}</p>
        </div>
    )
}
