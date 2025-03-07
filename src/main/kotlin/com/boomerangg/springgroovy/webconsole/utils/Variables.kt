package com.boomerangg.springgroovy.webconsole.utils

object Variables {

    const val EXAMPLE_SCRIPT_NAME = "Example #1"
    const val EXAMPLE_SCRIPT =  "def environment = applicationContext.getBean(\"environment\")\n" +
            "println \"Application name: \${environment.getProperty('spring.application.name')}\"\n"
}
