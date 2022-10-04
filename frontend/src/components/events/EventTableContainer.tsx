import React from "react";
import {useSelector} from "react-redux";
import {eventTailSelector} from "../../redux/events/EventsSlice";
import EventTable from "./EventTable";

function EventTableContainer({aggregateSelectionCallback}: { aggregateSelectionCallback: (identifier: string) => void }) {
    const tail = useSelector(eventTailSelector)

    return <EventTable aggregateSelectionCallback={aggregateSelectionCallback} rows={tail}/>
}

export default EventTableContainer;
