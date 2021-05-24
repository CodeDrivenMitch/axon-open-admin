package com.insidion.axon.openadmin.tokens

import org.axonframework.eventhandling.tokenstore.GenericTokenEntry

class DummyTokenProvider : TokenProvider {
    override fun getProcessors(): List<GenericTokenEntry<*>> {
        return emptyList()
    }

    override fun getNodeId(): String {
        return "unknown"
    }
}
