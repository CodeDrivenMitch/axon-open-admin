package com.insidion.axon.openadmin.insights

import org.axonframework.commandhandling.CommandBus
import org.axonframework.eventhandling.EventBus
import org.axonframework.messaging.Message
import org.axonframework.messaging.MessageDispatchInterceptor
import org.axonframework.messaging.unitofwork.CurrentUnitOfWork
import org.axonframework.queryhandling.QueryBus
import org.springframework.stereotype.Component
import java.util.LinkedList
import java.util.function.BiFunction
import javax.annotation.PostConstruct

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
            return BiFunction { _, message ->
                insightRegistrationService.reportOriginMessage(MessageKey(message))
                message
            }
        }
        val publishedMessages = CurrentUnitOfWork.get()
            .getOrComputeResource("__AXON_ADMIN_DISPATCHED_MESSAGES") { LinkedList<MessageKey>() }
        CurrentUnitOfWork.get().onCommit {
            insightRegistrationService.reportHandlerMessagesPublished(
                CurrentUnitOfWork.get().getResource("__AXON_OPEN_ADMIN_HANDLER") as Handler, publishedMessages
            )
        }
        return BiFunction { _, message ->
            publishedMessages.add(MessageKey(message))
            message
        }
    }

}
