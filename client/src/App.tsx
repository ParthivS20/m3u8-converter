import React, {useEffect, useState} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";

import Header from "./components/Header";

import './App.css';
import {converter} from "./types/converter";
import Table from "./components/Table";
import {Media} from "./types/Media";

const WSSClient = new W3CWebSocket(`ws://${window.location.hostname}:3001`);
//const WSSClient = new W3CWebSocket(`wss://${window.location.hostname}`);

export default function App() {
    const [showNewConverterModal, setShowNewConverterModal] = useState(false);
    const [converters, setConverters] = useState<Map<string, converter>>(new Map<string, converter>());
    const [showDirectory, setShowDirectory] = useState({});

    const updateConverters = (k: string, v: converter) => {
        setConverters(new Map<string, converter>(converters.set(k, v)));
    }

    useEffect(() => {
        updateConverters("12345", {
            id: Date.now().toString(),
            m3u8_file: "string",
            subtitle_file: "string",
            output_file: "Flash",
            media_type: Media.TV_SHOW,
            show: "string",
            season: "string",
            progress: 0.2,
            error: false
        })
        WSSClient.onopen = () => {
            console.log('WebSocket Connected!');
        };

        WSSClient.onmessage = message => {
            const data = JSON.parse(message.data.toString());

            switch (data.msg) {
                case 'converter-update':
                    setConverters(data.converters);
                    break;
                case 'directory-update':
                    setShowDirectory(data.tv_directory);
                    break;
                case 'converter-created':
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
        if (!e || e.currentTarget.id === 'new-converter-container') setShowNewConverterModal(false);
    };

    return (
        <div className="App">
            <Header openNewConverterModal={openNewConverterModal} numConverters={converters.size}/>
            <Table converters={converters}/>
        </div>
    );
}

/*<Converters converters={converters} WSSClient={WSSClient}/>

            {
                showNewConverterModal &&
                <NewConverterModal closeNewConverterModal={closeNewConverterModal} directory={showDirectory}
                                   WSSClient={WSSClient}/>
            }*/
