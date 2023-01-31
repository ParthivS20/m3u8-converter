import './table.css'
import {PartialConverter} from "../../types/Converters";
import {Media} from "../../types/Media";
import Status from "./Status";
import React, {useCallback, useEffect, useState} from "react";
import {AiOutlineLoading} from "react-icons/ai";
import ProgressBar from "./ProgressBar";

type Props = {
    converter: PartialConverter
    deleteConverter: (id: string) => void
}

export default function TableRow({converter, deleteConverter}: Props) {
    const [stopRequested, setStopRequested] = useState(false)

    const stop = useCallback(() => {
        if (stopRequested) return;
        setStopRequested(true);
        deleteConverter(converter.id)
    }, [converter, deleteConverter, stopRequested])

    useEffect(() => {
        if (converter.progress >= 100) {
            setTimeout(() => {
                stop();
            }, 5000);
        }
    }, [converter, stop])

    return (
        <tr className={'table-row'}>
            <td className={'ta[converters, submitDelete]ble-item'}/>
            <td className={'table-item'}>{converter.id}</td>
            <td className={'table-item'}>
                {
                    converter.name + (converter.media_type === Media.TV_SHOW ? ' (' + converter.show + ' S' + converter.season + ' E' + converter.episode + ')' : '')
                }
            </td>
            <td className={'table-item'}>{converter.media_type === Media.MOVIE ? 'Movie' : 'TV Show'}</td>
            <td className={'table-item'}>{converter.subtitles ? 'On' : 'Off'}</td>
            <td className={'table-item'}>
                <ProgressBar progress={converter.progress}/>
            </td>
            <td className={'table-item'}>
                <Status status={converter.status}/>
            </td>
            <td className={'table-item'}>
                <div className={'stop-btn-container'}>
                    <button className={'stop-btn'} onClick={stop}>
                        {
                            stopRequested ? <AiOutlineLoading className={'spinner'}/> : "Stop"
                        }
                    </button>
                </div>
            </td>
        </tr>
    )
}
