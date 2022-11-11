package com.insidion.axon.openadmin.events

import com.insidion.axon.openadmin.EndpointService
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
    private val endpointService: EndpointService,
) {
    @GetMapping("/index")
    fun getIndex(@RequestParam(name = "sinceTime", required = false) sinceTime: String?) = endpointService.ifReady {
        if (sinceTime != null) {
            eventTailingService.getIndexAt(Instant.parse(sinceTime))
        } else eventTailingService.getCurrentIndex()
    }


    @GetMapping("/events")
    fun getEvents(@RequestParam(name = "sinceIndex", required = false) sinceIndex: Long?) =
        endpointService.ifReady { eventTailingService.getEvents(sinceIndex) }

    @GetMapping("/events/{aggregateId}")
    fun getEventsForAggregate(
        @PathVariable aggregateId: String,
        @RequestParam(name = "sinceIndex", required = false) sinceIndex: Long?
    ) =
        endpointService.ifReady {
            eventTailingService.getEvents(
                aggregateId,
                sinceIndex ?: 0
            )
        }
}
