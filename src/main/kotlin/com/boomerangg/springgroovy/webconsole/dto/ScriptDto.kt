package com.boomerangg.springgroovy.webconsole.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ScriptDto(
    @param:JsonProperty("script")
    val script: String,
)
