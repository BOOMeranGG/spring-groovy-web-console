package com.boomerangg.springgroovy.webconsole.external

interface GroovyScriptExecutionInterceptor {

    fun onPreExecute(executionId: String, script: String)

    fun onPostExecute(executionId: String, script: String)

    fun onFailed(executionId: String, script: String, ex: Exception)
}
