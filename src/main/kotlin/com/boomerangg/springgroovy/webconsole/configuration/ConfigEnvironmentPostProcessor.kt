package com.boomerangg.springgroovy.webconsole.configuration

import org.springframework.boot.SpringApplication
import org.springframework.boot.env.EnvironmentPostProcessor
import org.springframework.boot.env.YamlPropertySourceLoader
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.core.io.ClassPathResource
import java.io.IOException

internal class ConfigEnvironmentPostProcessor : EnvironmentPostProcessor {

    private val propertySourceLoader = YamlPropertySourceLoader()

    override fun postProcessEnvironment(environment: ConfigurableEnvironment, application: SpringApplication) {
        val resource = ClassPathResource("spring-groovy-web-console.yaml")

        try {
            val propertySource = propertySourceLoader.load(resource.filename, resource)
            propertySource.forEach {
                environment.propertySources.addLast(it)
            }
        } catch (ex: IOException) {
            throw IllegalStateException("Unable to load configuration files", ex)
        }
    }
}
