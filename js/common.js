/**
 * Pinoti - Funções Comuns
 * Formatação de inputs e utilitários compartilhados
 */

// Formatação de CPF
function formatCPF(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
}

// Formatação de CNPJ
function formatCNPJ(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 14) {
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    return value;
}

// Formatação de CEP
function formatCEP(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
}

// Formatação de telefone fixo
function formatTelefoneFixo(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
}

// Formatação de telefone celular
function formatTelefoneCelular(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
}

// Aplicar formatadores aos inputs
function applyFormatters(formatters) {
    formatters.forEach(({ ids, formatter }) => {
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', function(e) {
                    e.target.value = formatter(e.target.value);
                });
            }
        });
    });
}

// Detectar se é mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detectar se está no Vercel
function isVercel() {
    return window.location.hostname.includes('vercel.app');
}

// Configurar visibilidade do botão Compartilhar
function setupShareButtonVisibility() {
    const btnCompartilhar = document.querySelector('.btn[onclick*="compartilhar"]');
    if (btnCompartilhar && isVercel() && !isMobile()) {
        btnCompartilhar.style.display = 'none';
    }
}

// Limpar formulário
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.value = '';
        });

        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.checked = false;
        });
        
        // Limpar sessionStorage
        const formId = document.body.dataset.formId || 'form';
        sessionStorage.removeItem(formId + '_data');

        alert('✅ Formulário limpo!');
    }
}

// Salvar dados do formulário automaticamente
function autoSaveForm() {
    const formId = document.body.dataset.formId || 'form';
    const inputs = document.querySelectorAll('input, select, textarea');
    const data = {};
    
    inputs.forEach(input => {
        if (input.id) {
            if (input.type === 'radio' || input.type === 'checkbox') {
                data[input.id] = input.checked;
            } else {
                data[input.id] = input.value;
            }
        }
    });
    
    sessionStorage.setItem(formId + '_data', JSON.stringify(data));
}

// Carregar dados do formulário automaticamente
function autoLoadForm() {
    const formId = document.body.dataset.formId || 'form';
    const savedData = sessionStorage.getItem(formId + '_data');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        input.checked = data[id];
                    } else {
                        input.value = data[id];
                    }
                }
            });
        } catch (e) {
            console.warn('Erro ao carregar dados salvos:', e);
        }
    }
}

// Configurar auto-save
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', autoSaveForm);
        input.addEventListener('change', autoSaveForm);
    });}