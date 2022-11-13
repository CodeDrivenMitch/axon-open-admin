package com.insidion.axon.openadmin.insights

import org.axonframework.messaging.Message
import org.axonframework.messaging.annotation.HandlerEnhancerDefinition
import org.axonframework.messaging.annotation.MessageHandlingMember
import org.axonframework.messaging.annotation.WrappedMessageHandlingMember
import org.axonframework.messaging.unitofwork.CurrentUnitOfWork
import org.springframework.stereotype.Service
import java.lang.reflect.Constructor
import java.lang.reflect.Executable

@Service
class InsightHandlerEnhancer(
    private val registrationService: InsightRegistrationService,
) : HandlerEnhancerDefinition {
    override fun <T : Any?> wrapHandler(original: MessageHandlingMember<T>): MessageHandlingMember<T> {
        if (original.attribute<Any>("EventSourcingHandler.payloadType").isPresent) {
            // Skip event sourcing handlers
            return original;
        }
        val executable = original.unwrap(Executable::class.java).orElse(null) ?: return original
        val signature = "${original.declaringClass().simpleName}.${executable.toMethodSignature()}"

        return object : WrappedMessageHandlingMember<T>(original) {
            override fun handle(message: Message<*>, target: T?): Any? {
                val handler = Handler(
                    MessageKey(message),
                    declaringClass()::class.java.simpleName,
                    signature
                )
                CurrentUnitOfWork.get().resources()["__AXON_OPEN_ADMIN_HANDLER"] = handler
                CurrentUnitOfWork.get().afterCommit {
                    registrationService.reportHandlerSuccess(handler)
                }
                CurrentUnitOfWork.get().onRollback {
                    registrationService.reportHandlerRollback(handler)
                }
                return super.handle(message, target)
            }
        }
    }

    fun Executable.toMethodSignature(): String {
        val parameterString = parameterTypes.joinToString(",") { obj: Class<*> -> obj.simpleName }
        if (this is Constructor<*>) {
            return "${this.declaringClass.simpleName}(${parameterString})"
        }
        return String.format("%s(%s)", name, parameterString)
    }
}
