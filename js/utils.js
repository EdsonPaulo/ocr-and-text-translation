const translateText = async (textToTranslate, fromLang, toLang) => {
    console.log('chamou', textToTranslate, fromLang, toLang);
    if (textToTranslate.length > 5000) {
        textToTranslate = textToTranslate.slice(0, 5000);
    }
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURI(
            textToTranslate
        )}`;
        const res = await (await fetch(url)).json()
        return res[0]?.map?.((item) => item[0]).join("") || '';
    } catch (error) {
        console.log(error)
    }
    return textToTranslate;
}
