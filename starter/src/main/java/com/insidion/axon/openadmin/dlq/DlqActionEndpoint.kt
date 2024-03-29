package com.insidion.axon.openadmin.dlq

import com.fasterxml.jackson.databind.JsonNode
import com.insidion.axon.openadmin.EndpointService
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.eventhandling.EventMessage
import org.axonframework.eventhandling.async.SequencingPolicy
import org.axonframework.messaging.Message
import org.axonframework.serialization.Serializer
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("\${axon.admin.base-url:axon-admin}/dlq")
@CrossOrigin
class DlqActionEndpoint(
    private val eventProcessingConfiguration: EventProcessingConfiguration,
    private val serializer: Serializer,
    private val endpointService: EndpointService
) {

    @GetMapping("items/{processor}", produces = ["application/json"])
    fun processorMessages(@PathVariable processor: String) = endpointService.ifReady {
        val dlq = eventProcessingConfiguration.deadLetterQueue(processor)
            .orElseThrow { IllegalArgumentException("There is no dlq configured for processor $processor") }
        val sequencingPolicy = eventProcessingConfiguration.sequencingPolicy(processor)
        dlq.deadLetters().map {
            val list = it.toList()
            val i = list.first()
            val firstMessage = i.message()
            val sequence = sequencingPolicy.getNullableIdentifier(firstMessage)
            DlqItem(
                sequence,
                list.size,
                i.enqueuedAt(),
                i.lastTouched(),
                firstMessage.identifier,
                firstMessage.payload.javaClass.simpleName,
                firstMessage.payload.serialize(),
                firstMessage.metaData.serialize(),
                i.diagnostics().serialize(),
                i.cause().map { c -> c.type() }.orElse(null),
                i.cause().map { c -> c.message() }.orElse(null),
            )
        }.distinctBy { it.sequence }
    }

    @PostMapping("items/{processorName}/{sequence}/retry", produces = ["application/json"])
    fun retry(@PathVariable processorName: String, @PathVariable sequence: String): ResponseEntity<Void> {
        val dlq = eventProcessingConfiguration.sequencedDeadLetterProcessor(processorName)
            .orElseThrow { IllegalArgumentException("There is no dlq configured for processor $processorName") }
        val sequencingPolicy = eventProcessingConfiguration.sequencingPolicy(processorName)
        val result = dlq.process { sequencingPolicy.getNullableIdentifier(it.message()) == sequence }

        if (result) {
            return ResponseEntity.ok().build()
        }
        return ResponseEntity.status(500).build()
    }

    @PostMapping("items/{processorName}/{sequence}/evict/first", produces = ["application/json"])
    fun evict(@PathVariable processorName: String, @PathVariable sequence: String): ResponseEntity<Void> {
        val dlq = eventProcessingConfiguration.deadLetterQueue(processorName)
            .orElseThrow { IllegalArgumentException("There is no dlq configured for processor $processorName") }
        val first = dlq.deadLetterSequence(sequence).first()
        dlq.evict(first)

        return retry(processorName, sequence)
    }

    @PostMapping("items/{processorName}/{sequence}/evict/all", produces = ["application/json"])
    fun evictAll(@PathVariable processorName: String, @PathVariable sequence: String): ResponseEntity<Void> {
        val dlq = eventProcessingConfiguration.deadLetterQueue(processorName)
            .orElseThrow { IllegalArgumentException("There is no dlq configured for processor $processorName") }
        dlq.deadLetterSequence(sequence).forEach { dlq.evict(it) }

        return ResponseEntity.status(200).build()
    }

    private fun Any?.serialize(): Any? {
        return if (serializer.canSerializeTo(JsonNode::class.java)) serializer.serialize(
            this,
            JsonNode::class.java
        ).data
        else serializer.serialize(this, String::class.java).data
    }

    private fun SequencingPolicy<in EventMessage<*>>.getNullableIdentifier(message: EventMessage<*>): String {
        return getSequenceIdentifierFor(message)?.toString() ?: message.identifier
    }
}
