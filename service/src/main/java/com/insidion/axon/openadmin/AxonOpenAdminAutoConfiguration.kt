package com.insidion.axon.openadmin

import com.insidion.axon.openadmin.tokens.DummyTokenProvider
import com.insidion.axon.openadmin.tokens.JdbcTokenProvider
import com.insidion.axon.openadmin.tokens.JpaTokenProvider
import com.insidion.axon.openadmin.tokens.TokenProvider
import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.simple.SimpleMeterRegistry
import org.axonframework.common.jpa.EntityManagerProvider
import org.axonframework.eventhandling.tokenstore.TokenStore
import org.axonframework.eventhandling.tokenstore.jdbc.JdbcTokenStore
import org.axonframework.eventhandling.tokenstore.jpa.JpaTokenStore
import org.axonframework.springboot.autoconfig.JdbcAutoConfiguration
import org.axonframework.springboot.autoconfig.JpaAutoConfiguration
import org.axonframework.springboot.autoconfig.JpaEventStoreAutoConfiguration
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.AutoConfigureAfter
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import javax.annotation.PostConstruct
import javax.persistence.EntityManagerFactory
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
