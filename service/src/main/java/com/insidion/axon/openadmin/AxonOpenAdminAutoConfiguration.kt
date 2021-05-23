package com.insidion.axon.openadmin

import com.insidion.axon.openadmin.tokens.DummyTokenProvider
import com.insidion.axon.openadmin.tokens.JdbcTokenProvider
import com.insidion.axon.openadmin.tokens.TokenProvider
import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.simple.SimpleMeterRegistry
import org.axonframework.eventhandling.tokenstore.TokenStore
import org.axonframework.eventhandling.tokenstore.jdbc.JdbcTokenStore
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import javax.annotation.PostConstruct
import javax.sql.DataSource

@Configuration
@ComponentScan("com.insidion.axon.openadmin")
@EnableScheduling
class AxonOpenAdminAutoConfiguration(
    @Value("\${server.servlet.context-path:}")
    val contextPath: String
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostConstruct
    fun logInitialization() {
        logger.info("Thanks for using AxonOpenAdmin in your application. To get started, navigate to $contextPath/axon-open-admin")
    }

    @Bean
    @ConditionalOnBean(TokenStore::class)
    @ConditionalOnMissingBean(TokenProvider::class)
    fun tokenProvider(tokenStore: TokenStore, dataSource: DataSource): TokenProvider {
        if(tokenStore is JdbcTokenStore) {
            return JdbcTokenProvider(tokenStore, dataSource)
        }
        throw IllegalStateException("Unsupported token store!")
    }

    @Bean
    @ConditionalOnMissingBean(MeterRegistry::class)
    fun meterRegistry() = SimpleMeterRegistry()

    @Bean
    @ConditionalOnMissingBean(TokenStore::class)
    fun tokenProvider() = DummyTokenProvider()
}
