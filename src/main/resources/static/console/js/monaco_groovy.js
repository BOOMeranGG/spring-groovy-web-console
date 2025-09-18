let editor = null;
let responseViewer = null;

function setUpEditors() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' }});
    require(["vs/editor/editor.main"], function() {
        monaco.languages.register({ id: 'groovy' });
        
        // Language configuration for better editing experience
        monaco.languages.setLanguageConfiguration('groovy', {
            comments: {
                lineComment: '//',
                blockComment: ['/*', '*/']
            },
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')']
            ],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"', notIn: ['string'] },
                { open: "'", close: "'", notIn: ['string', 'comment'] },
                { open: '"""', close: '"""' },
                { open: "'''", close: "'''" }
            ],
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" },
                { open: '"""', close: '"""' },
                { open: "'''", close: "'''" }
            ],
            indentationRules: {
                increaseIndentPattern: /^.*\{[^}]*$/,
                decreaseIndentPattern: /^.*\}.*$/
            },
            folding: {
                markers: {
                    start: new RegExp("^\\s*//\\s*#?region\\b"),
                    end: new RegExp("^\\s*//\\s*#?endregion\\b")
                }
            }
        });
        monaco.languages.setMonarchTokensProvider('groovy', {
            keywords: [
                'def', 'class', 'interface', 'enum', 'trait', 'extends', 'implements', 'new',
                'public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized',
                'return', 'void', 'throws', 'super', 'this', 'instanceof', 'if', 'else', 'while',
                'for', 'do', 'switch', 'case', 'break', 'continue', 'default', 'try', 'catch', 'finally',
                'throw', 'import', 'package', 'as', 'assert', 'false', 'true', 'null', 'in', 'use',
                'byte', 'char', 'double', 'float', 'goto', 'int', 'long', 'short', 'const', 'native', 'strictfp',
                'threadsafe', 'transient', 'volatile',
                // Groovy-specific keywords
                'it', 'with', 'collect', 'each', 'eachWithIndex', 'find', 'findAll', 'any', 'every',
                'inject', 'sort', 'reverse', 'unique', 'flatten', 'transpose', 'join', 'split',
                'matches', 'replace', 'replaceAll', 'substring', 'toLowerCase', 'toUpperCase',
                'println', 'print', 'printf', 'sprintf'
            ],
            
            typeKeywords: [
                'String', 'Integer', 'Double', 'Float', 'Long', 'Short', 'Byte', 'Boolean', 'Character',
                'BigDecimal', 'BigInteger', 'Date', 'List', 'Map', 'Set', 'Collection', 'Closure',
                'Object', 'Class', 'Exception', 'RuntimeException', 'Throwable'
            ],
            
            operators: [
                '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
                '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
                '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
                '%=', '<<=', '>>=', '>>>=',
                // Groovy-specific operators
                '?.', '?:', '<=>', '**', '=~', '==~', '.&', '*.', '?.'
            ],
            
            symbols: /[=><!~?:&|+\-*\/\^%]+/,
            
            tokenizer: {
                root: [
                    // Identifiers and keywords
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            '@typeKeywords': 'type',
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }],
                    [/[A-Z][\w\$]*/, 'type.identifier'],
                    
                    // Annotations
                    [/@[a-zA-Z_]\w*/, 'annotation'],
                    
                    // Numbers
                    [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
                    [/0[xX][0-9a-fA-F]+[Ll]?/, 'number.hex'],
                    [/0[0-7]+[Ll]?/, 'number.octal'],
                    [/0[bB][01]+[Ll]?/, 'number.binary'],
                    [/\d+[lLgG]?/, 'number'],
                    [/\d+[eE][\-+]?\d+[fFdD]?/, 'number.float'],
                    
                    // Closure parameters
                    [/\|[^|]*\|/, 'keyword.control'],
                    
                    // Delimiters and operators
                    [/[{}()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': ''
                        }
                    }],
                    
                    // Whitespace
                    { include: '@whitespace' },
                    
                    // Strings
                    [/"""/, { token: 'string.quote', bracket: '@open', next: '@multistring' }],
                    [/'''/, { token: 'string.quote', bracket: '@open', next: '@multistring_single' }],
                    [/"/, { token: 'string.quote', bracket: '@open', next: '@gstring' }],
                    [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],
                    
                    // Regular expressions
                    [/\/(?=([^\/\\\n]|\\.)+\/)/, { token: 'regexp.quote', bracket: '@open', next: '@regexp' }],
                    
                    // Characters
                    [/'[^\\']'/, 'string'],
                    [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                    [/'/, 'string.invalid']
                ],
                
                // Multi-line strings with triple quotes
                multistring: [
                    [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
                    [/\$[a-zA-Z_]\w*/, 'variable'],
                    [/[^"$\\]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"""/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
                    [/./, 'string']
                ],
                
                multistring_single: [
                    [/[^'\\]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/'''/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
                    [/./, 'string']
                ],
                
                // GString (interpolated string)
                gstring: [
                    [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
                    [/\$[a-zA-Z_]\w*/, 'variable'],
                    [/[^"$\\]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                
                // Single quoted string
                string_single: [
                    [/[^'\\]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                
                // Regular expression
                regexp: [
                    [/[^\/\\]+/, 'regexp'],
                    [/@escapes/, 'regexp.escape'],
                    [/\\./, 'regexp.escape.invalid'],
                    [/\/[gimuy]*/, { token: 'regexp.quote', bracket: '@close', next: '@pop' }]
                ],
                
                // Bracket counting for string interpolation
                bracketCounting: [
                    [/\{/, 'delimiter.bracket', '@bracketCounting'],
                    [/\}/, 'delimiter.bracket', '@pop'],
                    { include: 'root' }
                ],
                
                comment: [
                    [/\*\//, 'comment', '@pop'],
                    [/./, 'comment']
                ],
                
                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment']
                ]
            },
            
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
        });
        
        // Completion provider for better IntelliSense
        monaco.languages.registerCompletionItemProvider('groovy', {
            provideCompletionItems: function(model, position) {
                var suggestions = [
                    // Groovy built-in methods
                    {
                        label: 'println',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'println ${1:message}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Print a line to the console'
                    },
                    {
                        label: 'print',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'print ${1:message}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Print to the console without newline'
                    },
                    {
                        label: 'each',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'each { ${1:it} ->\n\t${2:// code}\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Iterate over collection elements'
                    },
                    {
                        label: 'collect',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'collect { ${1:it} -> ${2:return value} }',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Transform collection elements'
                    },
                    {
                        label: 'findAll',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'findAll { ${1:it} -> ${2:condition} }',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Filter collection elements'
                    },
                    {
                        label: 'find',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'find { ${1:it} -> ${2:condition} }',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Find first matching element'
                    },
                    {
                        label: 'any',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'any { ${1:it} -> ${2:condition} }',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Check if any element matches condition'
                    },
                    {
                        label: 'every',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'every { ${1:it} -> ${2:condition} }',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Check if all elements match condition'
                    },
                    // Spring-specific completions
                    {
                        label: 'applicationContext',
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: 'applicationContext',
                        documentation: 'Access to Spring Application Context'
                    },
                    {
                        label: 'getBean',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'applicationContext.getBean("${1:beanName}")',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Get Spring bean by name'
                    },
                    {
                        label: 'getBeanByType',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'applicationContext.getBean(${1:BeanClass}.class)',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Get Spring bean by type'
                    },
                    {
                        label: 'environment',
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: 'applicationContext.getBean("environment")',
                        documentation: 'Access to Spring Environment'
                    },
                    {
                        label: 'getProperty',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'environment.getProperty("${1:property.name}")',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Get environment property value'
                    },
                    // Groovy closures and syntax
                    {
                        label: 'closure',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '{ ${1:parameters} ->\n\t${2:// closure body}\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Groovy closure'
                    },
                    {
                        label: 'with',
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: 'with(${1:object}) {\n\t${2:// code block}\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Execute code block with object as delegate'
                    },
                    // String interpolation
                    {
                        label: 'gstring',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '"${${1:variable}}"',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Groovy string interpolation'
                    }
                ];
                
                return { suggestions: suggestions };
            }
        });

        editor = monaco.editor.create(document.getElementById("editor"), {
            value: "// Welcome to the Enhanced Groovy Web Console!\n// You have access to the Spring application context.\n// Enhanced syntax highlighting for Groovy features:\n\n// String interpolation (GString)\ndef name = 'Groovy'\nprintln \"Hello, ${name}!\"\n\n// Closures and collection methods\ndef numbers = [1, 2, 3, 4, 5]\nnumbers.each { println it * 2 }\n\n// Access Spring context\ndef env = applicationContext.getBean('environment')\nprintln \"App name: ${env.getProperty('spring.application.name')}\"",
            language: "groovy",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
                other: true,
                comments: false,
                strings: false
            }
        });

        responseViewer = monaco.editor.create(document.getElementById('response-viewer'), {
            value: "{\n  \"message\": \"Execute a script to see results here\"\n}",
            language: 'json',
            theme: 'vs-dark',
            readOnly: true,
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on'
        });
    });
}

window.setUpEditors = setUpEditors