package com.insidion.axon.openadmin.events

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("\${axon.admin.base-url:axon-admin}")
class AxonOpenAdminEventEndpoint(
        private val eventTailingService: EventTailingService,
) {
    @GetMapping("/index")
    fun getIndex(@RequestParam(name = "sinceTime", required = false) sinceTime: String?) = if (sinceTime != null) {
        eventTailingService.getIndexAt(Instant.parse(sinceTime))
    } else eventTailingService.getCurrentIndex()

    @GetMapping("/events")
    fun getEvents(@RequestParam(name = "sinceIndex", required = false) sinceIndex: Long?) = eventTailingService.getEvents(sinceIndex)

    @GetMapping("/events/{aggregateId}")
    fun getEventsForAggregate(@PathVariable aggregateId: String) = eventTailingService.getEvents(aggregateId)
}
