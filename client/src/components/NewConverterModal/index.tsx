import {FaPlus} from "react-icons/fa";
import {AiOutlineLoading} from "react-icons/ai";

import "./new-converter-modal.css"
import React, {SyntheticEvent, useEffect, useState} from "react";
import Input from "./input";
import ModalCloseButton from "../ModalCloseButton";
import {w3cwebsocket} from "websocket";

type Props = {
    closeNewConverterModal: (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => void,
    directory: any,
    WSSClient: w3cwebsocket
}

export default function NewConverterModal({closeNewConverterModal, directory, WSSClient}: Props) {
    const [input, setInput] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [output, setOutput] = useState("");
    const [type, setType] = useState("");
    const [show, setShow] = useState("");
    const [newShow, setNewShow] = useState("");
    const [season, setSeason] = useState("");
    const [newSeason, setNewSeason] = useState("");
    const [errors, setErrors] = useState({
        input: "",
        subtitle: "",
        output: "",
        type: "",
        show: "",
        new_show: "",
        new_season: "",
        tv_show: ""
    });

    const [loading, setLoading] = useState(false);

    const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    const M3U8_REGEX = /^.*\.(m3u8)$/;
    const MP4_REGEX = /^.*\.(mp4)$/;
    const VTT_REGEX = /^.*\.(vtt)$/;

    useEffect(() => {
        if ((type === 'tv_show' && show === 'new_show') || (type === 'tv_show' && show !== 'new_show' && show !== '' && !directory[show])) {
            setSeason('new_season');
        }
    }, [type, show, directory])

    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            WSSClient.send(JSON.stringify({
                msg: 'new-converter',
                converter: {
                    M3U8_FILE: input,
                    SUBTITLE_FILE: subtitle,
                    OUTPUT_FILE: output,
                    type: type,
                    show: show,
                    newShow: newShow,
                    season: season,
                    newSeason: newSeason
                }
            }));
        }
    }

    const validate = () => {
        let e = {
            input: "",
            subtitle: "",
            output: "",
            type: "",
            show: "",
            new_show: "",
            new_season: "",
            tv_show: ""
        };
        let formValid = true;

        if (!input.match(URL_REGEX) || !input.match(M3U8_REGEX)) {
            formValid = false;
            e['input'] = 'File must be a URL ending in .m3u8';
        }

        if (subtitle !== '' && (!subtitle.match(URL_REGEX) || !subtitle.match(VTT_REGEX))) {
            formValid = false;
            e['subtitle'] = 'File must be a URL ending in .vtt';
        }

        if (!output.match(MP4_REGEX)) {
            formValid = false;
            e['output'] = 'File must end with .mp4';
        }

        if (type === "") {
            formValid = false;
            e['type'] = 'Movie Type is required';
        }

        if (type === "tv_show" && show === "") {
            e['tv_show'] = 'Show is required';
        }

        if (show === "new_show" && newShow === "") {
            formValid = false;
            e['new_show'] = 'New Show Name is required';
        }

        if (type === "tv_show" && season === "new_season" && directory[show] && newSeason === "") {
            formValid = false;
            e['new_season'] = 'New Season Name is required';
        }

        setErrors(e);

        return formValid;
    }

    return (
        <div className={'modal-container'} id={'new-converter-container'} onClick={closeNewConverterModal}>
            <form className={'new-converter-modal'} onSubmit={onSubmit}>
                <ModalCloseButton onClick={closeNewConverterModal}/>
                <h1>Add New Conversion</h1>
                <div className={'input-fields'}>
                    <Input
                        label={'Input File'}
                        required={true}
                        errorMsg={errors['input']}
                    >
                        <input
                            type={'text'}
                            id={'input_file'}
                            placeholder={'.m3u8 file URL'}
                            value={input}
                            onChange={e => {
                                setInput(e.target.value);
                                errors['input'] = '';
                                setErrors(errors);
                            }}
                        />
                    </Input>

                    <Input
                        label={'Subtitle File'}
                        errorMsg={errors['subtitle']}
                        required={false}
                    >
                        <input
                            type={'text'}
                            id={'subtitle_file'}
                            placeholder={'subtitle file URL'}
                            value={subtitle}
                            onChange={e => {
                                setSubtitle(e.target.value);
                                errors['subtitle'] = '';
                                setErrors(errors);
                            }}
                        />
                    </Input>

                    <Input
                        label={'Output File'}
                        required={true}
                        errorMsg={errors['output']}
                    >
                        <input
                            type={'text'}
                            id={'output_file'}
                            placeholder={'output file'}
                            value={output}
                            onChange={e => {
                                setOutput(e.target.value);
                                errors['output'] = '';
                                setErrors(errors);
                            }}
                        />
                    </Input>

                    <Input
                        label={'Media Type'}
                        required={true}
                        errorMsg={errors['type']}
                    >
                        <select
                            id={'type'}
                            value={type}
                            onChange={e => {
                                setType(e.target.value);
                                errors['type'] = '';
                                setErrors(errors);
                            }}
                        >
                            <option value="">Select media type...</option>
                            <option value="movie">Movie</option>
                            <option value="tv_show">TV Show</option>
                        </select>
                    </Input>

                    <Input
                        label={'TV Show Name'}
                        required={type === 'tv_show'}
                        errorMsg={errors['tv_show']}
                    >
                        <select
                            id={'show'}
                            value={show}
                            disabled={type !== 'tv_show'}
                            onChange={e => {
                                setShow(e.target.value);
                                errors['tv_show'] = '';
                                setErrors(errors);
                            }}
                        >
                            <option value="">Select show...</option>
                            {
                                Object.keys(directory).map(o => {
                                    return <option value={o} key={o}>{o}</option>
                                })
                            }
                            <option value="new_show">New Show</option>
                        </select>
                    </Input>

                    <Input
                        label={'New Show Name'}
                        required={show === 'new_show'}
                        errorMsg={errors['new_show']}
                    >
                        <input
                            type={'text'}
                            id={'new-show-name'}
                            placeholder={'New Show Name'}
                            disabled={show !== 'new_show'}
                            value={newShow}
                            onChange={e => {
                                setNewShow(e.target.value);
                                errors['new_show'] = '';
                                setErrors(errors);
                            }}
                        />
                    </Input>

                    <Input label={'Season'} required={false} errorMsg={"hi"}>
                        <select
                            id={'season'}
                            value={season}
                            disabled={show === '' || (type === 'tv_show' && show === 'new_show') || (type === 'tv_show' && show !== 'new_show' && !directory[show])}
                            onChange={e => setSeason(e.target.value)}
                        >
                            <option value="">Select season...</option>
                            {
                                show !== '' && show !== 'new_show' && directory[show] && Object.keys(directory[show]).map(o => {
                                    return <option value={o} key={o}>{o}</option>
                                })
                            }
                            <option value="new_season">New Season</option>
                        </select>
                    </Input>

                    <Input
                        label={'New Season Name'}
                        required={season === 'new_season' && directory[show]}
                        errorMsg={errors['new_season']}
                    >
                        <input
                            type={'text'}
                            id={'new-season-name'}
                            placeholder={'New Season name'}
                            disabled={season !== 'new_season' && show !== 'new_show'}
                            value={newSeason}
                            onChange={e => {
                                setNewSeason(e.target.value);
                                errors['new_season'] = '';
                                setErrors(errors);
                            }}
                        />
                    </Input>

                    <button type={'submit'} className={'submit-btn'}>
                        {
                            loading ? <AiOutlineLoading className={'spinner'}/> : <><FaPlus/>Add</>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
