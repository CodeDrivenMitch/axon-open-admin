package com.insidion.axon.openadmin.events

import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.DomainEventMessage
import org.axonframework.eventhandling.GapAwareTrackingToken
import org.axonframework.eventsourcing.eventstore.EventStorageEngine
import org.axonframework.serialization.Serializer
import org.springframework.stereotype.Service
import java.time.Instant
import kotlin.streams.toList

@Service
@ProcessingGroup("admin")
class EventTailingService(
    private val serializer: Serializer,
    private val eventStore: EventStorageEngine,
) {
    fun getEvents(): List<CaughtEvent> {
        val events = eventStore.readEvents(GapAwareTrackingToken.newInstance(eventStore.createHeadToken().position().orElse(0) - 50, emptyList()), true)
        return events.filter { it is DomainEventMessage<*> }.map { it as DomainEventMessage<*> }
            .map { CaughtEvent(it.timestamp, it.aggregateIdentifier, it.payloadType.simpleName, it.sequenceNumber, it.serializePayload(serializer, String::class.java).data) }.toList()
            .sortedByDescending { it.timestamp }
    }

    data class CaughtEvent(
        val timestamp: Instant,
        val aggregate: String,
        val payloadType: String,
        val index: Long,
        val payload: Any,
    )
}
