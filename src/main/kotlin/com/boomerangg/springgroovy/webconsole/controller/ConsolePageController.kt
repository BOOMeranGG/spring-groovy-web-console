package com.boomerangg.springgroovy.webconsole.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

private const val INDEX_HTML_PATH = "console/index.html"

@Controller
@RequestMapping("\${groovy-web-console.api.web-console-page.prefix}")
class ConsolePageController {

    @GetMapping
    fun getConsoleWebPage(): String {
        return INDEX_HTML_PATH
    }
}
