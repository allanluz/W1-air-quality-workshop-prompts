/**
 * Testes Unitários - API Service
 * Testa a lógica de integração com APIs externas
 */

// Mocks para fetch API
global.fetch = jest.fn();

describe('🌐 API Service - Testes Unitários', () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('📍 Nominatim Geocoding API', () => {
    test('deve buscar coordenadas para localização válida', async () => {
      const mockGeocodingResponse = [
        {
          lat: '-23.5505',
          lon: '-46.6333',
          display_name: 'São Paulo, Estado de São Paulo, Brasil',
          address: {
            city: 'São Paulo',
            state: 'São Paulo',
            country: 'Brasil'
          }
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeocodingResponse
      });

      const geocodeLocation = async (city, state, country) => {
        const query = `${city}, ${state}, ${country}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro na geocodificação');
        }
        
        const data = await response.json();
        if (data.length === 0) {
          throw new Error('Localização não encontrada');
        }
        
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      };

      const result = await geocodeLocation('São Paulo', 'SP', 'Brasil');
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result.lat).toBe(-23.5505);
      expect(result.lon).toBe(-46.6333);
      expect(result.display_name).toContain('São Paulo');
    });

    test('deve tratar erro quando localização não é encontrada', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      const geocodeLocation = async (city, state, country) => {
        const query = `${city}, ${state}, ${country}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.length === 0) {
          throw new Error('Localização não encontrada');
        }
        
        return data[0];
      };

      await expect(geocodeLocation('CidadeInexistente', 'XX', 'PaísInexistente'))
        .rejects.toThrow('Localização não encontrada');
    });

    test('deve tratar erro de rede na API de geocodificação', async () => {
      fetch.mockRejectedValueOnce(new Error('Erro de rede'));

      const geocodeLocation = async (city, state, country) => {
        const query = `${city}, ${state}, ${country}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        
        try {
          const response = await fetch(url);
          return await response.json();
        } catch (error) {
          throw new Error('Erro de conexão com o serviço de geocodificação');
        }
      };

      await expect(geocodeLocation('São Paulo', 'SP', 'Brasil'))
        .rejects.toThrow('Erro de conexão com o serviço de geocodificação');
    });
  });

  describe('🌬️ Open-Meteo Air Quality API', () => {
    test('deve buscar dados de qualidade do ar para coordenadas válidas', async () => {
      const mockAirQualityResponse = {
        current: {
          time: '2024-01-15T12:00:00Z',
          european_aqi: 30,
          pm10: 15.5,
          pm2_5: 8.2,
          carbon_monoxide: 230.5,
          nitrogen_dioxide: 12.8,
          sulphur_dioxide: 3.1,
          ozone: 65.2
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAirQualityResponse
      });

      const getAirQuality = async (lat, lon) => {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao obter dados de qualidade do ar');
        }
        
        return await response.json();
      };

      const result = await getAirQuality(-23.5505, -46.6333);
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result.current.european_aqi).toBe(30);
      expect(result.current.pm10).toBe(15.5);
      expect(result.current.pm2_5).toBe(8.2);
    });

    test('deve tratar erro de API da qualidade do ar', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const getAirQuality = async (lat, lon) => {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao obter dados de qualidade do ar');
        }
        
        return await response.json();
      };

      await expect(getAirQuality(-23.5505, -46.6333))
        .rejects.toThrow('Erro ao obter dados de qualidade do ar');
    });
  });

  describe('🔗 Integração Completa das APIs', () => {
    test('deve executar fluxo completo de busca', async () => {
      // Mock para geocodificação
      const mockGeocodingResponse = [
        {
          lat: '-23.5505',
          lon: '-46.6333',
          display_name: 'São Paulo, Estado de São Paulo, Brasil'
        }
      ];

      // Mock para qualidade do ar
      const mockAirQualityResponse = {
        current: {
          time: '2024-01-15T12:00:00Z',
          european_aqi: 30,
          pm10: 15.5,
          pm2_5: 8.2,
          carbon_monoxide: 230.5,
          nitrogen_dioxide: 12.8,
          sulphur_dioxide: 3.1,
          ozone: 65.2
        }
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeocodingResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAirQualityResponse
        });

      const searchAirQuality = async (city, state, country) => {
        // 1. Geocodificação
        const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}, ${state}, ${country}&limit=1`);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.length === 0) {
          throw new Error('Localização não encontrada');
        }
        
        const { lat, lon } = geocodeData[0];
        
        // 2. Busca da qualidade do ar
        const airQualityResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`);
        const airQualityData = await airQualityResponse.json();
        
        return {
          location: {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            display_name: geocodeData[0].display_name
          },
          airQuality: airQualityData.current
        };
      };

      const result = await searchAirQuality('São Paulo', 'SP', 'Brasil');
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result.location.lat).toBe(-23.5505);
      expect(result.airQuality.european_aqi).toBe(30);
    });
  });

  describe('🎯 Classificação do IQA', () => {
    test('deve classificar corretamente os níveis de qualidade do ar', () => {
      const getAirQualityCategory = (aqi) => {
        if (aqi <= 20) return { level: 'MUITO BOM', color: '#00e400', description: 'Qualidade do ar excelente' };
        if (aqi <= 40) return { level: 'BOM', color: '#ffff00', description: 'Qualidade do ar boa' };
        if (aqi <= 60) return { level: 'MODERADO', color: '#ff7e00', description: 'Qualidade do ar moderada' };
        if (aqi <= 80) return { level: 'RUIM', color: '#ff0000', description: 'Qualidade do ar ruim' };
        if (aqi <= 100) return { level: 'MUITO RUIM', color: '#8f3f97', description: 'Qualidade do ar muito ruim' };
        return { level: 'PERIGOSO', color: '#7e0023', description: 'Qualidade do ar perigosa' };
      };

      expect(getAirQualityCategory(15).level).toBe('MUITO BOM');
      expect(getAirQualityCategory(30).level).toBe('BOM');
      expect(getAirQualityCategory(50).level).toBe('MODERADO');
      expect(getAirQualityCategory(70).level).toBe('RUIM');
      expect(getAirQualityCategory(90).level).toBe('MUITO RUIM');
      expect(getAirQualityCategory(120).level).toBe('PERIGOSO');
    });

    test('deve identificar poluente principal', () => {
      const findMainPollutant = (pollutants) => {
        const thresholds = {
          pm10: { good: 20, moderate: 50, poor: 100 },
          pm2_5: { good: 10, moderate: 25, poor: 50 },
          ozone: { good: 60, moderate: 120, poor: 180 },
          nitrogen_dioxide: { good: 40, moderate: 80, poor: 180 },
          sulphur_dioxide: { good: 20, moderate: 80, poor: 250 },
          carbon_monoxide: { good: 4000, moderate: 8000, poor: 15000 }
        };

        let mainPollutant = null;
        let maxRatio = 0;

        for (const [pollutant, value] of Object.entries(pollutants)) {
          if (thresholds[pollutant] && value > 0) {
            const ratio = value / thresholds[pollutant].good;
            if (ratio > maxRatio) {
              maxRatio = ratio;
              mainPollutant = pollutant;
            }
          }
        }

        return mainPollutant;
      };

      const pollutants1 = {
        pm10: 25,
        pm2_5: 8,
        ozone: 45,
        nitrogen_dioxide: 15,
        sulphur_dioxide: 5,
        carbon_monoxide: 2000
      };

      expect(findMainPollutant(pollutants1)).toBe('pm10');
    });
  });

  describe('⏱️ Timeout e Retry', () => {
    test('deve implementar timeout para chamadas de API', async () => {
      const fetchWithTimeout = async (url, options = {}) => {
        const { timeout = 5000 } = options;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error('Timeout na requisição');
          }
          throw error;
        }
      };

      // Simula timeout
      fetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 6000))
      );

      await expect(fetchWithTimeout('https://api.example.com', { timeout: 1000 }))
        .rejects.toThrow('Timeout na requisição');
    });

    test('deve implementar retry automático', async () => {
      let attempts = 0;
      
      fetch.mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Erro temporário'));
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true })
        });
      });

      const fetchWithRetry = async (url, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            const response = await fetch(url);
            return response;
          } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      };

      const response = await fetchWithRetry('https://api.example.com');
      expect(attempts).toBe(3);
      expect(response.ok).toBe(true);
    });
  });
});
