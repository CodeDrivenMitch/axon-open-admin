package com.insidion.axon.openadmin.tokens

import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry
import org.axonframework.eventhandling.tokenstore.jpa.JpaTokenStore
import org.axonframework.eventhandling.tokenstore.jpa.TokenEntry
import javax.annotation.PostConstruct
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class JpaTokenProvider(
    private val jpaTokenStore: JpaTokenStore,
) : TokenProvider {
    private lateinit var nodeId: String
    @PersistenceContext
    private lateinit var em: EntityManager

    override fun getNodeId(): String {
        return nodeId
    }

    @PostConstruct
    fun initialize() {
        // Get nodeId for identifying purposes
        val nodeIdField = jpaTokenStore::class.java.getDeclaredField("nodeId")
        nodeIdField.isAccessible = true
        nodeId = nodeIdField.get(jpaTokenStore) as String
        nodeIdField.isAccessible = false
    }

    override fun getProcessors(): List<AbstractTokenEntry<*>> {
        return em.createQuery("select e from TokenEntry e").resultList as List<TokenEntry>
    }
}
