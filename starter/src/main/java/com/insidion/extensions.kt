package com.insidion

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity

fun Any.toResponse(objectMapper: ObjectMapper): ResponseEntity<String> {
    return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON)
        .body(objectMapper.writeValueAsString(this))
}
