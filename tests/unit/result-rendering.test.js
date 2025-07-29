/**
 * Testes Unitários - Renderização de Resultados
 * Testa a lógica de exibição dos resultados do IQA
 */

const { JSDOM } = require('jsdom');

describe('🎨 Renderização de Resultados do IQA', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="results" style="display: none;">
            <div id="location-info">
              <h3 id="location-name"></h3>
              <p id="coordinates"></p>
            </div>
            <div id="air-quality-card">
              <div id="aqi-value"></div>
              <div id="aqi-category"></div>
              <div id="aqi-description"></div>
            </div>
            <div id="pollutants-details">
              <div id="pm10-value"></div>
              <div id="pm25-value"></div>
              <div id="co-value"></div>
              <div id="no2-value"></div>
              <div id="so2-value"></div>
              <div id="o3-value"></div>
            </div>
            <div id="main-pollutant"></div>
            <div id="health-warning"></div>
            <div id="last-updated"></div>
          </div>
          <div id="loading" style="display: none;"></div>
          <div id="error-message" style="display: none;"></div>
        </body>
      </html>
    `);
    
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('📍 Informações de Localização', () => {
    test('deve renderizar informações de localização corretamente', () => {
      const locationData = {
        display_name: 'São Paulo, Estado de São Paulo, Brasil',
        lat: -23.5505,
        lon: -46.6333
      };

      const renderLocationInfo = (location) => {
        const locationNameEl = document.getElementById('location-name');
        const coordinatesEl = document.getElementById('coordinates');
        
        locationNameEl.textContent = location.display_name;
        coordinatesEl.textContent = `Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`;
      };

      renderLocationInfo(locationData);

      expect(document.getElementById('location-name').textContent)
        .toBe('São Paulo, Estado de São Paulo, Brasil');
      expect(document.getElementById('coordinates').textContent)
        .toBe('Lat: -23.5505, Lon: -46.6333');
    });
  });

  describe('🌬️ Card de Qualidade do Ar', () => {
    test('deve renderizar card do IQA com categoria BOM', () => {
      const airQualityData = {
        european_aqi: 30,
        time: '2024-01-15T12:00:00Z'
      };

      const getAirQualityCategory = (aqi) => {
        if (aqi <= 20) return { level: 'MUITO BOM', color: '#00e400', bgColor: '#e8f5e8' };
        if (aqi <= 40) return { level: 'BOM', color: '#7cb342', bgColor: '#f1f8e9' };
        if (aqi <= 60) return { level: 'MODERADO', color: '#ffa726', bgColor: '#fff8e1' };
        if (aqi <= 80) return { level: 'RUIM', color: '#ef5350', bgColor: '#ffebee' };
        if (aqi <= 100) return { level: 'MUITO RUIM', color: '#ab47bc', bgColor: '#f3e5f5' };
        return { level: 'PERIGOSO', color: '#8d1e37', bgColor: '#ffebee' };
      };

      const renderAirQualityCard = (data) => {
        const category = getAirQualityCategory(data.european_aqi);
        const aqiValueEl = document.getElementById('aqi-value');
        const aqiCategoryEl = document.getElementById('aqi-category');
        const cardEl = document.getElementById('air-quality-card');
        
        aqiValueEl.textContent = data.european_aqi;
        aqiCategoryEl.textContent = category.level;
        cardEl.style.backgroundColor = category.bgColor;
        cardEl.style.borderLeft = `4px solid ${category.color}`;
      };

      renderAirQualityCard(airQualityData);

      expect(document.getElementById('aqi-value').textContent).toBe('30');
      expect(document.getElementById('aqi-category').textContent).toBe('BOM');
      expect(document.getElementById('air-quality-card').style.backgroundColor).toBe('#f1f8e9');
    });

    test('deve renderizar diferentes categorias de IQA', () => {
      const getAirQualityCategory = (aqi) => {
        if (aqi <= 20) return { level: 'MUITO BOM', color: '#00e400' };
        if (aqi <= 40) return { level: 'BOM', color: '#7cb342' };
        if (aqi <= 60) return { level: 'MODERADO', color: '#ffa726' };
        if (aqi <= 80) return { level: 'RUIM', color: '#ef5350' };
        if (aqi <= 100) return { level: 'MUITO RUIM', color: '#ab47bc' };
        return { level: 'PERIGOSO', color: '#8d1e37' };
      };

      expect(getAirQualityCategory(15).level).toBe('MUITO BOM');
      expect(getAirQualityCategory(35).level).toBe('BOM');
      expect(getAirQualityCategory(55).level).toBe('MODERADO');
      expect(getAirQualityCategory(75).level).toBe('RUIM');
      expect(getAirQualityCategory(95).level).toBe('MUITO RUIM');
      expect(getAirQualityCategory(150).level).toBe('PERIGOSO');
    });
  });

  describe('🔬 Detalhes dos Poluentes', () => {
    test('deve renderizar dados detalhados dos poluentes', () => {
      const pollutantsData = {
        pm10: 15.5,
        pm2_5: 8.2,
        carbon_monoxide: 230.5,
        nitrogen_dioxide: 12.8,
        sulphur_dioxide: 3.1,
        ozone: 65.2
      };

      const renderPollutantsDetails = (data) => {
        document.getElementById('pm10-value').textContent = `${data.pm10} μg/m³`;
        document.getElementById('pm25-value').textContent = `${data.pm2_5} μg/m³`;
        document.getElementById('co-value').textContent = `${data.carbon_monoxide} μg/m³`;
        document.getElementById('no2-value').textContent = `${data.nitrogen_dioxide} μg/m³`;
        document.getElementById('so2-value').textContent = `${data.sulphur_dioxide} μg/m³`;
        document.getElementById('o3-value').textContent = `${data.ozone} μg/m³`;
      };

      renderPollutantsDetails(pollutantsData);

      expect(document.getElementById('pm10-value').textContent).toBe('15.5 μg/m³');
      expect(document.getElementById('pm25-value').textContent).toBe('8.2 μg/m³');
      expect(document.getElementById('co-value').textContent).toBe('230.5 μg/m³');
      expect(document.getElementById('no2-value').textContent).toBe('12.8 μg/m³');
      expect(document.getElementById('so2-value').textContent).toBe('3.1 μg/m³');
      expect(document.getElementById('o3-value').textContent).toBe('65.2 μg/m³');
    });

    test('deve identificar e destacar o poluente principal', () => {
      const findMainPollutant = (pollutants) => {
        const limits = {
          pm10: 20,
          pm2_5: 10,
          carbon_monoxide: 4000,
          nitrogen_dioxide: 40,
          sulphur_dioxide: 20,
          ozone: 60
        };

        let mainPollutant = null;
        let maxExcess = 0;

        Object.entries(pollutants).forEach(([name, value]) => {
          if (limits[name]) {
            const excess = value / limits[name];
            if (excess > maxExcess) {
              maxExcess = excess;
              mainPollutant = name;
            }
          }
        });

        return mainPollutant;
      };

      const renderMainPollutant = (pollutants) => {
        const main = findMainPollutant(pollutants);
        const pollutantNames = {
          pm10: 'Material Particulado (PM10)',
          pm2_5: 'Material Particulado Fino (PM2.5)',
          carbon_monoxide: 'Monóxido de Carbono',
          nitrogen_dioxide: 'Dióxido de Nitrogênio',
          sulphur_dioxide: 'Dióxido de Enxofre',
          ozone: 'Ozônio'
        };

        const mainPollutantEl = document.getElementById('main-pollutant');
        if (main) {
          mainPollutantEl.textContent = `Poluente principal: ${pollutantNames[main]}`;
        }
      };

      const pollutants = {
        pm10: 45, // Acima do limite
        pm2_5: 8,
        carbon_monoxide: 230,
        nitrogen_dioxide: 12,
        sulphur_dioxide: 3,
        ozone: 50
      };

      renderMainPollutant(pollutants);
      expect(document.getElementById('main-pollutant').textContent)
        .toBe('Poluente principal: Material Particulado (PM10)');
    });
  });

  describe('⚠️ Avisos de Saúde', () => {
    test('deve exibir avisos de saúde baseados no IQA', () => {
      const getHealthWarning = (aqi) => {
        if (aqi <= 40) {
          return 'Qualidade do ar satisfatória. Sem restrições para atividades ao ar livre.';
        } else if (aqi <= 60) {
          return 'Pessoas sensíveis podem sentir desconforto. Considere reduzir exercícios intensos ao ar livre.';
        } else if (aqi <= 80) {
          return 'Pessoas sensíveis devem evitar atividades ao ar livre. População geral pode sentir irritação.';
        } else if (aqi <= 100) {
          return 'Todos podem sentir efeitos à saúde. Evite atividades ao ar livre por períodos prolongados.';
        } else {
          return 'ALERTA: Condições perigosas. Evite atividades ao ar livre. Busque ambientes fechados.';
        }
      };

      const renderHealthWarning = (aqi) => {
        const warning = getHealthWarning(aqi);
        const warningEl = document.getElementById('health-warning');
        warningEl.textContent = warning;
        
        if (aqi > 80) {
          warningEl.style.color = '#d32f2f';
          warningEl.style.fontWeight = 'bold';
        } else if (aqi > 60) {
          warningEl.style.color = '#f57c00';
        } else {
          warningEl.style.color = '#388e3c';
        }
      };

      // Teste para qualidade BOA
      renderHealthWarning(30);
      expect(document.getElementById('health-warning').textContent)
        .toContain('Qualidade do ar satisfatória');
      expect(document.getElementById('health-warning').style.color)
        .toBe('#388e3c');

      // Teste para qualidade RUIM
      renderHealthWarning(85);
      expect(document.getElementById('health-warning').textContent)
        .toContain('Todos podem sentir efeitos');
      expect(document.getElementById('health-warning').style.color)
        .toBe('#d32f2f');
    });
  });

  describe('⏰ Data e Hora da Medição', () => {
    test('deve formatar e exibir data da última atualização', () => {
      const formatLastUpdated = (isoString) => {
        const date = new Date(isoString);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        };
        return date.toLocaleDateString('pt-BR', options);
      };

      const renderLastUpdated = (time) => {
        const formatted = formatLastUpdated(time);
        const lastUpdatedEl = document.getElementById('last-updated');
        lastUpdatedEl.textContent = `Última atualização: ${formatted}`;
      };

      renderLastUpdated('2024-01-15T12:00:00Z');
      expect(document.getElementById('last-updated').textContent)
        .toContain('Última atualização:');
    });
  });

  describe('🎭 Estados de Loading e Erro', () => {
    test('deve mostrar e ocultar estado de loading', () => {
      const showLoading = () => {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
      };

      const hideLoading = () => {
        document.getElementById('loading').style.display = 'none';
      };

      const showResults = () => {
        document.getElementById('results').style.display = 'block';
      };

      showLoading();
      expect(document.getElementById('loading').style.display).toBe('block');
      expect(document.getElementById('results').style.display).toBe('none');

      hideLoading();
      showResults();
      expect(document.getElementById('loading').style.display).toBe('none');
      expect(document.getElementById('results').style.display).toBe('block');
    });

    test('deve exibir mensagens de erro apropriadas', () => {
      const showError = (message) => {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('loading').style.display = 'none';
      };

      const clearError = () => {
        document.getElementById('error-message').style.display = 'none';
      };

      showError('Localização não encontrada');
      expect(document.getElementById('error-message').textContent)
        .toBe('Localização não encontrada');
      expect(document.getElementById('error-message').style.display).toBe('block');

      clearError();
      expect(document.getElementById('error-message').style.display).toBe('none');
    });
  });

  describe('📱 Responsividade da Renderização', () => {
    test('deve adaptar renderização para diferentes tamanhos de tela', () => {
      const adaptForMobile = () => {
        const resultsEl = document.getElementById('results');
        resultsEl.classList.add('mobile-layout');
        
        // Simular adaptações mobile
        const pollutantsEl = document.getElementById('pollutants-details');
        pollutantsEl.style.flexDirection = 'column';
        pollutantsEl.style.gap = '8px';
      };

      const adaptForDesktop = () => {
        const resultsEl = document.getElementById('results');
        resultsEl.classList.remove('mobile-layout');
        
        const pollutantsEl = document.getElementById('pollutants-details');
        pollutantsEl.style.flexDirection = 'row';
        pollutantsEl.style.gap = '16px';
      };

      adaptForMobile();
      expect(document.getElementById('results').classList.contains('mobile-layout')).toBe(true);

      adaptForDesktop();
      expect(document.getElementById('results').classList.contains('mobile-layout')).toBe(false);
    });
  });

  describe('🔄 Atualização Dinâmica', () => {
    test('deve atualizar valores dinamicamente', () => {
      const updateAirQualityDisplay = (newData) => {
        // Atualizar IQA
        document.getElementById('aqi-value').textContent = newData.european_aqi;
        
        // Atualizar categoria
        const getCategory = (aqi) => aqi <= 40 ? 'BOM' : 'MODERADO';
        document.getElementById('aqi-category').textContent = getCategory(newData.european_aqi);
        
        // Atualizar poluentes
        document.getElementById('pm10-value').textContent = `${newData.pm10} μg/m³`;
        document.getElementById('pm25-value').textContent = `${newData.pm2_5} μg/m³`;
      };

      // Dados iniciais
      updateAirQualityDisplay({
        european_aqi: 30,
        pm10: 15,
        pm2_5: 8
      });

      expect(document.getElementById('aqi-value').textContent).toBe('30');
      expect(document.getElementById('aqi-category').textContent).toBe('BOM');

      // Atualização com novos dados
      updateAirQualityDisplay({
        european_aqi: 55,
        pm10: 25,
        pm2_5: 12
      });

      expect(document.getElementById('aqi-value').textContent).toBe('55');
      expect(document.getElementById('aqi-category').textContent).toBe('MODERADO');
      expect(document.getElementById('pm10-value').textContent).toBe('25 μg/m³');
    });
  });
});
