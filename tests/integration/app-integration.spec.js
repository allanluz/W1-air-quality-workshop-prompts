/**
 * Testes de Integração - Aplicação Completa
 * Testa o fluxo completo da aplicação usando Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('🧪 Testes de Integração - Aplicação de Qualidade do Ar', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar para a aplicação
    await page.goto('http://localhost:8080/index.html');
  });

  test.describe('📝 Funcionalidade do Formulário', () => {
    test('deve carregar a página corretamente', async ({ page }) => {
      // Verificar elementos principais
      await expect(page.locator('h1')).toContainText('Consulta de Qualidade do Ar');
      await expect(page.locator('#city')).toBeVisible();
      await expect(page.locator('#state')).toBeVisible();
      await expect(page.locator('#country')).toBeVisible();
      await expect(page.locator('#submit-btn')).toBeVisible();
    });

    test('deve validar campos obrigatórios', async ({ page }) => {
      // Tentar enviar formulário vazio
      await page.click('#submit-btn');
      
      // Verificar mensagens de validação HTML5
      const cityInput = page.locator('#city');
      await expect(cityInput).toHaveAttribute('required');
      
      const stateInput = page.locator('#state');
      await expect(stateInput).toHaveAttribute('required');
      
      const countryInput = page.locator('#country');
      await expect(countryInput).toHaveAttribute('required');
    });

    test('deve preencher formulário com dados válidos', async ({ page }) => {
      // Preencher campos
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      
      // Verificar valores preenchidos
      await expect(page.locator('#city')).toHaveValue('São Paulo');
      await expect(page.locator('#state')).toHaveValue('SP');
      await expect(page.locator('#country')).toHaveValue('Brasil');
    });

    test('deve mostrar loading ao enviar formulário', async ({ page }) => {
      // Interceptar chamadas da API para controlar timing
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            lat: '-23.5505',
            lon: '-46.6333',
            display_name: 'São Paulo, Estado de São Paulo, Brasil'
          }])
        });
      });

      // Preencher e enviar formulário
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');
      
      // Verificar que loading aparece
      await expect(page.locator('#loading')).toBeVisible();
      
      // Verificar que botão fica desabilitado
      await expect(page.locator('#submit-btn')).toBeDisabled();
    });
  });

  test.describe('🌐 Integração com APIs', () => {
    test('deve buscar dados de qualidade do ar para São Paulo', async ({ page }) => {
      // Mock das APIs
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            lat: '-23.5505',
            lon: '-46.6333',
            display_name: 'São Paulo, Estado de São Paulo, Brasil'
          }])
        });
      });

      await page.route('**/air-quality-api.open-meteo.com/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
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
          })
        });
      });

      // Preencher e enviar formulário
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      // Aguardar resultados aparecerem
      await expect(page.locator('#results')).toBeVisible();
      
      // Verificar dados de localização
      await expect(page.locator('#location-name')).toContainText('São Paulo');
      await expect(page.locator('#coordinates')).toContainText('Lat: -23.5505');
      
      // Verificar dados de qualidade do ar
      await expect(page.locator('#aqi-value')).toContainText('30');
      await expect(page.locator('#aqi-category')).toContainText('BOM');
    });

    test('deve tratar erro quando localização não é encontrada', async ({ page }) => {
      // Mock da API retornando array vazio
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });

      // Preencher com localização inválida
      await page.fill('#city', 'CidadeInexistente');
      await page.fill('#state', 'XX');
      await page.fill('#country', 'PaísInexistente');
      await page.click('#submit-btn');

      // Verificar mensagem de erro
      await expect(page.locator('#error-message')).toBeVisible();
      await expect(page.locator('#error-message')).toContainText('Localização não encontrada');
      
      // Verificar que resultados não aparecem
      await expect(page.locator('#results')).not.toBeVisible();
    });

    test('deve tratar erro de conexão com API', async ({ page }) => {
      // Mock de erro de rede
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.abort();
      });

      // Preencher e enviar formulário
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      // Verificar mensagem de erro de conexão
      await expect(page.locator('#error-message')).toBeVisible();
      await expect(page.locator('#error-message')).toContainText('Erro de conexão');
    });
  });

  test.describe('🎨 Renderização de Resultados', () => {
    test('deve exibir todos os detalhes dos poluentes', async ({ page }) => {
      // Mock das APIs com dados completos
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            lat: '-23.5505',
            lon: '-46.6333',
            display_name: 'São Paulo, Estado de São Paulo, Brasil'
          }])
        });
      });

      await page.route('**/air-quality-api.open-meteo.com/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            current: {
              time: '2024-01-15T12:00:00Z',
              european_aqi: 45,
              pm10: 25.5,
              pm2_5: 12.8,
              carbon_monoxide: 456.2,
              nitrogen_dioxide: 18.3,
              sulphur_dioxide: 7.1,
              ozone: 78.5
            }
          })
        });
      });

      // Executar busca
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      // Aguardar resultados
      await expect(page.locator('#results')).toBeVisible();

      // Verificar todos os poluentes
      await expect(page.locator('#pm10-value')).toContainText('25.5');
      await expect(page.locator('#pm25-value')).toContainText('12.8');
      await expect(page.locator('#co-value')).toContainText('456.2');
      await expect(page.locator('#no2-value')).toContainText('18.3');
      await expect(page.locator('#so2-value')).toContainText('7.1');
      await expect(page.locator('#o3-value')).toContainText('78.5');
      
      // Verificar unidades
      await expect(page.locator('#pm10-value')).toContainText('μg/m³');
    });

    test('deve mostrar categoria correta baseada no IQA', async ({ page }) => {
      const testCases = [
        { aqi: 15, category: 'MUITO BOM', color: 'rgb(0, 228, 0)' },
        { aqi: 35, category: 'BOM', color: 'rgb(124, 179, 66)' },
        { aqi: 55, category: 'MODERADO', color: 'rgb(255, 167, 38)' },
        { aqi: 75, category: 'RUIM', color: 'rgb(239, 83, 80)' },
        { aqi: 95, category: 'MUITO RUIM', color: 'rgb(171, 71, 188)' }
      ];

      for (const testCase of testCases) {
        // Mock da API com AQI específico
        await page.route('**/nominatim.openstreetmap.org/**', async route => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
              lat: '-23.5505',
              lon: '-46.6333',
              display_name: 'Teste, Estado, País'
            }])
          });
        });

        await page.route('**/air-quality-api.open-meteo.com/**', async route => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              current: {
                time: '2024-01-15T12:00:00Z',
                european_aqi: testCase.aqi,
                pm10: 10,
                pm2_5: 5,
                carbon_monoxide: 200,
                nitrogen_dioxide: 10,
                sulphur_dioxide: 3,
                ozone: 50
              }
            })
          });
        });

        // Executar busca
        await page.fill('#city', 'Cidade Teste');
        await page.fill('#state', 'TS');
        await page.fill('#country', 'País');
        await page.click('#submit-btn');

        // Verificar categoria
        await expect(page.locator('#aqi-category')).toContainText(testCase.category);
        
        // Limpar resultados para próximo teste
        await page.reload();
      }
    });

    test('deve mostrar aviso de saúde apropriado', async ({ page }) => {
      // Mock com IQA alto (RUIM)
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            lat: '-23.5505',
            lon: '-46.6333',
            display_name: 'São Paulo, Estado de São Paulo, Brasil'
          }])
        });
      });

      await page.route('**/air-quality-api.open-meteo.com/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            current: {
              time: '2024-01-15T12:00:00Z',
              european_aqi: 85,
              pm10: 45,
              pm2_5: 25,
              carbon_monoxide: 800,
              nitrogen_dioxide: 60,
              sulphur_dioxide: 15,
              ozone: 120
            }
          })
        });
      });

      // Executar busca
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      // Verificar aviso de saúde
      await expect(page.locator('#health-warning')).toBeVisible();
      await expect(page.locator('#health-warning')).toContainText('efeitos à saúde');
    });
  });

  test.describe('📱 Responsividade', () => {
    test('deve funcionar corretamente em dispositivos móveis', async ({ page }) => {
      // Configurar viewport mobile
      await page.setViewportSize({ width: 375, height: 667 });

      // Mock das APIs
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            lat: '-23.5505',
            lon: '-46.6333',
            display_name: 'São Paulo, Estado de São Paulo, Brasil'
          }])
        });
      });

      await page.route('**/air-quality-api.open-meteo.com/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            current: {
              time: '2024-01-15T12:00:00Z',
              european_aqi: 30,
              pm10: 15,
              pm2_5: 8,
              carbon_monoxide: 230,
              nitrogen_dioxide: 12,
              sulphur_dioxide: 3,
              ozone: 65
            }
          })
        });
      });

      // Verificar que elementos são visíveis em mobile
      await expect(page.locator('#city')).toBeVisible();
      await expect(page.locator('#state')).toBeVisible();
      await expect(page.locator('#country')).toBeVisible();

      // Testar funcionalidade
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      // Verificar resultados em mobile
      await expect(page.locator('#results')).toBeVisible();
      await expect(page.locator('#aqi-value')).toContainText('30');
    });

    test('deve funcionar corretamente em tablets', async ({ page }) => {
      // Configurar viewport tablet
      await page.setViewportSize({ width: 768, height: 1024 });

      // Verificar layout em tablet
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('#submit-btn')).toBeVisible();
      
      // Verificar que o formulário mantém funcionalidade
      await page.fill('#city', 'Florianópolis');
      await page.fill('#state', 'SC');
      await page.fill('#country', 'Brasil');
      
      await expect(page.locator('#city')).toHaveValue('Florianópolis');
    });
  });

  test.describe('🔄 Fluxo Completo de Usuário', () => {
    test('deve completar fluxo de busca múltipla', async ({ page }) => {
      // Configurar mocks
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        const url = route.request().url();
        if (url.includes('S%C3%A3o%20Paulo')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
              lat: '-23.5505',
              lon: '-46.6333',
              display_name: 'São Paulo, Estado de São Paulo, Brasil'
            }])
          });
        } else if (url.includes('Belo%20Horizonte')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
              lat: '-19.9208',
              lon: '-43.9378',
              display_name: 'Belo Horizonte, Minas Gerais, Brasil'
            }])
          });
        }
      });

      await page.route('**/air-quality-api.open-meteo.com/**', async route => {
        const url = route.request().url();
        const aqi = url.includes('-23.5505') ? 30 : 38;
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            current: {
              time: '2024-01-15T12:00:00Z',
              european_aqi: aqi,
              pm10: 15,
              pm2_5: 8,
              carbon_monoxide: 230,
              nitrogen_dioxide: 12,
              sulphur_dioxide: 3,
              ozone: 65
            }
          })
        });
      });

      // Primeira busca: São Paulo
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      await expect(page.locator('#results')).toBeVisible();
      await expect(page.locator('#aqi-value')).toContainText('30');
      await expect(page.locator('#location-name')).toContainText('São Paulo');

      // Segunda busca: Belo Horizonte
      await page.fill('#city', 'Belo Horizonte');
      await page.fill('#state', 'MG');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      await expect(page.locator('#aqi-value')).toContainText('38');
      await expect(page.locator('#location-name')).toContainText('Belo Horizonte');
    });

    test('deve manter estado do formulário após erro', async ({ page }) => {
      // Mock de erro
      await page.route('**/nominatim.openstreetmap.org/**', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      // Preencher formulário
      await page.fill('#city', 'São Paulo');
      await page.fill('#state', 'SP');
      await page.fill('#country', 'Brasil');
      await page.click('#submit-btn');

      // Verificar erro
      await expect(page.locator('#error-message')).toBeVisible();

      // Verificar que campos mantêm valores
      await expect(page.locator('#city')).toHaveValue('São Paulo');
      await expect(page.locator('#state')).toHaveValue('SP');
      await expect(page.locator('#country')).toHaveValue('Brasil');

      // Verificar que botão volta a ficar habilitado
      await expect(page.locator('#submit-btn')).toBeEnabled();
    });
  });

  test.describe('⚡ Performance', () => {
    test('deve carregar página rapidamente', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:8080/index.html');
      const loadTime = Date.now() - startTime;

      // Verificar que página carrega em menos de 2 segundos
      expect(loadTime).toBeLessThan(2000);

      // Verificar que elementos principais estão visíveis
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('form')).toBeVisible();
    });

    test('deve responder rapidamente às interações', async ({ page }) => {
      // Testar responsividade de entrada
      const startTime = Date.now();
      await page.fill('#city', 'São Paulo');
      const fillTime = Date.now() - startTime;

      expect(fillTime).toBeLessThan(100);

      // Testar responsividade de clique
      const clickStart = Date.now();
      await page.click('#submit-btn');
      const clickTime = Date.now() - clickStart;

      expect(clickTime).toBeLessThan(100);
    });
  });
});
