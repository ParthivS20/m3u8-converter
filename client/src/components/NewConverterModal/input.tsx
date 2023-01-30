import "./input.css"

type Props = {
    children: JSX.Element,
    label: string,
    required: boolean,
    errorMsg: string
}

export default function Input({children, label, required, errorMsg}: Props) {
    return (
        <div className={'input-container' + (children.props.disabled ? " disabled" : '')}>
            {
                label &&
                <div className={'input-label'}>
                    <p className={'input-label-text'}>{label}</p>
                    {
                        required &&
                        <p className={'input-required'}>*</p>
                    }
                </div>
            }

            {
                children
            }

            <p className={'input-err'}>{errorMsg}</p>
        </div>
    );
}
