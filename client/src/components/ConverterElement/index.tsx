import {ImCross} from "react-icons/im";
import {AiOutlineLoading} from "react-icons/ai";
import React, {useCallback, useEffect, useState} from "react";

import ConfirmDeleteModal from "../ConfirmDeleteModal";
import {converter} from "../../types/converter";

import "./converter.css"
import {w3cwebsocket} from "websocket";

type Props = {
    converter: converter,
    WSSClient: w3cwebsocket
}

export default function ConverterElement({converter, WSSClient}: Props) {
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeModal = (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => {
        if (!e || e.currentTarget.id === 'delete-modal-container') setModal(false);
    }

    const submitDelete = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            WSSClient.send(JSON.stringify({
                msg_type: 'stop-converter',
                converter_id: converter.id
            }))
        }, 500)
    }, [WSSClient, converter])

    useEffect(() => {
        if (converter.progress >= 100) {
            setTimeout(() => {
                submitDelete();
            }, 5000);
        }
    }, [converter, submitDelete])

    return (
        <div className={'converter'}>
            <h1 className={'output-file'}>{converter.output_file}</h1>

            <p className="type">{converter.media_type}</p>

            <div className={'files'}>
                <div className={'other-file'}>
                    <p>Input File: </p>
                    <a href={converter.m3u8_file} target={'_blank'} rel="noreferrer">{converter.m3u8_file}</a>
                </div>
                {
                    converter.subtitle_file && converter.subtitle_file !== '' &&
                    <div className={'other-file'}>
                        <p>Subtitle File: </p>
                        <a href={converter.subtitle_file} target={'_blank'}
                           rel="noreferrer">{converter.subtitle_file}</a>
                    </div>
                }
            </div>

            <div className="info">
                <div className={'progress-container'}>
                    <div className="progress-bar" style={{width: `${converter.progress}%`}}/>
                </div>
                <div className={'progress-percent'}>
                    {converter.progress || 0}
                    %
                </div>
                <button className="stop" onClick={() => setModal(true)}>
                    {
                        loading ? <AiOutlineLoading className={'spinner'}/> : <><ImCross/>Stop</>
                    }
                </button>
            </div>
            {
                modal && !loading && <ConfirmDeleteModal submitDelete={submitDelete} closeModal={closeModal}/>
            }
        </div>
    );
}
