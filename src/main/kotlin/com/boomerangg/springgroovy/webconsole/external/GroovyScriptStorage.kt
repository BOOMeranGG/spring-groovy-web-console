package com.boomerangg.springgroovy.webconsole.external

fun interface GroovyScriptStorage {

    fun getScripts(): List<GroovyScriptData>
}
