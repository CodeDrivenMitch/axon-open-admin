package com.insidion.autoconfigure

import com.insidion.axon.openadmin.AxonAdminConfiguration
import org.axonframework.springboot.autoconfig.AxonAutoConfiguration
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.AutoConfigureAfter
import org.springframework.context.annotation.Import
import org.springframework.scheduling.annotation.EnableScheduling

@AutoConfiguration
@EnableScheduling
@Import(AxonAdminConfiguration::class)
@AutoConfigureAfter(AxonAutoConfiguration::class)
class AxonOpenAdminAutoConfiguration
