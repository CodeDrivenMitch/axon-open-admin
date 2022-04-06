package com.insidion.axon.openadmin.metrics

data class Statistics(
        val behind: Long,
        val seconds10: StatisticForSeconds,
        val seconds60: StatisticForSeconds,
        val seconds300: StatisticForSeconds,
)

data class StatisticForSeconds(
    val seconds: Long,
    val ingestRate: Double,
    val positionRate: Double,
    val effectiveRate: Double,
    val minutesToHead: Double?,
)
