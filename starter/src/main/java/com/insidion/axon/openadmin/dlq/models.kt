package com.insidion.axon.openadmin.dlq

import java.time.Instant

data class DlqGenericInformation(
    val numberOfSequences: Long,
    val numberOfMessages: Long,
)

data class DlqItem(
    val sequence: String,
    val amount: Int,
    val enqueuedAt: Instant,
    val lastTouched: Instant,
    val eventIdentifier: String,
    val payloadType: String,
    val payload: Any?,
    val metadata: Any?,
    val diagnostics: Any?,
    val causeType: String?,
    val causeMessage: String?,
)
