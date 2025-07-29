// Elementos do DOM
const form = document.getElementById('locationForm');
const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const countryInput = document.getElementById('country');
const resultDiv = document.getElementById('result');
const locationDisplay = document.getElementById('locationDisplay');
const submitBtn = document.querySelector('.submit-btn');

// APIs Configuration
const APIS = {
    nominatim: 'https://nominatim.openstreetmap.org/search',
    openMeteo: 'https://air-quality-api.open-meteo.com/v1/air-quality'
};

// Air Quality Index levels and health messages
const AQI_LEVELS = {
    1: { level: 'Bom', color: '#00e400', message: 'Qualidade do ar satisfatória para a maioria das pessoas.' },
    2: { level: 'Moderado', color: '#ffff00', message: 'Pessoas sensíveis podem experimentar sintomas menores.' },
    3: { level: 'Insalubre para Grupos Sensíveis', color: '#ff7e00', message: 'Grupos sensíveis podem experimentar efeitos na saúde.' },
    4: { level: 'Insalubre', color: '#ff0000', message: 'Todos podem começar a experimentar efeitos na saúde.' },
    5: { level: 'Muito Insalubre', color: '#8f3f97', message: 'Condições de emergência. População em geral mais propensa a ser afetada.' },
    6: { level: 'Perigoso', color: '#7e0023', message: 'Alerta de saúde: todos podem experimentar efeitos graves na saúde.' }
};

// Pollutant information
const POLLUTANTS = {
    pm10: { name: 'MP10', unit: 'µg/m³', description: 'Material particulado menor que 10 micrômetros' },
    pm2_5: { name: 'MP2.5', unit: 'µg/m³', description: 'Material particulado menor que 2.5 micrômetros' },
    carbon_monoxide: { name: 'CO', unit: 'µg/m³', description: 'Monóxido de carbono' },
    nitrogen_dioxide: { name: 'NO₂', unit: 'µg/m³', description: 'Dióxido de nitrogênio' },
    sulphur_dioxide: { name: 'SO₂', unit: 'µg/m³', description: 'Dióxido de enxofre' },
    ozone: { name: 'O₃', unit: 'µg/m³', description: 'Ozônio' }
};

// Configurações de validação
const validationRules = {
    city: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s\-'\.]+$/
    },
    state: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s\-'\.]+$/
    },
    country: {
        required: false,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s\-'\.]+$/
    }
};

// Mensagens de erro
const errorMessages = {
    required: 'Este campo é obrigatório',
    minLength: 'Deve ter pelo menos {min} caracteres',
    maxLength: 'Deve ter no máximo {max} caracteres',
    pattern: 'Formato inválido. Use apenas letras, espaços, hífens e apostrofes',
    locationNotFound: 'Localização não encontrada. Verifique os dados inseridos.',
    apiError: 'Erro ao buscar dados. Tente novamente em alguns instantes.',
    networkError: 'Erro de conexão. Verifique sua internet e tente novamente.'
};

// Utility Functions
class APIService {
    static async geocodeLocation(city, state, country) {
        const query = `${city}, ${state}, ${country}`;
        const url = `${APIS.nominatim}?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.length === 0) {
                throw new Error('Location not found');
            }
            
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    }
    
    static async getAirQuality(latitude, longitude) {
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            current: 'european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
            timezone: 'auto'
        });
        
        const url = `${APIS.openMeteo}?${params}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Air quality API error:', error);
            throw error;
        }
    }
}

