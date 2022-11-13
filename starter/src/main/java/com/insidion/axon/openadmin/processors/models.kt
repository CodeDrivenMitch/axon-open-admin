package com.insidion.axon.openadmin.processors

data class ProcessorStatusDTO(
    val name: String,
    val tokenStoreIdentifier: String,
    val running: Boolean,
    val error: Boolean,
    val resettable: Boolean,
    val activeProcessorThreads: Int?,
    val availableProcessorThreads: Int,
    val batchSize: Int?,
    val type: String,
    val dlqConfigured: Boolean,
    val segments: List<SegmentDTO>,
)

data class TokenInformationDTO(
    val nodeId: String,
    val headIndex: Long,
    val processors: List<ProcessorDTO>
)

data class ProcessorDTO(
    val name: String,
    val currentIndex: Long?,
    val replaying: Boolean?,
    val segments: List<SegmentDTO>
)

data class SegmentDTO(
    val segment: Int?,
    val oneOf: Int,
    val tokenType: String?,
    val currentIndex: Long?,
    val replaying: Boolean?,
    val behind: Long,
    val mergeableSegment: Int?,
    val splitSegment: Int?,
)
