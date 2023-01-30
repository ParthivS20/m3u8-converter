import {FaPlus} from "react-icons/fa";
import "./header.css"

type Props = {
    openNewConverterModal: () => void,
    numConverters: number
}

export default function Header({openNewConverterModal, numConverters = 0}: Props) {
    return (
        <div className="header-container">
            <button className={'new-converter'} onClick={openNewConverterModal}>
                <FaPlus/>
                New Converter
            </button>

            <div className={'stats'}>
                <h1>Ongoing Converters</h1>
                <p>{numConverters}</p>
            </div>
        </div>
    );
}
