package com.insidion.axon.openadmin.tokens

import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry
import org.axonframework.eventhandling.tokenstore.GenericTokenEntry
import org.axonframework.eventhandling.tokenstore.jdbc.JdbcTokenStore
import org.axonframework.eventhandling.tokenstore.jdbc.TokenSchema
import java.lang.reflect.Method
import java.sql.ResultSet
import javax.annotation.PostConstruct
import javax.sql.DataSource

class JdbcTokenProvider(
    private val jdbcTokenStore: JdbcTokenStore,
    private val dataSource: DataSource
) : TokenProvider {
    private lateinit var readTokenEntry: Method
    private lateinit var table: String
    private lateinit var columns: String
    private lateinit var nodeId: String

    override fun getNodeId(): String {
        return nodeId
    }

    @PostConstruct
    fun initialize() {
        val schemaField = jdbcTokenStore::class.java.getDeclaredField("schema")
        schemaField.isAccessible = true
        val schema = schemaField.get(jdbcTokenStore) as TokenSchema
        schemaField.isAccessible = false

        // Get nodeId for identifying purposes
        val nodeIdField = jdbcTokenStore::class.java.getDeclaredField("nodeId")
        nodeIdField.isAccessible = true
        nodeId = nodeIdField.get(jdbcTokenStore) as String
        nodeIdField.isAccessible = false

        readTokenEntry = jdbcTokenStore::class.java.getDeclaredMethod("readTokenEntry", ResultSet::class.java)
        readTokenEntry.isAccessible = true


        columns = listOf(
            schema.processorNameColumn(), schema.segmentColumn(), schema.tokenColumn(),
            schema.tokenTypeColumn(), schema.timestampColumn(), schema.ownerColumn()
        ).joinToString()
        table = schema.tokenTable()
    }

    override fun getProcessors(): List<AbstractTokenEntry<*>> {
        val sql = "SELECT $columns FROM $table"

        val connection = dataSource.connection
        val preparedStatement = connection.prepareStatement(sql)
        preparedStatement.execute()
        val result = preparedStatement.resultSet

        val tokenList = mutableListOf<GenericTokenEntry<*>>()
        while (result.next()) {
            tokenList.add(readTokenEntry.invoke(jdbcTokenStore, result) as GenericTokenEntry<*>)
        }
        preparedStatement.close()
        connection.close()

        return tokenList
    }
}
