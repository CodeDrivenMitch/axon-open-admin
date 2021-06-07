package com.insidion.axon.openadmin.demo

import org.axonframework.config.EventProcessingConfigurer
import org.axonframework.eventhandling.PropagatingErrorHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration

@Configuration
class AxonEventProcessorConfig {
    @Autowired
    fun configure(config: EventProcessingConfigurer) {
        config.registerDefaultListenerInvocationErrorHandler { PropagatingErrorHandler.INSTANCE }
    }
}
