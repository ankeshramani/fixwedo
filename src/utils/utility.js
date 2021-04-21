import images from "./ImageHelper";

export const loadExternalScript = scriptData => {
    return new Promise((resolve, reject) => {
        const scriptLoaded = document.getElementById(scriptData.id);
        if (scriptLoaded) {
            resolve(true);
        } else {
            const script = document.createElement("script");
            script.async = true;
            script.src = scriptData.src;
            script.id = scriptData.id;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        }
    });
};

export const sumOfArray = (data) => {
    let total = null
    if(data.length){
        total = data.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
    return total
};

export const getCardImage = (value) =>{
    const newValue = (value || '').replace(/\s+/g, '').trim()
    let visaPattern = /^4[0-9]{6,}$/;
    let mastPattern = /^(?:5[1-5][0-9]{14})$/;
    let amexPattern = /^3[47][0-9]{5,}$/;
    let discoverPattern = /^6(?:011|5[0-9]{2})[0-9]{3,}$/;
    // let jbcPattern = /^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/;
    let dinersClubPattern = /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/;

    let isVisa = visaPattern.test(newValue);
    let isMast = mastPattern.test(newValue);
    let isAmex = amexPattern.test(newValue);
    let isDisc = discoverPattern.test(newValue);
    let isDinersClub = dinersClubPattern.test(newValue);

    if (isVisa) {
        return images.visaCard
    } else if (isMast) {
        return images.mastercard
    } else if (isAmex) {
        return images.americanExpress
    } else if (isDisc) {
        return images.discover
    } else if (isDinersClub) {
        return images.dinersClub
    } else {
        return "";
    }
}