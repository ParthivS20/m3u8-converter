export enum ClientInitiatedMessage {
    CREATE_NEW_CONVERTER,
    STOP_CONVERTER
}

export enum ServerInitiatedMessage {
    UPDATE_CONVERTERS,
    UPDATE_DIRECTORY,
    CREATION_SUCCESS,
    CREATION_FAILURE
}
