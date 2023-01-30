import {ServerInitiatedMessage} from "./Messages";
import Converter from "../converter";

export type ConvertersPayload = {
    msg: ServerInitiatedMessage,
    converters: Map<string, Converter>
}

export type DirectoryPayload = {
    msg: ServerInitiatedMessage,
    tv_directory?: {},
    movie_directory?: {}
}
