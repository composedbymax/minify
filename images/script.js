document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const previewContainer = document.getElementById('previewContainer');
    const fileDetails = document.getElementById('fileDetails');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileDimensions = document.getElementById('fileDimensions');
    const formatSelect = document.getElementById('formatSelect');
    const qualitySlider = document.getElementById('qualitySlider');
    const scaleSlider = document.getElementById('scaleSlider');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    const previewInfo = document.getElementById('previewInfo');
    const previewFormat = document.getElementById('previewFormat');
    const previewSize = document.getElementById('previewSize');
    const qualityLevel = document.getElementById('qualityLevel');
    const newDimensions = document.getElementById('newDimensions');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeFullscreen = document.getElementById('closeFullscreen');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const resetZoom = document.getElementById('resetZoom');
    let originalImage = null;
    let currentBlob = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let processingTimeout = null;
    let currentZoom = 1;
    document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', function() {
        this.nextElementSibling.textContent = this.value + '%';
    });
    });
    let isProcessing = false;
    function debounceProcessing() {
    if (isProcessing) return;
    if (processingTimeout) {
        clearTimeout(processingTimeout);
    }
    processingTimeout = setTimeout(() => {
        processImage();
    }, 800);
    }
    qualitySlider.addEventListener('input', debounceProcessing);
    scaleSlider.addEventListener('input', debounceProcessing);
    formatSelect.addEventListener('change', debounceProcessing);
    uploadArea.addEventListener('click', () => {
    imageInput.click();
    });
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
    }
    ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('active');
    }, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('active');
    }, false);
    });
    uploadArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
        handleFileUpload(files[0]);
    }
    }, false);
    imageInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileUpload(e.target.files[0]);
    }
    });
    function handleFileUpload(file) {
    if (!file.type.match('image.*')) {
        showError('Please upload an image file.');
        return;
    }
    hideError();
    showLoading();
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
        originalWidth = img.width;
        originalHeight = img.height;
        originalImage = img;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileDimensions.textContent = `${originalWidth} × ${originalHeight}`;
        fileDetails.style.display = 'block';
        formatSelect.disabled = false;
        qualitySlider.disabled = false;
        scaleSlider.disabled = false;
        const extension = file.name.split('.').pop().toLowerCase();
        if (['jpeg', 'jpg', 'png', 'webp'].includes(extension)) {
            const format = extension === 'jpg' ? 'jpeg' : extension;
            formatSelect.value = format;
        }
        processImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    }
    function processImage() {
    if (!originalImage) return;
    showLoading();
    isProcessing = true;
    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;
    const scale = scaleSlider.value / 100;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const newWidth = Math.round(originalWidth * scale);
    const newHeight = Math.round(originalHeight * scale);
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    canvas.toBlob(
        (blob) => {
        if (!blob) {
            showError('Failed to process image.');
            hideLoading();
            isProcessing = false;
            return;
        }
        currentBlob = blob;
        const objectUrl = URL.createObjectURL(blob);
        previewImage.onload = function() {
            hideLoading();
            isProcessing = false;
            previewImage.style.display = 'block';
            fullscreenBtn.style.display = 'block';
            document.querySelector('.placeholder-text').style.display = 'none';
            downloadBtn.disabled = false;
            previewFormat.textContent = format.toUpperCase();
            previewSize.textContent = formatFileSize(blob.size);
            qualityLevel.textContent = qualitySlider.value + '%';
            newDimensions.textContent = `${newWidth} × ${newHeight}`;
            previewInfo.style.display = 'block';
        };
        previewImage.src = objectUrl;
        },
        'image/' + format,
        quality
    );
    }
    previewImage.addEventListener('click', openFullscreen);
    fullscreenBtn.addEventListener('click', openFullscreen);
    function openFullscreen() {
    if (!currentBlob) return;
    fullscreenImage.src = previewImage.src;
    fullscreenOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetImageZoom();
    }
    closeFullscreen.addEventListener('click', () => {
    fullscreenOverlay.style.display = 'none';
    document.body.style.overflow = '';
    });
    fullscreenOverlay.addEventListener('click', (e) => {
    if (e.target === fullscreenOverlay) {
        fullscreenOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    });
    document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenOverlay.style.display === 'flex') {
        fullscreenOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    });
    zoomIn.addEventListener('click', () => {
    currentZoom *= 1.2;
    applyZoom();
    });
    zoomOut.addEventListener('click', () => {
    currentZoom /= 1.2;
    if (currentZoom < 0.1) currentZoom = 0.1;
    applyZoom();
    });
    resetZoom.addEventListener('click', resetImageZoom);
    function resetImageZoom() {
    currentZoom = 1;
    applyZoom();
    }
    function applyZoom() {
    fullscreenImage.style.transform = `scale(${currentZoom})`;
    fullscreenImage.style.transition = 'transform 0.2s ease';
    }
    downloadBtn.addEventListener('click', () => {
    if (!currentBlob) return;
    const format = formatSelect.value;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(currentBlob);
    const originalName = fileName.textContent.split('.')[0] || 'image';
    a.download = `${originalName}_converted.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    });
    function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    }
    function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    }
    function hideError() {
    errorMessage.style.display = 'none';
    }
    function showLoading() {
    loading.style.display = 'block';
    }
    function hideLoading() {
    loading.style.display = 'none';
    }
});