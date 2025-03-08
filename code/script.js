function showView(view) {
    const views = ['html', 'css', 'js'];
    views.forEach(v => {
        const viewElement = document.getElementById(`${v}View`);
        const button = document.getElementById(`${v}Btn`);
        if (v === view) {
            viewElement.style.display = 'block';
            button.style.backgroundColor = 'var(--accent)';
        } else {
            viewElement.style.display = 'none';
            button.style.backgroundColor = 'var(--dark2)';
        }
    });
}
function minifyHtml() {
    let html = document.getElementById('inputHtml').value;
    let minifiedHtml = html.replace(/\n/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    document.getElementById('html-output').value = minifiedHtml;
    updateStats('html', html, minifiedHtml);
}
function minifyCSS() {
    const input = document.getElementById('css-input').value;
    let minified = input.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*([\{\}\:\;\,])\s*/g, '$1').trim();
    document.getElementById('css-output').value = minified;
    updateStats('css', input, minified);
}
function minifyJS() {
    const input = document.getElementById('js-input').value;
    let minified = input.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*([{}();,+\-*/=<>!&|])\s*/g, '$1').trim();
    document.getElementById('js-output').value = minified;
    updateStats('js', input, minified);
}
function updateStats(type, original, minified) {
    const originalSize = original.length;
    const minifiedSize = minified.length;
    const ratio = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    document.getElementById(`${type}-original-size`).textContent = originalSize;
    document.getElementById(`${type}-minified-size`).textContent = minifiedSize;
    document.getElementById(`${type}-compression-ratio`).textContent = ratio;
}
function copyToClipboard(type) {
    const output = document.getElementById(`${type}-output`);
    if (output) {
        navigator.clipboard.writeText(output.value).then(() => {
            showMessage();
        }).catch(err => {
            console.error('Error copying to clipboard: ', err);
            alert('Failed to copy to clipboard.');
        });
    } else {
        console.error(`Output element with ID ${type}-output not found.`);
        alert(`Failed to copy: No output for ${type} found.`);
    }
}
function showMessage() {
    const message = document.getElementById('message');
    message.style.display = 'block';
    setTimeout(() => message.style.display = 'none', 2000);
}
function openRenameDialog(type) {
    const dialog = document.getElementById('renameDialog');
    const fileNameInput = document.getElementById('fileName');
    dialog.style.display = 'flex';
    fileNameInput.focus();
    dialog.setAttribute('data-type', type);
}
function downloadWithName() {
    const dialog = document.getElementById('renameDialog');
    const fileNameInput = document.getElementById('fileName');
    const fileName = fileNameInput.value.trim();
    if (!fileName) {
        alert("Please provide a file name.");
        return;
    }
    const type = dialog.getAttribute('data-type');
    const content = document.getElementById(`${type}-output`).value;
    const blob = new Blob([content], { type: type === 'css' ? 'text/css' : (type === 'html' ? 'text/html' : 'application/javascript') });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dialog.style.display = 'none';
    fileNameInput.value = '';
}
showView('html');