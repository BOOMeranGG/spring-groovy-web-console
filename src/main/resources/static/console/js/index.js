const scriptSelector = 'script-selector';

setUpEditors();
loadScripts();

function loadScripts() {
    fetch('/console/scripts')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById(scriptSelector);
            selectElement.innerHTML = '';

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.script;
                option.textContent = item.name;
                selectElement.appendChild(option);
            });
        })
      .catch(error => console.error('Error:', error));
}

document.getElementById(scriptSelector).addEventListener('change', function () {
    editor.setValue(this.value);
});


function sendScript() {
    const script = editor.getValue();
    const url = '/console/groovy?script=' + script;

    fetch('/console/groovy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script: script })
    })
    .then(response => response.json())
    .then(data => {
        responseViewer.setValue(JSON.stringify(data, null, 2))
    })
    .catch(error => console.error('Error:', error));
}
