let editor = null;
let responseViewer = null;

function setUpEditors() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' }});
    require(["vs/editor/editor.main"], function() {
        monaco.languages.register({ id: 'groovy' });
        monaco.languages.setMonarchTokensProvider('groovy', {
            keywords: [
                'def', 'class', 'interface', 'enum', 'trait', 'extends', 'implements', 'new',
                'public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized',
                'return', 'void', 'throws', 'super', 'this', 'instanceof', 'if', 'else', 'while',
                'for', 'do', 'switch', 'case', 'break', 'continue', 'default', 'try', 'catch', 'finally',
                'throw', 'import', 'package', 'as', 'assert', 'false', 'true', 'null', 'in', 'use', 'println',
                'byte', 'char', 'double', 'float', 'goto', 'int', 'long', 'short', 'const', 'native', 'strictfp',
                'threadsafe', 'transient', 'volatile'
            ],
            tokenizer: {
                root: [
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }],
                    [/[A-Z][\w\$]*/, 'type.identifier'],
                    { include: '@whitespace' },
                    [/\d+/, 'number'],
                    [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                ],
                comment: [
                    [/\*\//, 'comment', '@pop'],
                    [/./, 'comment']
                ],
                string: [
                    [/[^"]+/, 'string'],
                    [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment']
                ]
            }
        });

        editor = monaco.editor.create(document.getElementById("editor"), {
            value: "// Welcome to the Groovy Web Console!\n// You have access to the Spring application context.\n// Try running: println 'Hello, Groovy!'\n\nprintln 'Hello, World!'",
            language: "groovy",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true
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