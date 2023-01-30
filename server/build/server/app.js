"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const converter_1 = __importDefault(require("./converter"));
const Messages_1 = require("./types/Messages");
const Directory_1 = require("./types/Directory");
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.Server({server});
const queue = new Map();
console.log("Starting Server...");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({extended: false}));
app.use(express_1.default.static(path_1.default.resolve(__dirname, '..', 'client')));
app.get(['/api', '/api/*'], (req, res) => {
    res.json({message: "Hello from server!"});
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '..', 'client', 'index.html'));
});
wss.on('connection', ws => {
    updateConverters(ws);
    updateDirectory(ws);
    ws.on("message", buffer => {
        let data;
        try {
            data = JSON.parse(buffer.toString());
        } catch (e) {
            return;
        }
        if (data.msg === Messages_1.ClientInitiatedMessage.CREATE_NEW_CONVERTER) {
            let id = String(Date.now());
            queue.set(id, new converter_1.default(data.converter, id));
            ws.send(JSON.stringify({
                msg: Messages_1.ServerInitiatedMessage.CREATION_SUCCESS
            }));
            updateConverters();
        }
        if (data.msg === Messages_1.ClientInitiatedMessage.STOP_CONVERTER) {
            queue.get(data.converter_id);
            queue.delete(data.converter_id);
            updateConverters();
        }
    });
});
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
const updateConverters = (ws) => {
    updater(ws, {
        msg: Messages_1.ServerInitiatedMessage.UPDATE_CONVERTERS,
        converters: queue
    });
};
const updateDirectory = (ws) => {
    updater(ws, {
        msg: Messages_1.ServerInitiatedMessage.UPDATE_DIRECTORY,
        tv_directory: tvShowsDirTree(),
        movie_directory: moviesDirTree()
    });
};
const updater = (ws, payload) => {
    const sender = (client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
        }
    };
    if (ws !== undefined) {
        sender(ws);
    } else {
        wss.clients.forEach(client => {
            sender(client);
        });
    }
};
const tvShowsDirTree = () => {
    return directoryTree(Directory_1.Directory.TV_SHOWS, {});
};
const moviesDirTree = () => {
    return directoryTree(Directory_1.Directory.MOVIES, {});
};
const directoryTree = (dir, tree) => {
    let list = {};
    try {
        list = fs_1.default.readdirSync(dir);
    } catch (e) {
        return tree;
    }
    for (let item of Object.keys(list)) {
        let itemPath = path_1.default.join(dir, item);
        if (fs_1.default.statSync(itemPath).isDirectory()) {
            tree[item] = directoryTree(itemPath, {});
        }
    }
    return tree;
};
