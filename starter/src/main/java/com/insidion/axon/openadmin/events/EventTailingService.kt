package com.insidion.axon.openadmin.events

import com.fasterxml.jackson.databind.JsonNode
import com.insidion.axon.openadmin.TokenProvider
import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.DomainEventMessage
import org.axonframework.eventhandling.EventMessage
import org.axonframework.eventhandling.TrackedEventMessage
import org.axonframework.eventhandling.TrackingToken
import org.axonframework.eventsourcing.eventstore.EventStore
import org.axonframework.serialization.UnknownSerializedType
import org.axonframework.serialization.json.JacksonSerializer
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.concurrent.TimeUnit
import kotlin.streams.toList

@Service
@ProcessingGroup("admin")
class EventTailingService(
    private val eventStore: EventStore,
    private val tokenProvider: TokenProvider,
) {
    private val serializer = JacksonSerializer.builder().build()

    fun getCurrentIndex(): Long {
        return eventStore.createHeadToken()?.position()?.orElse(0) ?: 0
    }

    fun getIndexAt(instant: Instant): Long {
        return eventStore.createTokenAt(instant)?.position()?.orElse(0) ?: 0
    }

    fun getEvents(sinceIndex: Long?): List<CaughtEvent> {
        val index = sinceIndex ?: (getCurrentIndex() - 100)
        val items = mutableListOf<TrackedEventMessage<*>>()
        val stream = eventStore.openStream(createToken(index))
        while (stream.hasNextAvailable(100, TimeUnit.MILLISECONDS) && items.size < 100) {
            items.add(stream.nextAvailable())
        }

        return mapEvents(items)
    }

    private fun createToken(index: Long): TrackingToken = tokenProvider.provideTokenForIndex(index)

    fun getEvents(aggregateIdentifier: String, sequence: Long): List<CaughtEvent> {
        return mapEvents(eventStore.readEvents(aggregateIdentifier, sequence).asStream().toList())

    }

    fun mapEvents(stream: List<EventMessage<*>>) = stream
        .filter { it is DomainEventMessage<*> }
        .map { it as DomainEventMessage<*> }
        .filter { it.payload !is UnknownSerializedType }
        .map {
            val globalSequence = if (it is TrackedEventMessage<*>) it.trackingToken().position().orElse(0) else 0
            CaughtEvent(
                it.timestamp,
                it.aggregateIdentifier,
                it.payloadType.simpleName,
                it.sequenceNumber,
                globalSequence,
                try {
                    it.serializePayload(serializer, JsonNode::class.java).data
                } catch (e: Exception) {
                    null
                }
            )
        }.toList()
        .sortedByDescending { it.timestamp }

    data class CaughtEvent(
        val timestamp: Instant,
        val aggregate: String,
        val payloadType: String,
        val index: Long,
        val globalSequence: Long,
        val payload: JsonNode?,
    )
}
