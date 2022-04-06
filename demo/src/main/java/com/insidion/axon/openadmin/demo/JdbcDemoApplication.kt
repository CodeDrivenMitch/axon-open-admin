package com.insidion.axon.openadmin.demo

import org.axonframework.common.jdbc.ConnectionProvider
import org.axonframework.common.jdbc.PersistenceExceptionResolver
import org.axonframework.common.transaction.TransactionManager
import org.axonframework.eventhandling.tokenstore.TokenStore
import org.axonframework.eventhandling.tokenstore.jdbc.GenericTokenTableFactory
import org.axonframework.eventhandling.tokenstore.jdbc.JdbcTokenStore
import org.axonframework.eventhandling.tokenstore.jdbc.TokenSchema
import org.axonframework.eventsourcing.eventstore.EventStorageEngine
import org.axonframework.eventsourcing.eventstore.jdbc.EventSchema
import org.axonframework.eventsourcing.eventstore.jdbc.JdbcEventStorageEngine
import org.axonframework.eventsourcing.eventstore.jdbc.MySqlEventTableFactory
import org.axonframework.serialization.Serializer
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import java.time.Duration
import java.time.temporal.ChronoUnit

@SpringBootApplication
class JdbcDemoApplication {
    @Bean
    fun eventSchema() = EventSchema.builder()
        .eventTable("DOMAIN_EVENT")
        .aggregateIdentifierColumn("AGGREGATE_ID")
        .payloadColumn("PAYLOAD")
        .payloadTypeColumn("PAYLOAD_TYPE")
        .metaDataColumn("METADATA")
        .sequenceNumberColumn("SEQUENCE_NUMBER")
        .eventIdentifierColumn("EVENT_ID")
        .typeColumn("AGGREGATE_TYPE")
        .globalIndexColumn("GLOBAL_INDEX")
        .timestampColumn("EVENT_DT")
        .snapshotTable("VVI_SNAPSHOT")
        .payloadRevisionColumn("PAYLOAD_REV")
        .build()!!

    @Bean
    fun tokenSchema() = TokenSchema.builder()
        .setTokenTable("VVI_TOKEN_ENTRY")
        .setProcessorNameColumn("PROCESSOR_NAME")
        .setSegmentColumn("SEGMENT")
        .setTokenColumn("TOKEN")
        .setTokenTypeColumn("TOKEN_TYPE")
        .setTimestampColumn("TOKEN_DT")
        .setOwnerColumn("OWNER")
        .build()!!

    @Bean
    @Autowired
    fun eventStorageEngine(
        defaultSerializer: Serializer,
        connectionProvider: ConnectionProvider,
        persistenceExceptionResolver: PersistenceExceptionResolver,
        @Qualifier("eventSerializer") eventSerializer: Serializer,
        transactionManager: TransactionManager,
        eventSchema: EventSchema,
    ): EventStorageEngine {
        val jdbcEngine = JdbcEventStorageEngine.builder()
            .connectionProvider(connectionProvider)
            .persistenceExceptionResolver(persistenceExceptionResolver)
            .batchSize(1000)
            .eventSerializer(eventSerializer)
            .snapshotSerializer(defaultSerializer)
            .transactionManager(transactionManager)
            .schema(eventSchema)
            .build()
        jdbcEngine.createSchema(MySqlEventTableFactory.INSTANCE)
        return jdbcEngine
    }


    @Bean
    @Autowired
    fun tokenStore(
        connectionProvider: ConnectionProvider,
        defaultSerializer: Serializer,
        tokenSchema: TokenSchema,
    ): TokenStore {
        val store = JdbcTokenStore.builder()
            .serializer(defaultSerializer)
            .connectionProvider(connectionProvider)
            .schema(tokenSchema)
            .claimTimeout(Duration.of(5000, ChronoUnit.MILLIS))
            .build()
        store.createSchema(GenericTokenTableFactory.INSTANCE)
        return store
    }
}


fun main(args: Array<String>) {
    runApplication<JdbcDemoApplication>(*args)
}
