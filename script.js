// script.js

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const convertButton = document.getElementById('convertButton');
    const resultDiv = document.getElementById('result');
    const languageSelect = document.getElementById('language');
    const themeSelect = document.getElementById('theme');

    const translations = {
        en: {
            title: "Currency Converter",
            amountLabel: "Amount:",
            fromLabel: "From:",
            toLabel: "To:",
            convertButton: "Convert",
            placeholderAmount: "Enter amount",
            errorInvalidAmount: "Please enter a valid amount.",
            errorFetchRates: "Failed to fetch exchange rates. Please try again later.",
            errorConversion: "Conversion error. Please try again later.",
        },
        tr: {
            title: "Döviz Çevirici",
            amountLabel: "Tutar:",
            fromLabel: "Kimden:",
            toLabel: "Kime:",
            convertButton: "Çevir",
            placeholderAmount: "Tutarı girin",
            errorInvalidAmount: "Lütfen geçerli bir tutar girin.",
            errorFetchRates: "Döviz kurları alınamadı. Lütfen daha sonra tekrar deneyin.",
            errorConversion: "Dönüştürme hatası. Lütfen daha sonra tekrar deneyin.",
        },
    };

    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

    function applyTranslations(language) {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });

        amountInput.placeholder = translations[language].placeholderAmount;
    }

    async function fetchExchangeRates() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            populateCurrencyOptions(data.rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            resultDiv.textContent = translations[languageSelect.value].errorFetchRates;
        }
    }

    function populateCurrencyOptions(rates) {
        const currencies = Object.keys(rates);
        currencies.forEach(currency => {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            fromCurrencySelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;
            toCurrencySelect.appendChild(optionTo);
        });
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
    }

    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            resultDiv.textContent = translations[languageSelect.value].errorInvalidAmount;
            return;
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const rate = data.rates[toCurrency] / data.rates[fromCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } catch (error) {
            console.error('Error during conversion:', error);
            resultDiv.textContent = translations[languageSelect.value].errorConversion;
        }
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            document.querySelector('.converter').classList.add('dark');
        } else {
            document.body.classList.remove('dark');
            document.querySelector('.converter').classList.remove('dark');
        }
    }

    convertButton.addEventListener('click', convertCurrency);
    languageSelect.addEventListener('change', (event) => {
        applyTranslations(event.target.value);
    });
    themeSelect.addEventListener('change', (event) => {
        applyTheme(event.target.value);
    });

    fetchExchangeRates();
    applyTranslations(languageSelect.value);
    applyTheme(themeSelect.value);
});
