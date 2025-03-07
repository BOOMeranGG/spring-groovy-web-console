package com.boomerangg.springgroovy.webconsole.external

interface GroovyScriptExecutionInterceptor {

    fun onPreExecute(scriptUuid: String, script: String)

    fun onPostExecute(scriptUuid: String, script: String)

    fun onFailed(scriptUuid: String, script: String, ex: Exception)
}
