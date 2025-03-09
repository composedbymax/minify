const tabs = document.querySelectorAll('.tab');
const inputTextarea = document.getElementById('input');
const outputTextarea = document.getElementById('output');
const minifyBtn = document.getElementById('minify-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const notification = document.getElementById('notification');
const inputSizeEl = document.getElementById('input-size');
const outputSizeEl = document.getElementById('output-size');
const originalSizeEl = document.getElementById('original-size');
const minifiedSizeEl = document.getElementById('minified-size');
const savedSizeEl = document.getElementById('saved-size');
const reductionPercentageEl = document.getElementById('reduction-percentage');
let currentTab = 'html';
const minifyFunctions = {
    html: function(input) {
    return input
        .replace(/\n/g, ' ')
        .replace(/[\t ]+/g, ' ')
        .replace(/> </g, '><')
        .replace(/ +</g, '<')
        .replace(/> +/g, '>')
        .replace(/<!--.*?-->/g, '')
        .trim();
    },
    css: function(input) {
    return input
        .replace(/\/\*.*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/;}/g, '}')
        .trim();
    },
    js: function(input) {
    return input
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*.*?\*\//gs, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*\*\s*/g, '*')
        .replace(/\s*\/\s*/g, '/')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .trim();
    }
};
const fileExtensions = {
    html: '.html',
    css: '.css',
    js: '.js'
};
function updateFileSizes() {
    const inputSize = new Blob([inputTextarea.value]).size;
    const outputSize = new Blob([outputTextarea.value]).size;
    inputSizeEl.textContent = formatSize(inputSize);
    outputSizeEl.textContent = formatSize(outputSize);
    originalSizeEl.textContent = inputSize;
    minifiedSizeEl.textContent = outputSize;
    const savedSize = Math.max(0, inputSize - outputSize);
    savedSizeEl.textContent = savedSize;
    const reductionPercentage = inputSize === 0 ? 0 : Math.round((savedSize / inputSize) * 100);
    reductionPercentageEl.textContent = `${reductionPercentage}%`;
}
function formatSize(bytes) {
    if (bytes === 0) return '0 bytes';
    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function minifyCode() {
    const input = inputTextarea.value;
    if (!input.trim()) {
    return;
    }
    const minified = minifyFunctions[currentTab](input);
    outputTextarea.value = minified;
    updateFileSizes();
    document.querySelectorAll('.stat-box').forEach(box => {
    box.classList.remove('pulse');
    setTimeout(() => box.classList.add('pulse'), 10);
    });
}
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
    notification.classList.remove('show');
    }, 2000);
}
function copyToClipboard() {
    if (!outputTextarea.value) return;
    outputTextarea.select();
    document.execCommand('copy');
    showNotification('Copied to clipboard!');
}
function downloadOutput() {
    if (!outputTextarea.value) return;
    const blob = new Blob([outputTextarea.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minified${fileExtensions[currentTab]}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    }, 0);
    showNotification('File downloaded!');
}
function clearAll() {
    inputTextarea.value = '';
    outputTextarea.value = '';
    updateFileSizes();
}
function switchTab(tab) {
    currentTab = tab;
    tabs.forEach(t => {
    if (t.dataset.tab === tab) {
        t.classList.add('active');
    } else {
        t.classList.remove('active');
    }
    });
    clearAll();
}
inputTextarea.addEventListener('input', () => {
    inputSizeEl.textContent = formatSize(new Blob([inputTextarea.value]).size);
});
minifyBtn.addEventListener('click', minifyCode);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadOutput);
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
    });
});
updateFileSizes();