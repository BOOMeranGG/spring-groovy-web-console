package com.boomerangg.springgroovy.webconsole.service

import com.boomerangg.springgroovy.webconsole.external.GroovyScriptExecutionInterceptor
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*

@Service
internal class InterceptorsExecutor(
    private val interceptors: List<GroovyScriptExecutionInterceptor>,
) {

    fun callOnPreExecute(executionId: UUID, script: String) {
        interceptors.forEach { interceptor ->
            try {
                interceptor.onPreExecute(executionId.toString(), script)
            } catch (ex: Exception) {
                LOGGER.error("Error while calling onPreExecute, interceptor: ${interceptor::class.java}", ex)
            }
        }
    }

    fun callOnPostExecute(executionId: UUID, script: String) {
        interceptors.forEach { interceptor ->
            try {
                interceptor.onPostExecute(executionId.toString(), script)
            } catch (ex: Exception) {
                LOGGER.error("Error while calling onPostExecute, interceptor: ${interceptor::class.java}", ex)
            }
        }
    }

    fun callOnFailed(executionId: UUID, script: String, ex: Exception) {
        interceptors.forEach { interceptor ->
            try {
                interceptor.onFailed(executionId.toString(), script, ex)
            } catch (ex: Exception) {
                LOGGER.error("Error while calling onFailed, interceptor: ${interceptor::class.java}", ex)
            }
        }
    }

    companion object {
        private val LOGGER = LoggerFactory.getLogger(InterceptorsExecutor::class.java)
    }
}
