package com.boomerangg.springgroovy.webconsole

import com.boomerangg.springgroovy.webconsole.configuration.SpringGroovyWebConsoleAutoConfiguration
import com.boomerangg.springgroovy.webconsole.controller.ConsolePageController
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContext
import kotlin.test.assertEquals

@SpringBootTest(
    classes = [SpringGroovyWebConsoleAutoConfiguration::class],
    properties = [
        "groovy-web-console.enabled=false",
    ]
)
class WebConsoleDisabledTest(
    private val applicationContext: ApplicationContext,
) : ApplicationBaseTest() {

    @Test
    fun `should disable console on property`() {
        assertEquals(0, applicationContext.getBeansOfType(ConsolePageController::class.java).size)
        assertEquals(0, applicationContext.getBeansOfType(GroovyWebConsoleControllerTest::class.java).size)
    }
}
