package com.insidion.axon.openadmin.insights

import org.axonframework.commandhandling.CommandMessage
import org.axonframework.deadline.DeadlineMessage
import org.axonframework.eventhandling.EventMessage
import org.axonframework.messaging.Message
import org.axonframework.queryhandling.QueryMessage
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

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
    val count: AtomicInteger = AtomicInteger(0),
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
            is DeadlineMessage<*> -> DeadlineMessage::class.simpleName!!
            else -> message::class.simpleName!!
        },
        if (message.payload != null) {
            message.payload::class.simpleName!!
        } else "null"
    )
}

data class HandlerStats(
    var successCounter: AtomicInteger = AtomicInteger(0),
    var failureCounter: AtomicInteger = AtomicInteger(0),
    val publishedMessages: MutableMap<MessageKey, PublishedMessageStats> = ConcurrentHashMap()
)

data class PublishedMessageStats(
    val message: MessageKey,
    var count: AtomicInteger = AtomicInteger(0)
)
