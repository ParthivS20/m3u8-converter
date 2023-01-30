"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ServerInitiatedMessage = exports.ClientInitiatedMessage = void 0;
var ClientInitiatedMessage;
(function (ClientInitiatedMessage) {
    ClientInitiatedMessage[ClientInitiatedMessage["CREATE_NEW_CONVERTER"] = 0] = "CREATE_NEW_CONVERTER";
    ClientInitiatedMessage[ClientInitiatedMessage["STOP_CONVERTER"] = 1] = "STOP_CONVERTER";
})(ClientInitiatedMessage = exports.ClientInitiatedMessage || (exports.ClientInitiatedMessage = {}));
var ServerInitiatedMessage;
(function (ServerInitiatedMessage) {
    ServerInitiatedMessage[ServerInitiatedMessage["UPDATE_CONVERTERS"] = 0] = "UPDATE_CONVERTERS";
    ServerInitiatedMessage[ServerInitiatedMessage["UPDATE_DIRECTORY"] = 1] = "UPDATE_DIRECTORY";
    ServerInitiatedMessage[ServerInitiatedMessage["CREATION_SUCCESS"] = 2] = "CREATION_SUCCESS";
    ServerInitiatedMessage[ServerInitiatedMessage["CREATION_FAILURE"] = 3] = "CREATION_FAILURE";
})(ServerInitiatedMessage = exports.ServerInitiatedMessage || (exports.ServerInitiatedMessage = {}));
