package com.boomerangg.springgroovy.webconsole

import com.boomerangg.springgroovy.webconsole.configuration.SpringGroovyWebConsoleAutoConfiguration
import com.boomerangg.springgroovy.webconsole.dto.ScriptDto
import com.boomerangg.springgroovy.webconsole.dto.ScriptExecutionResultResponse
import com.boomerangg.springgroovy.webconsole.external.GroovyScriptData
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.view
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@SpringBootTest(
    classes = [SpringGroovyWebConsoleAutoConfiguration::class],
    properties = [
        "groovy-web-console.api.web-console-page.prefix=/groovy",
        "groovy-web-console.examples.enabled=false",
    ]
)
class CustomConfigurationTest(
    private val mockMvc: MockMvc,
    private val objectMapper: ObjectMapper,
) : ApplicationBaseTest() {

    @Test
    fun `should change html page path through property`() {
        mockMvc.perform(
            get("/groovy"),
        )
            .andExpect(status().isOk)
            .andExpect(view().name("console/index.html"))
    }

    @Test
    fun `should disable default script storage`() {
        val result = mockMvc.perform(
            get("/console/scripts"),
        )
            .andExpect(status().isOk)
            .andReturn()
            .response.contentAsString
            .let { objectMapper.readValue<List<GroovyScriptData>>(it) }

        assertEquals(0, result.size)
    }

    @Test
    fun `should response error on disabled receiver`() {
        val script = ScriptDto(script = "System.exit(0)")
        val result = mockMvc.perform(
            post("/console/groovy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(script)),
        )
            .andExpect(status().isOk)
            .andReturn()
            .response.contentAsString
            .let { objectMapper.readValue<ScriptExecutionResultResponse>(it) }

        assertEquals(1, result.output.size)
        assertTrue(result.output.first().contains("Method calls not allowed on [java.lang.System]"))
    }
}
