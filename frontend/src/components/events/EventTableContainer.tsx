import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {eventTailSelector} from "../../redux/events/EventsSlice";
import EventTable from "./EventTable";
import {startEventFetching, stopEventFetching} from "../../redux/events/fetcher";

function EventTableContainer() {
    const tail = useSelector(eventTailSelector)
    useEffect(() => {
        startEventFetching()
        return () => stopEventFetching()
    }, [])


    return <EventTable rows={tail}/>
}

export default EventTableContainer;
