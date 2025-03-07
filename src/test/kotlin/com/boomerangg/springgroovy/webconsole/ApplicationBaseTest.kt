package com.boomerangg.springgroovy.webconsole

import com.boomerangg.springgroovy.webconsole.configuration.SpringGroovyWebConsoleAutoConfiguration
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestConstructor

@SpringBootTest(classes = [SpringGroovyWebConsoleAutoConfiguration::class])
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
@EnableAutoConfiguration
@AutoConfigureMockMvc
abstract class ApplicationBaseTest
