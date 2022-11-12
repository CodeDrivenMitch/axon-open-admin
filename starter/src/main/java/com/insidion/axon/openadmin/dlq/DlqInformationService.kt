package com.insidion.axon.openadmin.dlq

import org.axonframework.config.EventProcessingConfiguration
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class DlqInformationService(
    private val eventProcessingConfiguration: EventProcessingConfiguration,
) {
    // We cache the value for two seconds to prevent too many calls to the database
    private var cachedValue: Map<String, DlqGenericInformation>? = null
    private var cacheTime: Instant? = null

    fun getOverview(): Map<String, DlqGenericInformation> {
        return if (cachedValue == null || cacheTime?.isAfter(Instant.now().minusSeconds(2)) != true) {
            val newValue = eventProcessingConfiguration.eventProcessors().keys
                .associateWith { name ->
                    eventProcessingConfiguration.deadLetterQueue(name)
                        .map { dlq ->
                            DlqGenericInformation(dlq.amountOfSequences(), dlq.size())
                        }
                        .orElse(null)
                }
            cachedValue = newValue
            cacheTime = Instant.now()
            newValue
        } else {
            cachedValue!!
        }
    }
}
