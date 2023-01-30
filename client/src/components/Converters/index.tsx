import "./converters.css"
import ConverterElement from "../ConverterElement";
import {converter} from "../../types/converter";
import {w3cwebsocket} from "websocket";

type Props = {
    converters: Map<string, converter>,
    WSSClient: w3cwebsocket
}

export default function Converters({converters, WSSClient}: Props) {
    return (
        <div className="converters-container">
            {
                Array.from(converters.values()).map((converter, i) => {
                    return <ConverterElement converter={converter} WSSClient={WSSClient} key={i}/>
                })
            }
        </div>
    );
}
