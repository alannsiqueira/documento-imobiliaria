/**
 * Pinoti - Anexo I (Proprietário)
 * Lógica específica do formulário de proprietário
 */

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Identificar formulário
    document.body.dataset.formId = 'anexo-I';
    
    // Carregar dados salvos
    autoLoadForm();
    // Preencher dados de exemplo em localhost se não houver dados salvos
    try { fillSampleDataIfLocalhost(); } catch (e) {}
    
    // Configurar auto-save
    setupAutoSave();
    
    // Aplicar formatadores
    applyFormatters([
        { ids: ['cpf', 'cpfTitular'], formatter: formatCPF },
        { ids: ['cep'], formatter: formatCEP },
        { ids: ['telefoneFixo'], formatter: formatTelefoneFixo },
        { ids: ['telefoneCelular'], formatter: formatTelefoneCelular }
    ]);
});

// Gerar PDF (impressão nativa)
async function gerarPDF() {
    try {
        const controls = document.querySelectorAll('.container input, .container select, .container textarea');
        const originalControls = [];
        
        controls.forEach(control => {
            // Radio e checkbox: mostrar com borda se não selecionado
            if (control.type === 'radio' || control.type === 'checkbox') {
                if (!control.checked) {
                    // Criar span vazio com borda para indicar campo não preenchido
                    const empty = document.createElement('span');
                    empty.textContent = '\u00A0';
                    empty.className = 'pdf-text-replacement';
                    empty.style.cssText = 'display: inline-block; width: 12px; height: 12px; border: 1px solid #666; border-radius: ' + (control.type === 'radio' ? '50%' : '2px') + '; margin: 0 2px;';
                    originalControls.push({ control, parent: control.parentNode, nextSibling: control.nextSibling, type: 'replace' });
                    control.parentNode.replaceChild(empty, control);
                } else {
                    // Substituir por checkmark
                    const mark = document.createElement('span');
                    mark.textContent = '✔';
                    mark.className = 'pdf-text-replacement';
                    mark.style.cssText = 'font-size: 11px; color: #000; padding: 0 4px;';
                    originalControls.push({ control, parent: control.parentNode, nextSibling: control.nextSibling, type: 'replace' });
                    control.parentNode.replaceChild(mark, control);
                }
                return;
            }
            
            // Pegar valor do controle
            let textValue = '';
            if (control.tagName.toLowerCase() === 'select') {
                const selected = control.options[control.selectedIndex];
                textValue = selected ? selected.text.trim() : '';
            } else {
                textValue = (control.value || '').trim();
            }
            
            const placeholderValue = control.getAttribute('placeholder') || '';
            
            const span = document.createElement('span');
            const isEmpty = textValue === '' || textValue === placeholderValue;
            console.log('Control:', control.id, 'textValue:', textValue, 'placeholder:', placeholderValue, 'isEmpty:', isEmpty);
            span.textContent = isEmpty ? '' : textValue;
            span.className = 'pdf-text-replacement';

            const borderStyle = 'none';
            span.style.cssText = 'font-size: 11px; color: #000; border-bottom: ' + borderStyle + '; display: inline-block; min-width: 25px; padding: 0 4px 2px 4px; flex: 1; white-space: pre; line-height: 1.2; vertical-align: baseline;';
            span.style.cssText = 'font-size: 11px; color: #000; display: inline-block; min-width: 25px; padding: 0 4px 2px 4px; flex: 1; white-space: pre; line-height: 1.2; vertical-align: baseline; background: white;';
            
            originalControls.push({ control, parent: control.parentNode, nextSibling: control.nextSibling, type: 'replace' });
            control.parentNode.replaceChild(span, control);
        });

        await new Promise(resolve => setTimeout(resolve, 100));
        window.print();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Restaurar controles substituídos pelo HTML de impressão
        try {
            originalControls.forEach(item => {
                try {
                    if (item.control) {
                        // Clear the control value/state before reinserting
                        try {
                            const tag = item.control.tagName && item.control.tagName.toLowerCase();
                            if (tag === 'select') {
                                try { item.control.selectedIndex = -1; } catch (e) { item.control.value = ''; }
                            } else if (item.control.type === 'checkbox' || item.control.type === 'radio') {
                                item.control.checked = false;
                            } else if (typeof item.control.value !== 'undefined') {
                                item.control.value = '';
                            }
                        } catch (e) {}
                    }
                    if (item.parent) {
                        if (item.nextSibling && item.nextSibling.parentNode === item.parent) {
                            item.parent.insertBefore(item.control, item.nextSibling);
                        } else {
                            item.parent.appendChild(item.control);
                        }
                    }
                } catch (e) {
                    // ignore individual restore errors
                }
            });
            // Remover quaisquer nós de substituição que permaneceram
            try { document.querySelectorAll('.pdf-text-replacement').forEach(n => n.remove()); } catch (e) {}
        } catch (e) {
            console.warn('Erro ao restaurar controles:', e);
        }

        // Limpar formulário após gerar PDF (após restaurar os controles)
        try { limparFormulario(); } catch (e) {}
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('❌ Erro ao gerar PDF. Tente novamente.');
    }
}
