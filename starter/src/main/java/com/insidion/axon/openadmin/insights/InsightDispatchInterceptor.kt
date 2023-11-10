package com.insidion.axon.openadmin.insights

import org.axonframework.commandhandling.CommandBus
import org.axonframework.eventhandling.EventBus
import org.axonframework.messaging.Message
import org.axonframework.messaging.MessageDispatchInterceptor
import org.axonframework.messaging.unitofwork.CurrentUnitOfWork
import org.axonframework.queryhandling.QueryBus
import org.springframework.stereotype.Component
import java.util.*
import java.util.function.BiFunction
import jakarta.annotation.PostConstruct

private const val DISPATCHED_MESSAGES = "__AXON_ADMIN_DISPATCHED_MESSAGES"
private const val HANDLER = "__AXON_OPEN_ADMIN_HANDLER"

@Component
class InsightDispatchInterceptor(
    private val eventBus: EventBus,
    private val commandBus: CommandBus,
    private val queryBus: QueryBus,
    private val insightRegistrationService: InsightRegistrationService
) : MessageDispatchInterceptor<Message<*>> {
    @PostConstruct
    fun register() {
        eventBus.registerDispatchInterceptor(this)
        commandBus.registerDispatchInterceptor(this)
        queryBus.registerDispatchInterceptor(this)
    }

    override fun handle(messages: MutableList<out Message<*>>): BiFunction<Int, Message<*>, Message<*>> {
        if (!CurrentUnitOfWork.isStarted()) {
            return originDispatchInterceptor
        }
        val uow = CurrentUnitOfWork.get()
        val handler = uow.getResource(HANDLER) as Handler? ?: return originDispatchInterceptor
        val publishedMessages = uow.getOrComputeResource(DISPATCHED_MESSAGES) { LinkedList<MessageKey>() }
        return BiFunction { _, message ->
            publishedMessages.add(MessageKey(message))
            uow.onCommit {
                insightRegistrationService.reportHandlerMessagesPublished(handler, publishedMessages)
            }

            message
        }
    }

    private val originDispatchInterceptor = BiFunction<Int, Message<*>, Message<*>> { _, message ->
        insightRegistrationService.reportOriginMessage(MessageKey(message))
        message
    }

}
