package com.boomerangg.springgroovy.webconsole.controller

import com.boomerangg.springgroovy.webconsole.dto.ScriptDto
import com.boomerangg.springgroovy.webconsole.dto.ScriptExecutionResultResponse
import com.boomerangg.springgroovy.webconsole.external.GroovyScriptData
import com.boomerangg.springgroovy.webconsole.external.GroovyScriptStorage
import com.boomerangg.springgroovy.webconsole.service.GroovyScriptExecutorService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/console")
internal class GroovyWebConsoleController(
    private val grooveScriptExecutorService: GroovyScriptExecutorService,
    private val scriptsStorages: List<GroovyScriptStorage>,
) {

    @GetMapping("/scripts")
    fun getScripts(): List<GroovyScriptData> {
        return scriptsStorages.flatMap {
            it.getScripts()
        }
    }

    @PostMapping("/groovy")
    fun executeGroovyScript(@RequestBody scriptDto: ScriptDto): ScriptExecutionResultResponse {
        return grooveScriptExecutorService.execute(scriptDto.script)
    }
}
