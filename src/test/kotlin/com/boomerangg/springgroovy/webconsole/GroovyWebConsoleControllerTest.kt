package com.boomerangg.springgroovy.webconsole

import com.boomerangg.springgroovy.webconsole.dto.ScriptDto
import com.boomerangg.springgroovy.webconsole.dto.ScriptExecutionResultResponse
import com.boomerangg.springgroovy.webconsole.external.GroovyScriptData
import com.boomerangg.springgroovy.webconsole.utils.Variables.EXAMPLE_SCRIPT
import com.boomerangg.springgroovy.webconsole.utils.Variables.EXAMPLE_SCRIPT_NAME
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class GroovyWebConsoleControllerTest(
    private val mockMvc: MockMvc,
    private val objectMapper: ObjectMapper,
) : ApplicationBaseTest() {

    @Test
    fun `should return scripts from storage`() {
        val result = mockMvc.perform(
            get("/console/scripts"),
        )
            .andExpect(status().isOk)
            .andReturn()
            .response.contentAsString
            .let { objectMapper.readValue<List<GroovyScriptData>>(it) }

        assertEquals(1, result.size)
        assertEquals(EXAMPLE_SCRIPT_NAME, result.first().name)
        assertEquals(EXAMPLE_SCRIPT, result.first().script)
    }

    @Test
    fun `should successfully execute simple script`() {
        val script = ScriptDto(script = "println 1 + 1 \n 2 + 2")
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
        assertEquals("2", result.output.first())
        assertEquals("4", result.result)
    }

    @Test
    fun `should successfully execute spring script`() {
        val script = ScriptDto(script = EXAMPLE_SCRIPT + "environment")
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
        assertTrue(result.output.first().startsWith("Application name: "))
        assertTrue(result.result!!.startsWith("ApplicationServletEnvironment"))
    }
}
