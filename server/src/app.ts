import http from "http";
import express, {Request, Response} from 'express'
import {Server, WebSocket} from "ws";
import path from "path";
import fs from "fs";

import Converter from './converter';
import {ClientInitiatedMessage, ServerInitiatedMessage} from "./types/Messages";
import {ConvertersPayload, DirectoryPayload} from "./types/Payloads";
import {Directory} from "./types/Directory";

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const wss = new Server({server});

const queue = new Map<string, Converter>();

console.log("Starting Server...")

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, '..', 'client')));

app.get(['/api', '/api/*'], (req: Request, res: Response) => {
    res.json({message: "Hello from server!"});
});

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

wss.on('connection', ws => {
    updateConverters(ws);
    updateDirectory(ws);

    ws.on("message", buffer => {
        let data;
        try {
            data = JSON.parse(buffer.toString())
        } catch (e) {
            return;
        }

        if (data.msg === ClientInitiatedMessage.CREATE_NEW_CONVERTER) {
            let id = String(Date.now());
            queue.set(id, new Converter(data.converter, id));

            ws.send(JSON.stringify({
                msg: ServerInitiatedMessage.CREATION_SUCCESS
            }));

            updateConverters();
        }

        if (data.msg === ClientInitiatedMessage.STOP_CONVERTER) {
            queue.get(data.converter_id);
            queue.delete(data.converter_id);

            updateConverters();
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const updateConverters = (ws?: WebSocket) => {
    updater(ws, {
        msg: ServerInitiatedMessage.UPDATE_CONVERTERS,
        converters: queue
    });
};

const updateDirectory = (ws?: WebSocket) => {
    updater(ws, {
        msg: ServerInitiatedMessage.UPDATE_DIRECTORY,
        tv_directory: tvShowsDirTree(),
        movie_directory: moviesDirTree()
    });
}

const updater = (ws?: WebSocket, payload?: DirectoryPayload | ConvertersPayload) => {
    const sender = (client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
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
}

const tvShowsDirTree = () => {
    return directoryTree(Directory.TV_SHOWS, {});
}

const moviesDirTree = () => {
    return directoryTree(Directory.MOVIES, {});
}

const directoryTree = (dir: string, tree: any) => {
    let list = {};
    try {
        list = fs.readdirSync(dir);
    } catch (e) {
        return tree;
    }

    for (let item of Object.keys(list)) {
        let itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            tree[item] = directoryTree(itemPath, {});
        }
    }

    return tree;
}
