export interface TokenCommand {
    nodeId: string
    description: string
    provideCommand: () => any
}

export class StartCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;

    constructor(nodeId: string, processorName: string) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.description = `Starting processor ${processorName} on node ${nodeId}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "START_PROCESSOR",
            processorName: this.processorName
        };
    }
}

export class StopCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;

    constructor(nodeId: string, processorName: string) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.description = `Stopping processor ${processorName} on node ${nodeId}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "STOP_PROCESSOR",
            processorName: this.processorName
        };
    }
}

export class SplitSegmentCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;
    segment: number;

    constructor(nodeId: string, processorName: string, segment: number) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.segment = segment
        this.description = `Splitting segment ${segment} for processor ${processorName} on node ${nodeId}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "SPLIT_SEGMENT",
            processorName: this.processorName,
            segment: this.segment
        };
    }
}

export class MergeSegmentCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;
    segment: number;

    constructor(nodeId: string, processorName: string, segment: number) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.segment = segment
        this.description = `Merging segment ${segment} for processor ${processorName} on node ${nodeId}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "MERGE_SEGMENT",
            processorName: this.processorName,
            segment: this.segment
        };
    }
}

export class ReleaseSegmentCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;
    segment: number;

    constructor(nodeId: string, processorName: string, segment: number) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.segment = segment
        this.description = `Releasing segment ${segment} for processor ${processorName} on node ${nodeId}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "RELEASE_SEGMENT",
            processorName: this.processorName,
            segment: this.segment
        };
    }
}

export class ResetCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;

    constructor(nodeId: string, processorName: string) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.description = `Resetting processor ${processorName}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "RESET_PROCESSOR",
            processorName: this.processorName,
        };
    }
}

export class ClearDlqCommand implements TokenCommand {
    nodeId: string;
    processorName: string;
    description: string;

    constructor(nodeId: string, processorName: string) {
        this.nodeId = nodeId;
        this.processorName = processorName
        this.description = `Clearing DLQ for processor ${processorName} using node ${nodeId}`
    }

    provideCommand(): any {
        return {
            nodeId: this.nodeId,
            type: "CLEAR_DLQ",
            processorName: this.processorName
        };
    }
}
