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
// Detectar se é localhost (IPv4/IPv6)
function isLocalhost() {
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '::1';
}

// Preencher dados de exemplo apenas em localhost e apenas se não houver dados salvos
function fillSampleDataIfLocalhost() {
    if (!isLocalhost()) return;
    const formId = document.body.dataset.formId || 'form';
    try {
        if (localStorage.getItem(formId + '_data')) return; // não sobrepor dados salvos
    } catch (e) {}

    const samples = {
        'anexo-I': {
            valorAluguel: '2.500,00',
            taxaAdm: '8',
            taxaLocacao: '8',
            tipoImovel: 'Apartamento',
            cep: '01000-000',
            endereco: 'Rua Exemplo, 100',
            numero: '100',
            complemento: 'Apto 101',
            bairro: 'Centro',
            cidade: 'Cidade Ex',
            estado: 'SP',

            nome: 'Fulano de Tal',
            cpf: '123.456.789-09',
            chavePix: 'fulano@pix',
            banco: 'Banco Exemplo',
            agencia: '1234',
            conta: '567890',
            operacao: '01',
            titular: 'Fulano de Tal',
            cpfTitular: '123.456.789-09',
            email: 'fulano@example.com',
            telefoneFixo: '(11) 3333-4444',
            telefoneCelular: '(11) 98888-7777',

            nomeMae: 'Maria de Tal',
            nomePai: 'Joao de Tal',
            rg: '12.345.678-9',
            orgaoExpedidor: 'SSP',
            dataExpedicao: '2005-08-15',
            sexo: 'masculino',
            nascimento: '1985-05-20',
            estadoCivil: 'solteiro',
            nacionalidade: 'Brasileiro',
            naturalidade: 'Cidade Ex',

            enderecoProprietario: 'Rua Exemplo, 100',
            numeroProprietario: '100',
            complementoProprietario: 'Apto 101',
            bairroProprietario: 'Centro',
            cidadeProprietario: 'Cidade Ex',
            estadoProprietario: 'SP',

            dataCaptacao: '2025-01-01',
            prazoLocacao: '12',
            administradora: 'Admin Exemplos',
            edificio: 'Edifício Ex',
            valorCondominio: '300,00',
            percentualOutroProprietario: '0%'
        },
        'anexo-II': {
            nomeLocatario: 'Beltrano Silva',
            cpfLocatario: '987.654.321-00',
            emailLocatario: 'beltrano@example.com',
            telefoneFixoLocatario: '(11) 2222-3333',
            telefoneCelularLocatario: '(11) 97777-6666',
            nomeMaeLocatario: 'Mae Exemplo',
            nomePaiLocatario: 'Pai Exemplo',
            rgLocatario: '12.345.678-9',
            orgaoExpedidorLocatario: 'SSP',
            dataExpedicaoLocatario: '2006-06-10',
            sexoLocatario: 'masculino',
            nascimentoLocatario: '1990-02-14',
            estadoCivilLocatario: 'casado',
            nacionalidadeLocatario: 'Brasileiro',
            naturalidadeLocatario: 'Cidade Ex',
            enderecoLocatario: 'Av. Teste, 200',
            bairroLocatario: 'Bairro Teste',
            estadoLocatario: 'SP',

            nomeConjuge: 'Conjuge Silva',
            cpfConjuge: '111.222.333-44',
            emailConjuge: 'conjuge@example.com',
            telefoneFixoConjuge: '(11) 4444-5555',
            telefoneCelularConjuge: '(11) 96666-5555',
            nomeMaeConjuge: 'Mae Conjuge',
            nomePaiConjuge: 'Pai Conjuge',
            rgConjuge: '98.765.432-1',
            orgaoExpedidorConjuge: 'SSP',
            dataExpedicaoConjuge: '2008-09-01',
            sexoConjuge: 'feminino',
            nascimentoConjuge: '1992-07-07',
            estadoCivilConjuge: 'casado',
            nacionalidadeConjuge: 'Brasileira',
            naturalidadeConjuge: 'Cidade Ex',

            nomeEmpresa: 'Empresa Exemplo',
            cnpjEmpresa: '12.345.678/0001-99',
            profissao: 'Analista',
            ramoAtividade: 'Serviços',
            rendaMensal: 'R$ 5.000,00',
            telefoneEmpresa: '(11) 95555-4444',
            enderecoEmpresa: 'Rua Empresa, 50',

            nomeEmpresaConjuge: 'Empresa Conjuge',
            cnpjEmpresaConjuge: '98.765.432/0001-11',
            profissaoConjuge: 'Gerente',
            ramoAtividadeConjuge: 'Comércio',
            rendaMensalConjuge: 'R$ 4.000,00',
            telefoneEmpresaConjuge: '(11) 93333-2222',
            enderecoEmpresaConjuge: 'Av. Conjuge, 10'
        }
    };

    const map = samples[formId];
    if (!map) return;

    Object.keys(map).forEach(id => {
        try {
            const el = document.getElementById(id);
            if (!el) return;
            const val = map[id];
            const tag = el.tagName && el.tagName.toLowerCase();
            if (tag === 'select') {
                // tentar selecionar por value
                try { el.value = val; } catch (e) { el.selectedIndex = -1; }
            } else if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = !!val;
            } else {
                el.value = val;
            }
        } catch (e) {}
    });
}
function limparFormulario() {
    const elements = document.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'select') {
            try { el.selectedIndex = -1; } catch (e) { el.value = ''; }
        } else if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
        } else {
            el.value = '';
        }
    });

    // Disparar eventos para atualizar listeners (auto-save ou outros)
    elements.forEach(el => {
        try {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {}
    });

    // Remover spans criados para PDF caso ainda existam
    try { document.querySelectorAll('.pdf-text-replacement').forEach(n => n.remove()); } catch (e) {}

    // Limpar armazenamento salvo (localStorage é usado pelo autoSave)
    const formId = document.body.dataset.formId || 'form';
    try { localStorage.removeItem(formId + '_data'); } catch (e) {}
    try { sessionStorage.removeItem(formId + '_data'); } catch (e) {}
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
    
    localStorage.setItem(formId + '_data', JSON.stringify(data));
    console.log('Auto saved data:', data);
}

// Carregar dados do formulário automaticamente
function autoLoadForm() {
    const formId = document.body.dataset.formId || 'form';
    const savedData = localStorage.getItem(formId + '_data');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            console.log('Loading data:', data);
            Object.keys(data).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        input.checked = data[id];
                    } else {
                        input.value = data[id];
                        console.log('Set', id, 'to', data[id]);
                    }
                }
            });
        } catch (e) {
            console.warn('Erro ao carregar dados salvos:', e);
        }
    } else {
        console.log('No saved data for', formId);
    }
}

// Configurar auto-save
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', autoSaveForm);
        input.addEventListener('change', autoSaveForm);
    });}