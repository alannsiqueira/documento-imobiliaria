/**
 * Pinoti - Anexo II (Locatário)
 * Lógica específica do formulário de locatário
 */

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Identificar formulário
    document.body.dataset.formId = 'anexo-II';
    
    // Carregar dados salvos
    autoLoadForm();
    
    // Configurar auto-save
    setupAutoSave();
    
    // Aplicar formatadores
    applyFormatters([
        { ids: ['cpfLocatario', 'cpfConjuge'], formatter: formatCPF },
        { ids: ['cnpjEmpresa', 'cnpjEmpresaConjuge'], formatter: formatCNPJ },
        { ids: [], formatter: formatCEP },
        { ids: ['telefoneFixoLocatario', 'telefoneFixoConjuge'], formatter: formatTelefoneFixo },
        { ids: ['telefoneCelularLocatario', 'telefoneCelularConjuge', 'telefoneEmpresa', 'telefoneEmpresaConjuge'], formatter: formatTelefoneCelular }
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
            span.textContent = isEmpty ? '\u00A0' : textValue;
            span.className = 'pdf-text-replacement';
            // Sem underline se estiver vazio
            const borderStyle = isEmpty ? 'none' : '1px solid #666';
            span.style.cssText = 'font-size: 11px; color: #000; display: inline-block; min-width: 25px; padding: 0 4px 2px 4px; flex: 1; white-space: pre; line-height: 1.2; vertical-align: baseline;';
            
            originalControls.push({ control, parent: control.parentNode, nextSibling: control.nextSibling, type: 'replace' });
            control.parentNode.replaceChild(span, control);
        });

        await new Promise(resolve => setTimeout(resolve, 100));
        window.print();
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Limpar formulário após gerar PDF
        limparFormulario();

        // Restaurar controles
        /*
        document.querySelectorAll('.pdf-text-replacement').forEach(span => {
            const item = originalControls.find(oi => oi.type === 'replace' && oi.parent === span.parentNode);
            if (item) {
                if (item.nextSibling) {
                    item.parent.insertBefore(item.control, item.nextSibling);
                } else {
                    item.parent.appendChild(item.control);
                }
                span.remove();
            }
        });
        
        originalControls.forEach(item => {
            if (item.type === 'hide') {
                item.control.style.display = '';
            }
        });
        */
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('❌ Erro ao gerar PDF. Tente novamente.');
    }
}
