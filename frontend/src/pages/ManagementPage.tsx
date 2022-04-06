import {Divider} from "antd";
import React from "react";
import {ProcessorManagementCard} from "./ProcessorManagementCard";
import {TokenManagementCard} from "./TokenManagementCard";

export function ManagementPage() {
    return <div>
        <TokenManagementCard/>
        <Divider/>
        <ProcessorManagementCard/>
    </div>;
}
