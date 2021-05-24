import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import TokenTable from "./TokenTable";
import {nodeInformationSelector, processorInformationSelector} from "../../redux/tokens/TokenSlice";
import {startTokenFetching, stopTokenFetching} from "../../redux/tokens/fetcher";
import {mapProcessorInformationToDataSource} from "./MapProcessorInformationToDataSource";

function TokenStatusContainer() {
    const processorInformation = useSelector(processorInformationSelector)
    const nodeInformation = useSelector(nodeInformationSelector)

    useEffect(() => {
        startTokenFetching()
        return () => stopTokenFetching()
    }, [])

    return <TokenTable loading={!processorInformation} rows={mapProcessorInformationToDataSource(processorInformation, nodeInformation)}/>
}

export default TokenStatusContainer;
