import React from "react";

type Props = {
    progress: number
}

export default function ProgressBar({progress}: Props) {
    if (progress < 0) progress = 0
    if (progress > 100) progress = 100

    return (
        <div className={'progress-container'}>
            <div className={'progress-bar-1'}>
                <div className="progress-bar-2" style={{width: `${progress}%`}}/>
            </div>
            <div className={'progress-percent'}>
                {progress}%
            </div>
        </div>
    )
}
