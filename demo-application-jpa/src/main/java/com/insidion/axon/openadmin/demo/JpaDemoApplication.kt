package com.insidion.axon.openadmin.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
class JpaDemoApplication {
}


fun main(args: Array<String>) {
    runApplication<JpaDemoApplication>(*args)
}
