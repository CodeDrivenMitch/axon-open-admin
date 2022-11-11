package com.insidion.axon.openadmin.model

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
