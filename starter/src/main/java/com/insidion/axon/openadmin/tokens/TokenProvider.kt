package com.insidion.axon.openadmin.tokens

import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry
import org.axonframework.eventhandling.tokenstore.GenericTokenEntry

interface TokenProvider {
    fun getProcessors(): List<AbstractTokenEntry<*>>

    fun getNodeId(): String
}
