import React, {useEffect, useState} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";

import Header from "./components/Header";

import './App.css';
import {PartialConverter} from "./types/Converters";
import Table from "./components/Table";
import {Media} from "./types/Media";
import {ConverterStatus} from "./types/ConverterStatus";
import {ClientInitiatedMessage} from "./types/Messages";

const WSSClient = new W3CWebSocket(`ws://${window.location.hostname}:3001`);
//const WSSClient = new W3CWebSocket(`wss://${window.location.hostname}`);

export default function App() {
    const [showNewConverterModal, setShowNewConverterModal] = useState(false);
    const [converters, setConverters] = useState<Map<string, PartialConverter>>(new Map<string, PartialConverter>());
    const [showDirectory, setShowDirectory] = useState({});

    const updateConverters = (k: string, v: PartialConverter) => {
        setConverters(new Map<string, PartialConverter>(converters.set(k, v)));
    }

    const deleteConverter = (id: string) => {
        WSSClient.send(JSON.stringify({
            msg_type: ClientInitiatedMessage.STOP_CONVERTER,
            converter_id: id
        }))
    }

    useEffect(() => {
        console.log(converters.size)
        console.log(JSON.stringify(Object.fromEntries(converters)))
    }, [converters])

    useEffect(() => {
        updateConverters("12345", {
            id: Date.now().toString(),
            name: "Test ep",
            subtitles: true,
            media_type: Media.MOVIE,
            show: "The Flash",
            season: 1,
            episode: 1,
            progress: 60,
            status: ConverterStatus.IN_PROGRESS
        })

        WSSClient.onopen = () => {
            console.log('WebSocket Connected!');
        };

        WSSClient.onmessage = message => {
            const data = JSON.parse(message.data.toString());

            switch (data.msg) {
                case 'converters-update':
                    setConverters(data.converters);
                    break;
                case 'directory-update':
                    setShowDirectory(data.tv_directory);
                    break;
                case 'converters-created':
                    setTimeout(() => {
                        setShowNewConverterModal(false);
                    }, 500)
            }
        };
    }, [])

    const openNewConverterModal = () => {
        setShowNewConverterModal(true);
    };

    const closeNewConverterModal = (e: React.MouseEvent<HTMLElement, MouseEvent> | null) => {
        if (!e || e.currentTarget.id === 'new-converters-container') setShowNewConverterModal(false);
    };

    return (
        <div className="App">
            <Header openNewConverterModal={openNewConverterModal} numConverters={converters.size}/>
            <Table converters={converters} deleteConverter={deleteConverter}/>
        </div>
    );
}

/*<Converters converters={converters} WSSClient={WSSClient}/>

            {
                showNewConverterModal &&
                <NewConverterModal closeNewConverterModal={closeNewConverterModal} directory={showDirectory}
                                   WSSClient={WSSClient}/>
            }*/
