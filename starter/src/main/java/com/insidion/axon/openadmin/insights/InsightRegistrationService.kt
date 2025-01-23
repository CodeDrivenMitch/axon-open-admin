package com.insidion.axon.openadmin.insights

import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

@Service
class InsightRegistrationService {
    private val originMessages: MutableMap<MessageKey, AtomicInteger> = ConcurrentHashMap()
    private val handlers: MutableMap<Handler, HandlerStats> = ConcurrentHashMap()

    fun getOverview() = InsightOverview(
        handlers.map { HandlerOverview(it.key, it.value) },
        originMessages.map { OriginMessageOverview(it.key, it.value) }
    )

    fun reportOriginMessage(handler: MessageKey) {
        originMessages.computeIfAbsent(handler) { AtomicInteger(0) }.incrementAndGet()
    }

    fun reportHandlerSuccess(handler: Handler) {
        handlers.computeIfAbsent(handler) { HandlerStats() }.successCounter.incrementAndGet()
    }

    fun reportHandlerMessagesPublished(handler: Handler, messages: List<MessageKey>) {
        val map = handlers.computeIfAbsent(handler) { HandlerStats() }.publishedMessages
        messages.forEach { m ->
            map.computeIfAbsent(m) { PublishedMessageStats(m) }
                .count.incrementAndGet()
        }
    }

    fun reportHandlerRollback(handler: Handler) {
        handlers.computeIfAbsent(handler) { HandlerStats() }.failureCounter.incrementAndGet()
    }
}
