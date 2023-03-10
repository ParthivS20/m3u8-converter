import ffmpeg from "fluent-ffmpeg"

import {converters} from "../../../client/src/types/Converters";
import {Media} from "../types/Media";

const mediaDirs = {
    movie: 'Movies',
    tv_show: 'TV Shows',
    Movie: 'Movies',
    "TV Show": 'TV Shows'
}

export default class Converter {
    private data: converters;
    private id: string;

    constructor(data: converters, id: string) {
        this.data = data;
        this.id = id;
        this.data.progress = 0;

        if (this.data.media_type == Media.TV_SHOW) {
            /*
            if(this.data.newShow !== '') {
                this.data.show = this.data.newShow;
                let dir = path.join(path.dirname(require.main.filename), mediaDirs[this.data.type], this.data.show);
                if(!fs.existsSync(dir)) fs.mkdirSync(dir);
            }
            if(this.data.newSeason !== '') {
                this.data.season = this.data.newSeason;
                let dir = path.join(path.dirname(require.main.filename), mediaDirs[this.data.type], this.data.show, this.data.season);
                if(!fs.existsSync(dir)) fs.mkdirSync(dir);
            }
             */
        }

        this.start();
    }

    /**
     * Starts the process
     */
    start() {
        return new Promise<void>((resolve, reject) => {
            if (!this.data.m3u8_file || !this.data.output_file) {
                reject(new Error("You must specify the input and the output files"));
                return;
            }

            let command = ffmpeg(this.data.m3u8_file)
                .on("error", error => {
                    this.data.error = true;
                    reject(error);
                })
                .on("end", () => {
                    this.data.progress = 100;
                    //ConverterElement.updateConverters();
                    resolve();
                })
                .on("progress", progress => {
                    if (Math.round(progress.percent) - this.data.progress >= 1) {
                        this.data.progress = Math.round(progress.percent);
                        //ConverterElement.updateConverters();
                    }
                })
                .outputOptions("-c copy")
                .outputOptions("-bsf:a aac_adtstoasc")

            if (this.data.subtitle_file && this.data.subtitle_file !== '') {
                command
                    .input(this.data.subtitle_file)
                    .outputOptions('-c:s eng_subtitles')
                    .outputOptions("-metadata:s:s:0 language=eng")
            }

            command
                .output(this.getPath())
                .run();
        });
    }

    getPath() {
        return ""
        /*
        let dir = path.join(path.dirname(require.main.filename), mediaDirs[this.data.type]);
        if(mediaDirs[this.data.type] === "TV Shows") {
            if(this.data.season === '') {
                dir = path.join(dir, this.data.show);
            }
            else {
                dir = path.join(dir, this.data.show, this.data.season);
            }
        }
        return path.join(dir, this.data.OUTPUT_FILE);
        */
    }

    toString() {
        return JSON.stringify(this);
    }
}
