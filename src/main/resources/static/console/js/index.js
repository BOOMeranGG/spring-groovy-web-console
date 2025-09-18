const scriptSelector = 'script-selector';

setUpEditors();
loadScripts();
setupKeyboardShortcuts();

function loadScripts() {
    fetch('/console/scripts')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById(scriptSelector);
            selectElement.innerHTML = '<option value="" selected="selected">Choose an example...</option>';

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.script;
                option.textContent = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading scripts:', error);
            showNotification('Failed to load example scripts', 'error');
        });
}

document.getElementById(scriptSelector).addEventListener('change', function () {
    if (this.value) {
        editor.setValue(this.value);
        showNotification('Example script loaded', 'success');
    }
});

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl+Enter or Cmd+Enter to execute
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            sendScript();
        }
        // Escape to clear results
        if (event.key === 'Escape') {
            clearResults();
        }
    });
}

function sendScript() {
    const script = editor.getValue();
    
    if (!script.trim()) {
        showNotification('Please enter a script to execute', 'warning');
        updateStatus('Ready');
        return;
    }

    const executeButton = document.getElementById('execute-button');
    const loadingOverlay = createLoadingOverlay();
    
    // Show loading state
    executeButton.disabled = true;
    executeButton.classList.add('loading');
    document.querySelector('main').appendChild(loadingOverlay);
    updateStatus('Executing...', 'executing');

    fetch('/console/groovy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script: script })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        responseViewer.setValue(JSON.stringify(data, null, 2));
        showNotification('Script executed successfully', 'success');
        updateStatus('Success', 'success');
    })
    .catch(error => {
        console.error('Error executing script:', error);
        responseViewer.setValue(JSON.stringify({
            error: 'Failed to execute script',
            message: error.message
        }, null, 2));
        showNotification('Failed to execute script', 'error');
        updateStatus('Error', 'error');
    })
    .finally(() => {
        // Hide loading state
        executeButton.disabled = false;
        executeButton.classList.remove('loading');
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
    });
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    return overlay;
}

function clearResults() {
    responseViewer.setValue('{\n  "message": "Execute a script to see results here"\n}');
    updateStatus('Ready');
    showNotification('Results cleared', 'info');
}

function clearEditor() {
    editor.setValue('');
    updateStatus('Ready');
    showNotification('Editor cleared', 'info');
}

function updateStatus(message, type = 'default') {
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
        statusIndicator.textContent = message;
        statusIndicator.className = 'status-indicator' + (type !== 'default' ? ` ${type}` : '');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#00d4aa',
        error: '#ff6b6b',
        warning: '#ffa726',
        info: '#42a5f5'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
