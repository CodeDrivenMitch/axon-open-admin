import {Tag} from "antd";
import React from "react";

export function TimeToHeadTag({behind, secondsToHead, replaying}: { behind: number, secondsToHead: number | null, replaying: boolean }) {
    if (!behind) {
        return <Tag color="green">Up-to-date</Tag>
    }
    if (secondsToHead == null) {
        return <Tag color="red">Infinite</Tag>
    }
    const minutes = Math.floor(secondsToHead / 60)
    const seconds = secondsToHead % 60
    const color = replaying || secondsToHead < 120 ? 'orange' : 'red';
    return <Tag color={color}>`${minutes ? minutes + 'm' : ''}${seconds}s`</Tag>
}
