package com.insidion.axon.openadmin

import com.insidion.axon.openadmin.tokens.DummyTokenProvider
import com.insidion.axon.openadmin.tokens.JdbcTokenProvider
import com.insidion.axon.openadmin.tokens.JpaTokenProvider
import com.insidion.axon.openadmin.tokens.TokenProvider
import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.simple.SimpleMeterRegistry
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.tokenstore.TokenStore
import org.axonframework.eventhandling.tokenstore.jdbc.JdbcTokenStore
import org.axonframework.eventhandling.tokenstore.jpa.JpaTokenStore
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct
import javax.sql.DataSource

@Configuration(proxyBeanMethods = false)
@ComponentScan("com.insidion.axon.openadmin")
class AxonAdminConfiguration (
    @Value("\${server.servlet.context-path:}")
    val contextPath: String
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostConstruct
    fun logInitialization() {
        logger.info("Thanks for using AxonOpenAdmin in your application. To get started, navigate to $contextPath/axon-open-admin")
    }

    @Bean
    @ConditionalOnMissingBean(MeterRegistry::class)
    fun meterRegistry() = SimpleMeterRegistry()

    @Bean
    fun tokenProvider(tokenStore: TokenStore, dataSource: DataSource?): TokenProvider {
        if (tokenStore is JpaTokenStore) {
            return JpaTokenProvider(tokenStore)
        } else if (tokenStore is JdbcTokenStore) {
            return JdbcTokenProvider(tokenStore, dataSource!!)
        }
        throw IllegalArgumentException("No matching store!")
    }

    @Bean
    @ConditionalOnMissingBean(TokenStore::class)
    fun tokenProvider() = DummyTokenProvider()
}

