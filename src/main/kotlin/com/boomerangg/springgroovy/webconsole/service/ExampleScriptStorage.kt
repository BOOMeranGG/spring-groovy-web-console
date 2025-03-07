package com.boomerangg.springgroovy.webconsole.service

import com.boomerangg.springgroovy.webconsole.external.GroovyScriptData
import com.boomerangg.springgroovy.webconsole.external.GroovyScriptStorage
import com.boomerangg.springgroovy.webconsole.utils.Variables.EXAMPLE_SCRIPT
import com.boomerangg.springgroovy.webconsole.utils.Variables.EXAMPLE_SCRIPT_NAME
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Service

@Service
@ConditionalOnProperty(name = ["groovy-web-console.examples.enabled"], havingValue = "true", matchIfMissing = true)
internal class ExampleScriptStorage : GroovyScriptStorage {

    override fun getScripts(): List<GroovyScriptData> {
        return listOf(
            GroovyScriptData(
                name = EXAMPLE_SCRIPT_NAME,
                script = EXAMPLE_SCRIPT,
            ),
        )
    }
}
