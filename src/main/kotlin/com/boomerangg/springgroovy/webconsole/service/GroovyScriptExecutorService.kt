package com.boomerangg.springgroovy.webconsole.service

import com.boomerangg.springgroovy.webconsole.dto.ScriptExecutionResultResponse
import groovy.lang.Binding
import groovy.lang.GroovyShell
import org.codehaus.groovy.control.CompilerConfiguration
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.io.PrintStream
import java.util.*

@Service
internal class GroovyScriptExecutorService(
    private val interceptorsExecutor: InterceptorsExecutor,
    private val compilerConfiguration: CompilerConfiguration,
) : ApplicationContextAware {

    private lateinit var applicationContext: ApplicationContext

    override fun setApplicationContext(applicationContext: ApplicationContext) {
        this.applicationContext = applicationContext
    }

    fun execute(groovyScript: String): ScriptExecutionResultResponse {
        val executionUuid = UUID.randomUUID()
        interceptorsExecutor.callOnPreExecute(executionUuid, groovyScript)

        return try {
            val out = ByteArrayOutputStream()
            val groovyShell = createGroovyShell(out)
            val result = groovyShell.evaluate(groovyScript)

            interceptorsExecutor.callOnPostExecute(executionUuid, groovyScript)
            ScriptExecutionResultResponse(result, out.toString())
        } catch (ex: Exception) {
            interceptorsExecutor.callOnFailed(executionUuid, groovyScript, ex)
            ScriptExecutionResultResponse(ex)
        }
    }

    private fun createGroovyShell(outputStream: OutputStream): GroovyShell {
        val binding = createBinding(outputStream)
        return GroovyShell(binding, compilerConfiguration)
    }

    private fun createBinding(outputStream: OutputStream): Binding {
        val binding = Binding()
        binding.setVariable("applicationContext", applicationContext)
        binding.setProperty("out", PrintStream(outputStream, true))
        return binding
    }
}
