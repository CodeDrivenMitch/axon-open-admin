package com.insidion.axon.openadmin.insights

import org.axonframework.commandhandling.CommandMessage
import org.axonframework.eventhandling.EventMessage
import org.axonframework.messaging.Message
import org.axonframework.queryhandling.QueryMessage

data class InsightOverview(
    val handlers: List<HandlerOverview>,
    val originMessages: List<OriginMessageOverview>,
)

data class HandlerOverview(
    val handler: Handler,
    val stats: HandlerStats
)

data class OriginMessageOverview(
    val message: MessageKey,
    val count: Int,
)

data class Handler(
    val message: MessageKey,
    val containingClass: String,
    val signature: String,
)

data class MessageKey(
    val messageType: String,
    val payloadType: String,
) {
    constructor(message: Message<*>) : this(
        when (message) {
            is CommandMessage -> CommandMessage::class.simpleName!!
            is EventMessage -> EventMessage::class.simpleName!!
            is QueryMessage<*, *> -> QueryMessage::class.simpleName!!
            else -> message::class.simpleName!!
        }, message.payload::class.java.simpleName
    )
}

data class HandlerStats(
    var successCounter: Int = 0,
    var failureCounter: Int = 0,
    val publishedMessages: MutableMap<MessageKey, PublishedMessageStats> = HashMap()
)

data class PublishedMessageStats(
    val message: MessageKey,
    var count: Int = 0
)
