package com.boomerangg.springgroovy.webconsole.configuration

import org.codehaus.groovy.control.CompilerConfiguration
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan

@AutoConfiguration
@ConditionalOnProperty(name = ["groovy-web-console.enabled"], havingValue = "true", matchIfMissing = true)
@ComponentScan("com.boomerangg.springgroovy.webconsole")
internal open class SpringGroovyWebConsoleAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    fun defaultCompilerConfiguration(): CompilerConfiguration {
        return CompilerConfiguration()
    }
}
