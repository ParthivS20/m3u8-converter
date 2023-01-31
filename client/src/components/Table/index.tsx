import './table.css'
import {PartialConverter} from "../../types/Converters";
import TableRow from "./TableRow";

type Props = {
    converters: Map<string, PartialConverter>
    deleteConverter: (id: string) => void
}

export default function Table({converters, deleteConverter}: Props) {
    return (
        <div className={'table-container'}>
            <div className={'table-wrapper'}>
                <div className={'table-title'}>
                    Downloads
                </div>
                <table className={'table'} cellSpacing={0}>
                    <tbody>
                    <tr className={'table-header'}>
                        <td className={'table-header-item'} style={{width: "2%"}}/>
                        <th className={'table-header-item'} style={{width: "14%"}}>ID</th>
                        <th className={'table-header-item'} style={{width: "25%"}}>NAME</th>
                        <th className={'table-header-item'} style={{width: "9%"}}>MEDIA TYPE</th>
                        <th className={'table-header-item'} style={{width: "9%"}}>SUBTITLES</th>
                        <th className={'table-header-item'} style={{width: "21%"}}>PROGRESS</th>
                        <th className={'table-header-item'} style={{width: "10%"}}>STATUS</th>
                        <td className={'table-header-item'} style={{width: "10%"}}/>
                    </tr>
                    {
                        Array.from(converters.values()).map((converter, i) => {
                            return <TableRow converter={converter} deleteConverter={deleteConverter} key={i}/>
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
