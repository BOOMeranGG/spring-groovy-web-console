package com.boomerangg.springgroovy.webconsole.dto

import org.springframework.util.StringUtils
import java.lang.Exception

internal data class ScriptExecutionResultResponse(
    var result: String? = null,
    var output: MutableList<String> = mutableListOf(),
) {

    internal constructor(result: Any?, output: String) : this(
        result = result.toString(),
        output = if (StringUtils.hasLength(output)) {
            output.split(System.lineSeparator()).toList().filter { it.isNotBlank() }.toMutableList()
        } else mutableListOf()
    )

    internal constructor(exception: Exception) : this(
        result = null,
        output = exception.message?.let { listOf(it) }?.toMutableList() ?: mutableListOf()
    )
}
