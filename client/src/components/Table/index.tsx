import './table.css'
import {converter} from "../../types/converter";
import TableRow from "./TableRow";

type Props = {
    converters: Map<string, converter>
}

export default function Table({converters}: Props) {
    return (
        <div className={'table-container'}>
            <div className={'table-wrapper'}>
                <div className={'table-title'}>
                    Converters
                </div>
                <table className={'table'} cellSpacing={0}>
                    <tbody>
                    <tr className={'table-header'}>
                        <td className={'table-header-item'} style={{width: "2%"}}/>
                        <th className={'table-header-item'} style={{width: "14%"}}>ID</th>
                        <th className={'table-header-item'} style={{width: "14%"}}>NAME</th>
                        <th className={'table-header-item'} style={{width: "14%"}}>MEDIA TYPE</th>
                        <th className={'table-header-item'} style={{width: "14%"}}>SUBTITLES</th>
                        <th className={'table-header-item'} style={{width: "14%"}}>PROGRESS</th>
                        <th className={'table-header-item'} style={{width: "14%"}}>STATUS</th>
                        <td className={'table-header-item'} style={{width: "14%"}}/>
                    </tr>
                    {
                        Array.from(converters.values()).map((converter, i) => {
                            return <TableRow converter={converter} key={i}/>
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
