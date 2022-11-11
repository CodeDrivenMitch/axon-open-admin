package com.insidion.axon.openadmin

import org.springframework.stereotype.Component
import java.lang.management.ManagementFactory

@Component
class NodeIdProvider {
    fun getNodeId() = ManagementFactory.getRuntimeMXBean().name
}