// UI Helper Functions
class UIHelpers {
    static setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Buscando...';
            submitBtn.classList.add('loading');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Consultar Qualidade do Ar';
            submitBtn.classList.remove('loading');
        }
    }
    
    static showError(message) {
        resultDiv.innerHTML = `
            <div class="error-container">
                <h3>❌ Erro</h3>
                <p>${message}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
    
    static formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    static getMainPollutant(airQualityData) {
        const current = airQualityData.current;
        const pollutantValues = {
            pm10: current.pm10 || 0,
            pm2_5: current.pm2_5 || 0,
            carbon_monoxide: current.carbon_monoxide || 0,
            nitrogen_dioxide: current.nitrogen_dioxide || 0,
            sulphur_dioxide: current.sulphur_dioxide || 0,
            ozone: current.ozone || 0
        };
        
        // Find pollutant with highest concentration relative to WHO guidelines
        const relativeValues = {
            pm10: pollutantValues.pm10 / 50, // WHO guideline: 50 µg/m³
            pm2_5: pollutantValues.pm2_5 / 25, // WHO guideline: 25 µg/m³
            carbon_monoxide: pollutantValues.carbon_monoxide / 10000, // WHO guideline: 10mg/m³
            nitrogen_dioxide: pollutantValues.nitrogen_dioxide / 40, // WHO guideline: 40 µg/m³
            sulphur_dioxide: pollutantValues.sulphur_dioxide / 40, // WHO guideline: 40 µg/m³
            ozone: pollutantValues.ozone / 100 // WHO guideline: 100 µg/m³
        };
        
        const mainPollutant = Object.keys(relativeValues).reduce((a, b) => 
            relativeValues[a] > relativeValues[b] ? a : b
        );
        
        return {
            pollutant: mainPollutant,
            value: pollutantValues[mainPollutant],
            info: POLLUTANTS[mainPollutant]
        };
    }
    
    static displayAirQualityResults(locationData, airQualityData) {
        const aqi = airQualityData.current.european_aqi || 1;
        const aqiInfo = AQI_LEVELS[aqi] || AQI_LEVELS[1];
        const mainPollutant = this.getMainPollutant(airQualityData);
        const timestamp = airQualityData.current.time;
        
        resultDiv.innerHTML = `
            <div class="air-quality-results">
                <div class="location-info">
                    <h3>📍 Localização</h3>
                    <p>${locationData.displayName}</p>
                    <p class="coordinates">Lat: ${locationData.lat.toFixed(4)}, Lon: ${locationData.lon.toFixed(4)}</p>
                </div>
                
                <div class="aqi-main" style="border-left-color: ${aqiInfo.color}">
                    <h3>🌬️ Índice de Qualidade do Ar</h3>
                    <div class="aqi-value" style="background-color: ${aqiInfo.color}">
                        <span class="aqi-number">${aqi}</span>
                        <span class="aqi-level">${aqiInfo.level}</span>
                    </div>
                    <p class="health-message">${aqiInfo.message}</p>
                </div>
                
                <div class="main-pollutant">
                    <h4>🔴 Poluente Principal</h4>
                    <p><strong>${mainPollutant.info.name}:</strong> ${mainPollutant.value.toFixed(1)} ${mainPollutant.info.unit}</p>
                    <p class="pollutant-desc">${mainPollutant.info.description}</p>
                </div>
                
                <div class="pollutants-grid">
                    <h4>📊 Detalhes dos Poluentes</h4>
                    <div class="pollutants-list">
                        ${this.generatePollutantsList(airQualityData.current)}
                    </div>
                </div>
                
                <div class="measurement-time">
                    <p><strong>⏰ Última medição:</strong> ${this.formatDateTime(timestamp)}</p>
                </div>
            </div>
        `;
        
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    static generatePollutantsList(currentData) {
        return Object.keys(POLLUTANTS).map(key => {
            const value = currentData[key];
            const pollutant = POLLUTANTS[key];
            if (value !== undefined && value !== null) {
                return `
                    <div class="pollutant-item">
                        <span class="pollutant-name">${pollutant.name}</span>
                        <span class="pollutant-value">${value.toFixed(1)} ${pollutant.unit}</span>
                    </div>
                `;
            }
            return '';
        }).filter(item => item !== '').join('');
    }
}

// Função para validar um campo específico
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const errors = [];

    // Verificar se é obrigatório
    if (rules.required && (!value || value.trim() === '')) {
        errors.push(errorMessages.required);
        return errors;
    }

    // Se não é obrigatório e está vazio, não validar outros critérios
    if (!rules.required && (!value || value.trim() === '')) {
        return errors;
    }

    // Verificar comprimento mínimo
    if (rules.minLength && value.trim().length < rules.minLength) {
        errors.push(errorMessages.minLength.replace('{min}', rules.minLength));
    }

    // Verificar comprimento máximo
    if (rules.maxLength && value.trim().length > rules.maxLength) {
        errors.push(errorMessages.maxLength.replace('{max}', rules.maxLength));
    }

    // Verificar padrão
    if (rules.pattern && !rules.pattern.test(value.trim())) {
        errors.push(errorMessages.pattern);
    }

    return errors;
}

// Função para mostrar erro
function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    const formGroup = inputElement.parentElement;

    errorElement.textContent = message;
    errorElement.classList.add('show');
    inputElement.classList.add('error');
    formGroup.classList.remove('valid');
}

// Função para limpar erro
function clearError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    const formGroup = inputElement.parentElement;

    errorElement.textContent = '';
    errorElement.classList.remove('show');
    inputElement.classList.remove('error');
    
    // Se o campo tem valor válido, marcar como válido
    const value = inputElement.value.trim();
    const errors = validateField(fieldName, value);
    if (errors.length === 0 && (value !== '' || !validationRules[fieldName].required)) {
        formGroup.classList.add('valid');
    }
}

// Função para validar todos os campos
function validateForm() {
    let isValid = true;
    const fields = ['city', 'state', 'country'];

    fields.forEach(fieldName => {
        const input = document.getElementById(fieldName);
        const value = input.value.trim();
        const errors = validateField(fieldName, value);

        if (errors.length > 0) {
            showError(fieldName, errors[0]);
            isValid = false;
        } else {
            clearError(fieldName);
        }
    });

    return isValid;
}

// Validação em tempo real
function setupRealTimeValidation() {
    const fields = ['city', 'state', 'country'];

    fields.forEach(fieldName => {
        const input = document.getElementById(fieldName);
        
        // Validar enquanto digita (com debounce)
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const errors = validateField(fieldName, this.value);
                if (errors.length > 0) {
                    showError(fieldName, errors[0]);
                } else {
                    clearError(fieldName);
                }
            }, 300);
        });

        // Validar quando sai do campo
        input.addEventListener('blur', function() {
            const errors = validateField(fieldName, this.value);
            if (errors.length > 0) {
                showError(fieldName, errors[0]);
            } else {
                clearError(fieldName);
            }
        });
    });
}

// Função para limpar o formulário
function clearForm() {
    form.reset();
    countryInput.value = 'Estados Unidos'; // Resetar valor padrão
    
    // Limpar todos os erros
    ['city', 'state', 'country'].forEach(fieldName => {
        clearError(fieldName);
        const formGroup = document.getElementById(fieldName).parentElement;
        formGroup.classList.remove('valid');
    });
    
    // Esconder resultado e resetar estado do botão
    resultDiv.style.display = 'none';
    UIHelpers.setLoadingState(false);
    
    // Focar no primeiro campo
    cityInput.focus();
}

// Função principal para processar o envio do formulário
async function handleFormSubmit(event) {
    event.preventDefault();

    // Validar formulário
    if (!validateForm()) {
        return;
    }

    // Obter valores
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();
    const country = countryInput.value.trim() || 'Estados Unidos';

    // Mostrar estado de carregamento
    UIHelpers.setLoadingState(true);
    resultDiv.style.display = 'none';

    try {
        // 1. Geocodificar localização
        console.log('Geocoding location:', { city, state, country });
        const locationData = await APIService.geocodeLocation(city, state, country);
        console.log('Location found:', locationData);

        // 2. Buscar dados de qualidade do ar
        console.log('Fetching air quality data for:', locationData.lat, locationData.lon);
        const airQualityData = await APIService.getAirQuality(locationData.lat, locationData.lon);
        console.log('Air quality data:', airQualityData);

        // 3. Exibir resultados
        UIHelpers.displayAirQualityResults(locationData, airQualityData);

    } catch (error) {
        console.error('Error in form submission:', error);
        
        // Determinar tipo de erro e mostrar mensagem apropriada
        let errorMessage = errorMessages.apiError;
        
        if (error.message === 'Location not found' || error.message.includes('location')) {
            errorMessage = errorMessages.locationNotFound;
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
            errorMessage = errorMessages.networkError;
        }
        
        UIHelpers.showError(errorMessage);
    } finally {
        // Restaurar estado do botão
        UIHelpers.setLoadingState(false);
    }
}

// Função para capitalizar primeira letra de cada palavra
function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar valor padrão do país
    countryInput.value = 'Estados Unidos';
    
    // Configurar validação em tempo real
    setupRealTimeValidation();
    
    // Configurar envio do formulário
    form.addEventListener('submit', handleFormSubmit);
    
    // Focar no primeiro campo
    cityInput.focus();
    
    // Adicionar atalhos de teclado
    document.addEventListener('keydown', function(event) {
        // ESC para limpar formulário
        if (event.key === 'Escape') {
            clearForm();
        }
    });
    
    // Adicionar formatação automática nos campos
    cityInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            this.value = capitalizeWords(this.value.trim());
        }
    });

    stateInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            this.value = capitalizeWords(this.value.trim());
        }
    });

    countryInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            this.value = capitalizeWords(this.value.trim());
        }
    });
});
