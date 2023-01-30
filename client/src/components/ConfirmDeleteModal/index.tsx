import "./confirm-delete-modal.css"
import {ImCross} from "react-icons/im";
import ModalCloseButton from "../ModalCloseButton";
import React from "react";

type Props = {
    submitDelete: () => void,
    closeModal: (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => void
}

export default function ConfirmDeleteModal({submitDelete, closeModal}: Props) {
    return (
        <div className={'modal-container'} id={'delete-modal-container'} onClick={e => closeModal(e)}>
            <div className={'delete-modal'}>
                <ModalCloseButton onClick={closeModal}/>
                <div>Are you sure you want to delete this converter?</div>
                <button className="stop delete-modal-btn" onClick={() => submitDelete()}>
                    <ImCross/>Yes
                </button>
            </div>
        </div>
    );
}
