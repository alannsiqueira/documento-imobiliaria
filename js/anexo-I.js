/**
 * Pinoti - Anexo I (Proprietário)
 * Lógica específica do formulário de proprietário
 */

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar visibilidade do botão compartilhar
    setupShareButtonVisibility();
    
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
            // Radio e checkbox: ocultar se não selecionado
            if (control.type === 'radio' || control.type === 'checkbox') {
                if (!control.checked) {
                    control.style.display = 'none';
                    originalControls.push({ control, type: 'hide' });
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
            span.textContent = (textValue === '' || textValue === placeholderValue) ? ' ' : textValue;
            span.className = 'pdf-text-replacement';
            span.style.cssText = 'font-size: 11px; color: #000; border-bottom: 1px solid #666; display: inline-block; min-width: 25px; padding: 2px 4px; flex: 1; white-space: pre; vertical-align: bottom;';
            
            originalControls.push({ control, parent: control.parentNode, nextSibling: control.nextSibling, type: 'replace' });
            control.parentNode.replaceChild(span, control);
        });

        await new Promise(resolve => setTimeout(resolve, 100));
        window.print();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Restaurar controles
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
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('❌ Erro ao gerar PDF. Tente novamente.');
    }
}

// Compartilhar via WhatsApp
async function compartilharWhatsApp() {
    if (isMobile()) {
        await compartilharMobile();
    } else {
        await compartilharDesktop();
    }
}

// Compartilhar Desktop
async function compartilharDesktop() {
    try {
        const nomeProprietario = document.getElementById('nome').value || 'Proprietario';
        const fileName = 'Anexo_I_' + nomeProprietario.replace(/\s+/g, '_') + '_' + Date.now() + '.pdf';

        const container = document.querySelector('.container');
        const clone = container.cloneNode(true);
        
        clone.style.cssText = 'width: 100% !important; max-width: 100% !important; background-color: #2c5468; padding: 8px; margin: 0 !important; margin-left: 0 !important; left: 0 !important; border-radius: 0; box-shadow: none; page-break-inside: avoid;';
        
        const ab = clone.querySelector('.action-buttons');
        if (ab) ab.remove();
        const vf = clone.querySelector('.version-footer');
        if (vf) vf.remove();
        
        clone.querySelectorAll('.section').forEach(section => {
            section.style.padding = '6px';
            section.style.marginBottom = '6px';
        });
        
        const inputs = clone.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                if (!input.checked) input.remove();
                return;
            }
            
            const span = document.createElement('span');
            const textValue = input.value.trim();
            const placeholderValue = input.getAttribute('placeholder') || '';
            
            span.textContent = (textValue === '' || textValue === placeholderValue) ? ' ' : textValue;
            span.style.cssText = 'font-size: 11px; color: #000; border-bottom: 1px solid #666; display: block; min-width: 25px; padding: 2px 4px; flex: 1; white-space: pre;';
            input.parentNode.replaceChild(span, input);
        });
        
        // Temporariamente ocultar overflow do body
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        document.body.appendChild(clone);

        await new Promise(resolve => setTimeout(resolve, 300));

        const pdfBlob = await generatePdfFromClone(clone, fileName, { mobileOverrides: false, margin: 0, scale: 1.5 });
        
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        document.body.style.overflow = originalOverflow;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Erro ao compartilhar desktop:', error);
        alert('❌ Erro ao gerar PDF. Tente novamente.');
    }
}

// Compartilhar Mobile
async function compartilharMobile() {
    try {
        const nomeProprietario = document.getElementById('nome').value || 'Proprietario';
        const fileName = 'Anexo_I_' + nomeProprietario.replace(/\s+/g, '_') + '_' + Date.now() + '.pdf';

        const container = document.querySelector('.container');
        const clone = container.cloneNode(true);
        
        clone.style.cssText = 'background-color: #2c5468; padding: 8px; margin: 0; border-radius: 0; box-shadow: none; page-break-inside: avoid;';
        
        const ab = clone.querySelector('.action-buttons');
        if (ab) ab.remove();
        const vf = clone.querySelector('.version-footer');
        if (vf) vf.remove();
        
        clone.querySelectorAll('.section').forEach(section => {
            section.style.padding = '4px';
            section.style.marginBottom = '3px';
            section.style.pageBreakInside = 'avoid';
        });
        
        // Substituir TODOS os controles (input, select, textarea) por spans
        clone.querySelectorAll('input, select, textarea').forEach(control => {
            // Radio e checkbox: remover se não selecionado
            if (control.type === 'radio' || control.type === 'checkbox') {
                if (!control.checked) {
                    control.remove();
                } else {
                    const mark = document.createElement('span');
                    mark.textContent = '✔';
                    mark.style.cssText = 'font-size: 10px; color: #000; padding: 0 2px;';
                    control.parentNode.replaceChild(mark, control);
                }
                return;
            }
            
            // Pegar valor do controle
            let textValue = '';
            if (control.tagName.toLowerCase() === 'select') {
                const selected = control.options[control.selectedIndex];
                textValue = selected ? selected.text : '';
            } else {
                textValue = (control.value || '').trim();
            }
            
            const placeholderValue = control.getAttribute('placeholder') || '';
            
            // Criar span de substituição
            const span = document.createElement('span');
            span.textContent = (textValue === '' || textValue === placeholderValue) ? ' ' : textValue;
            span.style.cssText = 'font-size: 10px; color: #000; border-bottom: 1px solid #666; display: inline-block; min-width: 20px; max-width: 100%; padding: 1px 2px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -webkit-appearance: none; appearance: none; background: transparent;';
            
            control.parentNode.replaceChild(span, control);
        });
        
        clone.querySelectorAll('.form-row').forEach(row => {
            row.style.cssText = 'display: flex; gap: 4px; margin-bottom: 4px; flex-direction: row;';
        });
        
        clone.querySelectorAll('.form-group').forEach(group => {
            let flex = '1';
            if (group.classList.contains('small')) flex = '0.25';
            else if (group.classList.contains('medium')) flex = '0.4';
            
            group.style.cssText = 'display: flex; align-items: center; background-color: white; padding: 3px 4px; border-radius: 3px; gap: 3px; flex: ' + flex + ';';
        });
        
        clone.querySelectorAll('.form-label').forEach(label => {
            label.style.cssText = 'font-size: 9px; color: #2c5468; font-weight: normal; white-space: nowrap; flex-shrink: 0;';
        });
        
        clone.style.position = 'relative';
        clone.style.marginTop = '0';
        document.body.appendChild(clone);

        await new Promise(resolve => setTimeout(resolve, 300));

        // Gerar PDF e compartilhar
        const pdfBlob = await generatePdfFromClone(clone, fileName, { mobileOverrides: true });
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        
        // Tentar usar Web Share API
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ 
                    files: [file], 
                    title: 'Anexo I - Cadastro de Proprietário', 
                    text: 'Formulário de cadastro do proprietário.' 
                });
            } catch (e) {
                if (e.name !== 'AbortError') {
                    // Usuário cancelou ou erro - fazer download
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(pdfBlob);
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    if (link.parentNode) link.parentNode.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }
            }
        } else {
            // Navegador não suporta Web Share - fazer download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) link.parentNode.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    } catch (error) {
        console.error('Erro ao compartilhar mobile:', error);
        alert('❌ Erro ao compartilhar. Tente novamente.');
    }
}
