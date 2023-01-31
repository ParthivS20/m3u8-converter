import './table.css'
import {converter} from "../../../../server/types/converter";
import {Media} from '../../../../server/types/Media';

type Props = {
    converter: converter
}

export default function TableRow({converter}: Props) {
    return (
        <tr className={'table-row'}>
            <td className={'table-item'}/>
            <td className={'table-item'}>{converter.id}</td>
            <td className={'table-item'}>{converter.output_file}</td>
            <td className={'table-item'}>{converter.media_type === Media.MOVIE ? 'Movie' : 'TV Show'}</td>
            <td className={'table-item'}>{converter.subtitle_file ? 'On' : 'Off'}</td>
            <td className={'table-item'}>{(converter.progress * 100) + '%'}</td>
            <td className={'table-item'}>{'Running'}</td>
            <td className={'table-item'}/>
        </tr>
    )
}
