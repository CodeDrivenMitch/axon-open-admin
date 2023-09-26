package com.insidion.axon.openadmin.insights

import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class InsightRegistrationService {
    private val originMessages: MutableMap<MessageKey, Int> = ConcurrentHashMap()
    private val handlers: MutableMap<Handler, HandlerStats> = ConcurrentHashMap()

    fun getOverview() = InsightOverview(
        handlers.map { HandlerOverview(it.key, it.value) },
        originMessages.map { OriginMessageOverview(it.key, it.value) }
    )

    fun reportOriginMessage(handler: MessageKey) {
        val current = originMessages.computeIfAbsent(handler) { 0 }
        originMessages[handler] = current + 1
    }

    fun reportHandlerSuccess(handler: Handler) {
        handlers.computeIfAbsent(handler) { HandlerStats() }.successCounter += 1
    }

    fun reportHandlerMessagesPublished(handler: Handler, messages: List<MessageKey>) {
        val map = handlers.computeIfAbsent(handler) { HandlerStats() }.publishedMessages
        messages.forEach { m ->
            map.computeIfAbsent(m) { PublishedMessageStats(m) }
                .count += 1
        }
    }

    fun reportHandlerRollback(handler: Handler) {
        handlers.computeIfAbsent(handler) { HandlerStats() }.failureCounter += 1
    }
}
