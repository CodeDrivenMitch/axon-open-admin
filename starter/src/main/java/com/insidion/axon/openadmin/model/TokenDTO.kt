package com.insidion.axon.openadmin.model

import com.insidion.axon.openadmin.metrics.Statistics

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
    val tokenType: String?,
    val owner: String?,
    val currentIndex: Long?,
    val replaying: Boolean?,
    val behind: Long,
    val statistics: Statistics?,
    val secondsToHead: Double?,
)
