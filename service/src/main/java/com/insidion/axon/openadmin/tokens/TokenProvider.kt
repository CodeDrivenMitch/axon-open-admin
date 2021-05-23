package com.insidion.axon.openadmin.tokens

import org.axonframework.eventhandling.tokenstore.GenericTokenEntry

interface TokenProvider {
    fun getProcessors(): List<GenericTokenEntry<*>>

    fun getNodeId(): String
}
