import React from "react";
import {useSelector} from "react-redux";
import {nodeInformationSelector} from "../../redux/tokens/TokenSlice";
import ProcessorTable from "./ProcessorTable";
import _ from "lodash";

function ProcessorStatusContainer() {
    const nodeInformations = useSelector(nodeInformationSelector)

    const allProcessors = _.uniq(nodeInformations
        .flatMap((n) => n.processorStates?.map(ps => ps.name) ?? []));

    return <ProcessorTable rows={nodeInformations} processors={allProcessors}/>
}

export default ProcessorStatusContainer;
