import React from "react";
import {useSelector} from "react-redux";
import {eventTailSelector} from "../../redux/events/EventsSlice";
import EventTable from "./EventTable";

function EventTableContainer() {
    const tail = useSelector(eventTailSelector)

    return <EventTable rows={tail}/>
}

export default EventTableContainer;
