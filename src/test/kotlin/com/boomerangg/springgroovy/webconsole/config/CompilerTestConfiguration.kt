package com.boomerangg.springgroovy.webconsole.config

import org.codehaus.groovy.control.CompilerConfiguration
import org.codehaus.groovy.control.customizers.SecureASTCustomizer
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

@TestConfiguration
open class CompilerTestConfiguration {

    @Bean
    @Primary
    open fun defaultCompilerConfiguration(): CompilerConfiguration {
        val configuration = CompilerConfiguration()
        val secureCustomizer = SecureASTCustomizer()
        secureCustomizer.disallowedReceivers = listOf(System::class.java.name)
        configuration.addCompilationCustomizers(secureCustomizer)

        return configuration
    }
}
