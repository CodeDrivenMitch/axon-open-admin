package com.insidion.axon.openadmin

import org.axonframework.eventhandling.GapAwareTrackingToken
import org.axonframework.eventhandling.GlobalSequenceTrackingToken
import org.axonframework.eventhandling.TrackingToken
import org.axonframework.eventsourcing.eventstore.EventStorageEngine
import org.axonframework.eventsourcing.eventstore.EventStore
import org.springframework.stereotype.Component

@Component
class TokenProvider(val eventStore: EventStore, val eventStorageEngine: EventStorageEngine?) {
    fun provideTokenForIndex(index: Long): TrackingToken {
        if (eventStore.javaClass.simpleName.equals("AxonServerEventStore")) {
            return GlobalSequenceTrackingToken(index)
        }
        if (eventStorageEngine?.javaClass?.simpleName?.equals("MongoEventStorageEngine") == true) {
            throw IllegalArgumentException("Mongo is currently not supported in the event page of Axon Open Admin due to its different token structure!")
        }
        return GapAwareTrackingToken.newInstance(index, emptyList())
    }
}
