
const inputFile = document.getElementById('input-file-ocr')
const imgForOcr = document.getElementById('img-for-ocr')

const spinner = document.getElementById('loading-spinner')
const errorAlert = document.getElementById('error-alert')

const btnStartOcr = document.getElementById('btn-start-ocr')
const btnGoToTranslator = document.getElementById('btn-goto-translator')
const btnTranslate = document.getElementById('btn-translate')
const btnDownload = document.getElementById('btn-download')

const recognizedText = document.getElementById('ocr-textarea')
const fromLangTextarea = document.getElementById('from-language-textarea')
const toLangTextarea = document.getElementById('to-language-textarea')

const fromLanguageSelect = document.getElementById('from-language-select')
const toLanguageSelect = document.getElementById('to-language-select')

inputFile.onchange = () => {
    let file = inputFile.files[0]
    let imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }))
    imgForOcr.src = imgUrl
    imgForOcr.height = "320"
}

// Start OCR Process
btnStartOcr.onclick = () => {
    if (!inputFile.files[0]) {
        alert('Selecione uma imagem primeiro!')
        return
    }
    recognizedText.innerHTML = ''
    const tesseractInstance = new Tesseract.TesseractWorker()

    tesseractInstance.recognize(inputFile.files[0])
        .progress(() => {
            errorAlert.classList.add("d-none");
            spinner.classList.remove("d-none");
            btnStartOcr.disabled = true;
            btnGoToTranslator.disabled = true;
            btnTranslate.disabled = true;
        })
        .then((data) => {
            if (data?.text) {
                recognizedText.value = data.text
            }
            else {
                errorAlert.classList.remove("d-none");
            }
        })
        .catch(() => {
            errorAlert.classList.remove("d-none");
        }).finally(() => {
            spinner.classList.add("d-none");
            btnStartOcr.disabled = false;
            btnGoToTranslator.disabled = false;
            btnTranslate.disabled = false;
            toLangTextarea.value = ''
            btnDownload.classList.add('d-none')
        })
}

// Go to translator section
btnGoToTranslator.onclick = () => {
    if (!inputFile.files[0] || !recognizedText.value) {
        alert('Selecione uma imagem primeiro e clique em iniciar reconhecimento para capturar o texto na imagem')
        return
    }
    window.location.hash = "tradutor";
    window.scrollTo(0, document.body.scrollHeight);
    fromLangTextarea.value = recognizedText.value
}

// Start translation
btnTranslate.onclick = async () => {
    if (!inputFile.files[0] || !recognizedText.value) {
        alert('Selecione uma imagem primeiro e clique em iniciar reconhecimento')
        return
    }
    toLangTextarea.value = await translateText(fromLangTextarea.value, fromLanguageSelect.value, toLanguageSelect.value);
    btnDownload.classList.remove('d-none')
}

// limit in 5000 char
fromLangTextarea.addEventListener("input", async (e) => {
    if (fromLangTextarea.value.length > 5000) {
        fromLangTextarea.value = fromLangTextarea.value.slice(0, 5000);
    }
    toLangTextarea.value = await translateText(fromLangTextarea.value, fromLanguageSelect.value, toLanguageSelect.value);
});

btnDownload.onclick = async () => {
    if (toLangTextarea.value) {
        const blob = new Blob([toLangTextarea.value], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `traduzido-de-${fromLanguageSelect.value}-para-${toLanguageSelect.value}.txt`;
        a.href = url;
        a.click();
    }
}


toLanguageSelect.onchange = async () => {
    if (fromLangTextarea.value) {
        toLangTextarea.value = await translateText(fromLangTextarea.value, fromLanguageSelect.value, toLanguageSelect.value);
    }
}
