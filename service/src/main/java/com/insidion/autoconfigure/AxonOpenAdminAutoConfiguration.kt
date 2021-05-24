package com.insidion.autoconfigure

import com.insidion.axon.openadmin.AxonAdminConfiguration
import org.axonframework.springboot.autoconfig.AxonAutoConfiguration
import org.springframework.boot.autoconfigure.AutoConfigureAfter
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.scheduling.annotation.EnableScheduling

@Configuration(proxyBeanMethods = false)
@EnableScheduling
@AutoConfigureAfter(AxonAutoConfiguration::class)
@Import(AxonAdminConfiguration::class)
class AxonOpenAdminAutoConfiguration
