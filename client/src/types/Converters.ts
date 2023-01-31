import {Media} from "./Media";
import {ConverterStatus} from "./ConverterStatus";

export type FullConverter = {
    id: string,
    m3u8_file: string,
    subtitle_file: string,
    name: string,
    media_type: Media,
    show: string,
    season: number,
    episode: number
    progress: number,
    status: ConverterStatus
}

export type PartialConverter = {
    id: string,
    name: string,
    subtitles: boolean,
    media_type: Media,
    show: string,
    season: number,
    episode: number
    progress: number,
    status: ConverterStatus
}
