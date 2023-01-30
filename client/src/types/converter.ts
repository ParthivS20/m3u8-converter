import {Media} from "./Media";

export type converter = {
    id: string,
    m3u8_file: string,
    subtitle_file: string,
    output_file: string,
    media_type: Media,
    show: string,
    season: string,
    progress: number,
    error: boolean
}
