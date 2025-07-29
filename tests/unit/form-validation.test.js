/**
 * Testes Unitários - Validação de Formulário
 * Testa a lógica de validação do formulário de entrada
 */

// Mock do DOM para testes
const { JSDOM } = require('jsdom');

describe('🧪 Validação de Formulário', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Setup do ambiente DOM para testes
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <form id="location-form">
            <input type="text" id="city" name="city" required>
            <input type="text" id="state" name="state" required>
            <input type="text" id="country" name="country" required>
            <button type="submit" id="submit-btn">Consultar</button>
          </form>
          <div id="loading" style="display: none;"></div>
          <div id="error-message" style="display: none;"></div>
          <div id="results" style="display: none;"></div>
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

  describe('📝 Validação de Campos Obrigatórios', () => {
    test('deve validar que todos os campos são obrigatórios', () => {
      const cityInput = document.getElementById('city');
      const stateInput = document.getElementById('state');
      const countryInput = document.getElementById('country');

      // Simula validação de campos vazios
      cityInput.value = '';
      stateInput.value = '';
      countryInput.value = '';

      const isEmpty = (value) => !value || value.trim() === '';
      
      expect(isEmpty(cityInput.value)).toBe(true);
      expect(isEmpty(stateInput.value)).toBe(true);
      expect(isEmpty(countryInput.value)).toBe(true);
    });

    test('deve aceitar campos preenchidos corretamente', () => {
      const cityInput = document.getElementById('city');
      const stateInput = document.getElementById('state');
      const countryInput = document.getElementById('country');

      cityInput.value = 'São Paulo';
      stateInput.value = 'SP';
      countryInput.value = 'Brasil';

      const isValid = (value) => value && value.trim().length > 0;
      
      expect(isValid(cityInput.value)).toBe(true);
      expect(isValid(stateInput.value)).toBe(true);
      expect(isValid(countryInput.value)).toBe(true);
    });
  });

  describe('🔤 Formatação de Entrada', () => {
    test('deve capitalizar nomes de cidades', () => {
      const capitalizeWords = (str) => {
        return str.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      };

      expect(capitalizeWords('são paulo')).toBe('São Paulo');
      expect(capitalizeWords('belo horizonte')).toBe('Belo Horizonte');
      expect(capitalizeWords('RIO DE JANEIRO')).toBe('Rio De Janeiro');
    });

    test('deve limpar espaços em branco extras', () => {
      const cleanInput = (str) => str.trim().replace(/\s+/g, ' ');

      expect(cleanInput('  São Paulo  ')).toBe('São Paulo');
      expect(cleanInput('Belo   Horizonte')).toBe('Belo Horizonte');
      expect(cleanInput(' SP ')).toBe('SP');
    });
  });

  describe('🚫 Validação de Caracteres Especiais', () => {
    test('deve permitir caracteres válidos para nomes de locais', () => {
      const isValidLocationName = (name) => {
        const validPattern = /^[a-záàâãéèêíïóôõöúçñü\s\-'\.]+$/i;
        return validPattern.test(name);
      };

      expect(isValidLocationName('São Paulo')).toBe(true);
      expect(isValidLocationName('Ribeirão Preto')).toBe(true);
      expect(isValidLocationName("N'Djamena")).toBe(true);
      expect(isValidLocationName('Saint-Étienne')).toBe(true);
    });

    test('deve rejeitar caracteres inválidos', () => {
      const isValidLocationName = (name) => {
        const validPattern = /^[a-záàâãéèêíïóôõöúçñü\s\-'\.]+$/i;
        return validPattern.test(name);
      };

      expect(isValidLocationName('São Paulo123')).toBe(false);
      expect(isValidLocationName('City@Name')).toBe(false);
      expect(isValidLocationName('Test#City')).toBe(false);
    });
  });

  describe('📏 Validação de Comprimento', () => {
    test('deve validar comprimento mínimo dos campos', () => {
      const validateLength = (value, minLength = 2) => {
        return value && value.trim().length >= minLength;
      };

      expect(validateLength('SP', 2)).toBe(true);
      expect(validateLength('S', 2)).toBe(false);
      expect(validateLength('', 2)).toBe(false);
    });

    test('deve validar comprimento máximo dos campos', () => {
      const validateMaxLength = (value, maxLength = 50) => {
        return value && value.trim().length <= maxLength;
      };

      expect(validateMaxLength('São Paulo', 50)).toBe(true);
      expect(validateMaxLength('A'.repeat(51), 50)).toBe(false);
    });
  });

  describe('🌍 Validação de País', () => {
    test('deve aceitar nomes de países válidos', () => {
      const validCountries = [
        'Brasil', 'Argentina', 'Chile', 'Estados Unidos',
        'França', 'Alemanha', 'Reino Unido', 'Japão'
      ];

      const isValidCountry = (country) => {
        const normalized = country.toLowerCase().trim();
        return validCountries.some(valid => 
          valid.toLowerCase() === normalized
        );
      };

      expect(isValidCountry('Brasil')).toBe(true);
      expect(isValidCountry('BRASIL')).toBe(true);
      expect(isValidCountry('brasil')).toBe(true);
      expect(isValidCountry('Estados Unidos')).toBe(true);
    });
  });

  describe('⚠️ Mensagens de Erro', () => {
    test('deve gerar mensagens de erro apropriadas', () => {
      const getErrorMessage = (field, error) => {
        const messages = {
          required: `O campo ${field} é obrigatório`,
          minLength: `O campo ${field} deve ter pelo menos 2 caracteres`,
          maxLength: `O campo ${field} deve ter no máximo 50 caracteres`,
          invalid: `O campo ${field} contém caracteres inválidos`
        };
        return messages[error] || 'Erro de validação';
      };

      expect(getErrorMessage('Cidade', 'required')).toBe('O campo Cidade é obrigatório');
      expect(getErrorMessage('Estado', 'minLength')).toBe('O campo Estado deve ter pelo menos 2 caracteres');
      expect(getErrorMessage('País', 'invalid')).toBe('O campo País contém caracteres inválidos');
    });
  });

  describe('✅ Validação Completa do Formulário', () => {
    test('deve validar formulário completo com dados válidos', () => {
      const validateForm = (data) => {
        const errors = [];
        
        if (!data.city || data.city.trim().length < 2) {
          errors.push('Cidade inválida');
        }
        
        if (!data.state || data.state.trim().length < 2) {
          errors.push('Estado inválido');
        }
        
        if (!data.country || data.country.trim().length < 2) {
          errors.push('País inválido');
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      };

      const validData = {
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil'
      };

      const invalidData = {
        city: '',
        state: 'S',
        country: ''
      };

      expect(validateForm(validData).isValid).toBe(true);
      expect(validateForm(invalidData).isValid).toBe(false);
      expect(validateForm(invalidData).errors.length).toBe(3);
    });
  });
});
