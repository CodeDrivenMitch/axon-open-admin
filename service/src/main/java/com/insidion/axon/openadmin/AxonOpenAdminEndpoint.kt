package com.insidion.axon.openadmin

import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.TrackingEventProcessor
import org.axonframework.springboot.EventProcessorProperties
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.lang.Thread.sleep

@RestController
@RequestMapping("\${axon.admin.base-url:axon-admin}")
class AxonOpenAdminEndpoint(
    private val axonOpenAdminTokenStore: ProcessorInformationService,
    private val eventProcessingModule: EventProcessingModule,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/processors")
    fun getProcessors(): ProcessorInformationDTO {
        return axonOpenAdminTokenStore.getProcessors()
    }

    @PostMapping("/processor/{processorName}/split/{segmentId}")
    fun split(@PathVariable processorName: String, @PathVariable segmentId: Int): ResponseEntity<Unit> {
        return runOnProcessorWithResponse(processorName) {
            val status = it.processingStatus()[segmentId]
            val replayAfter = status?.isReplaying == true // When splitting, axon reverts to a normal token for some reason
            logger.warn("Splitting segment")
            it.splitSegment(segmentId).get()
            if (replayAfter) {
                if (it.isRunning) {
                    it.shutDown()
                }
                it.resetTokens()
                it.start()
            }
            true
        }
    }

    @PostMapping("/processor/{processorName}/merge/{segmentId}")
    fun merge(@PathVariable processorName: String, @PathVariable segmentId: Int): ResponseEntity<Unit> {
        return runOnProcessorWithResponse(processorName) {
            logger.warn("Starting merge")
            it.start()
            logger.warn("Will wait 5 seconds to let the eventprocessor start")
            sleep(5000) // Wait for it to start
            logger.warn("Attempting merge!")
            val status = it.processingStatus()[segmentId]
            if (status != null) {
                val mergableSegment = status.segment.mergeableSegmentId()
                it.mergeSegment(mergableSegment).get()
                logger.warn("Merge successful")
            } else {
                logger.warn("Merge failed")
            }
            true
        }
    }

    @PostMapping("/processor/{processorName}/release/{segmentId}")
    fun release(@PathVariable processorName: String, @PathVariable segmentId: Int): ResponseEntity<Unit> {
        return runOnProcessorWithResponse(processorName) {
            logger.warn("Starting release")
            it.processingStatus()[segmentId] ?: return@runOnProcessorWithResponse false
            it.releaseSegment(segmentId)
            true
        }
    }

    @PostMapping("/processor/{processorName}/stop")
    fun stop(@PathVariable processorName: String): ResponseEntity<Unit> {
        return runOnProcessorWithResponse(processorName) {
            it.shutDown()
            true
        }
    }

    @PostMapping("/processor/{processorName}/start")
    fun start(@PathVariable processorName: String): ResponseEntity<Unit> {
        return runOnProcessorWithResponse(processorName) {
            it.start()
            true
        }
    }

    @PostMapping("/processor/{processorName}/reset")
    fun reset(@PathVariable processorName: String): ResponseEntity<Unit> {
        return runOnProcessorWithResponse(processorName) {
            if (it.isRunning) {
                it.shutDown()
            }
            it.resetTokens()
            it.start()
            true
        }
    }

    private fun runOnProcessorWithResponse(processorName: String, block: (TrackingEventProcessor) -> Boolean): ResponseEntity<Unit> {
        val eventProcessor = eventProcessingModule.eventProcessor(processorName, TrackingEventProcessor::class.java)
        if(!eventProcessor.isPresent) {
            return ResponseEntity.status(409).build()
        }
        val result = eventProcessor
            .map(block)
            .orElse(false)

        return if (result) ResponseEntity.ok().build() else ResponseEntity.status(500).build()
    }
}
