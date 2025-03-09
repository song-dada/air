import CircleP from './circle';

const InfoItem = ({ passValue }: any): any => {
    return (
        <>
            <div className="infoItem">
                <CircleP onOneRow={passValue} />
            </div>
        </>
    )
}

const Info = (props: any) => {
    return (
        <>
            <div className={`infoA`}>
                <InfoItem passValue={props.getRow}></InfoItem>
            </div>
        </>
    )
}
export default Info;
