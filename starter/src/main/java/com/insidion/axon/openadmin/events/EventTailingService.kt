package com.insidion.axon.openadmin.events

import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.DomainEventMessage
import org.axonframework.eventhandling.GapAwareTrackingToken
import org.axonframework.eventhandling.TrackedEventMessage
import org.axonframework.eventsourcing.eventstore.EventStorageEngine
import org.axonframework.serialization.Serializer
import org.axonframework.serialization.UnknownSerializedType
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.stream.Stream
import kotlin.streams.toList

@Service
@ProcessingGroup("admin")
class EventTailingService(
        private val serializer: Serializer,
        private val eventStore: EventStorageEngine,
) {

    fun getCurrentIndex(): Long {
        return eventStore.createHeadToken().position().orElse(0)
    }
    fun getIndexAt(instant: Instant): Long {
        return eventStore.createTokenAt(instant).position().orElse(0)
    }

    fun getEvents(sinceIndex: Long?): List<CaughtEvent> {
        val index = sinceIndex ?: (getCurrentIndex() - 100)
        val events = eventStore.readEvents(GapAwareTrackingToken.newInstance(index, emptyList()), true)
                .limit(100)
        return mapEvents(events)
    }

    fun getEvents(aggregateIdentifier: String): List<CaughtEvent> {
        return mapEvents(eventStore.readEvents(aggregateIdentifier).asStream())

    }

    fun mapEvents(stream: Stream<*>) = stream
            .filter { it is DomainEventMessage<*> }
            .map { it as DomainEventMessage<*> }
            .filter { it.payloadType !is UnknownSerializedType }
            .map {
                val globalSequence = if (it is TrackedEventMessage<*>) it.trackingToken().position().orElse(0) else 0
                CaughtEvent(it.timestamp, it.aggregateIdentifier, it.payloadType.simpleName, it.sequenceNumber, globalSequence, it.serializePayload(serializer, String::class.java).data)
            }.toList()
            .sortedByDescending { it.timestamp }

    data class CaughtEvent(
            val timestamp: Instant,
            val aggregate: String,
            val payloadType: String,
            val index: Long,
            val globalSequence: Long,
            val payload: Any,
    )
}
