package com.insidion.axon.openadmin

import org.springframework.stereotype.Component
import java.lang.management.ManagementFactory

@Component
class NodeIdProvider {
    val nodeId: String by lazy { ManagementFactory.getRuntimeMXBean().name }
}
