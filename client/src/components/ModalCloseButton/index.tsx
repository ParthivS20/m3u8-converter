import {AiOutlineCloseCircle} from "react-icons/ai";
import "./modal-close-button.css"
import React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => void
}


export default function ModalCloseButton({onClick}: Props) {
    return (
        <div className={'modal-close'} id={'modal-close-btn'} onClick={() => onClick(null)}>
            <AiOutlineCloseCircle/>
        </div>
    )
}
