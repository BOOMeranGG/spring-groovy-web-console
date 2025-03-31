package com.boomerangg.springgroovy.webconsole.external

interface GroovyScriptExecutionInterceptor {

    fun onPreExecute(scriptId: String, script: String)

    fun onPostExecute(scriptId: String, script: String)

    fun onFailed(scriptId: String, script: String, ex: Exception)
}
