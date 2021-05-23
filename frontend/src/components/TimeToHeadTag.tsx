import {Tag} from "antd";
import React from "react";

export function TimeToHeadTag({behind, secondsToHead, replaying}: { behind: number, secondsToHead: number | null, replaying: boolean }) {
    if (!behind) {
        return <Tag color="green">Up-to-date</Tag>
    }
    if (secondsToHead == null || !(secondsToHead > 0)) {
        return <Tag color="red">Infinite</Tag>
    }
    const hours = Math.floor(secondsToHead / 3600)
    const minutes = Math.floor((secondsToHead - hours * 3600) / 60)
    const seconds = secondsToHead % 60
    const color = replaying || secondsToHead < 120 ? 'orange' : 'red';
    if(hours > 48) {
        return <Tag color={color}>Infinite</Tag>
    }
    return <Tag color={color}>{`${hours ? hours + 'h' : ''}${minutes ? minutes + 'm' : ''}${seconds}s`}</Tag>
}
