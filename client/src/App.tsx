import React, {useEffect, useState} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";

import Header from "./components/Header";
import Converters from "./components/Converters";
import NewConverterModal from "./components/NewConverterModal";

import './App.css';
import {converter} from "./types/converter";

const WSSClient = new W3CWebSocket(`ws://${window.location.hostname}:3001`);
//const WSSClient = new W3CWebSocket(`wss://${window.location.hostname}`);

export default function App() {
    const [showNewConverterModal, setShowNewConverterModal] = useState(false);
    const [converters, setConverters] = useState<Map<string, converter>>(new Map<string, converter>());
    const [showDirectory, setShowDirectory] = useState({});

    useEffect(() => {
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

            <Converters converters={converters} WSSClient={WSSClient}/>

            {
                showNewConverterModal &&
                <NewConverterModal closeNewConverterModal={closeNewConverterModal} directory={showDirectory}
                                   WSSClient={WSSClient}/>
            }
        </div>
    );
}
