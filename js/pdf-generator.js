/**
 * Pinoti - Helper de Geração de PDF
 * Gerencia geração de PDF via html2pdf.js
 */

async function generatePdfFromClone(cloneElement, fileName, options = {}) {
    const opts = {
        mobileOverrides: options.mobileOverrides || false,
        margin: typeof options.margin === 'number' ? options.margin : 0,
        scale: typeof options.scale === 'number' ? options.scale : 1.5
    };

    const pdfOptions = {
        margin: opts.margin,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: opts.scale,
            useCORS: true,
            logging: false
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // Aplicar overrides para mobile se necessário
    if (opts.mobileOverrides) {
        try {
            // Ajustar estilos
            cloneElement.querySelectorAll('.section').forEach(section => {
                section.style.padding = '6px';
                section.style.marginBottom = '6px';
                section.style.pageBreakInside = 'avoid';
            });

            cloneElement.querySelectorAll('.form-row').forEach(row => {
                row.style.cssText = 'display: flex; gap: 6px; margin-bottom: 5px; flex-direction: row;';
            });

            cloneElement.querySelectorAll('.form-group').forEach(group => {
                let flex = '1';
                if (group.classList.contains('small')) flex = '0.25';
                else if (group.classList.contains('medium')) flex = '0.4';
                group.style.cssText = 'display: flex; align-items: center; background-color: white; padding: 4px 6px; border-radius: 3px; gap: 4px; flex: ' + flex + ';';
            });

            cloneElement.querySelectorAll('.form-label').forEach(label => {
                label.style.cssText = 'font-size: 10px; color: #2c5468; font-weight: normal; white-space: nowrap; flex-shrink: 0;';
            });

            // Substituir inputs por spans
            cloneElement.querySelectorAll('input').forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    if (!input.checked) {
                        input.remove();
                    } else {
                        const mark = document.createElement('span');
                        mark.textContent = '✔';
                        mark.style.cssText = 'font-size:11px; color:#000; padding:0 4px;';
                        if (input.parentNode) {
                            input.parentNode.replaceChild(mark, input);
                        }
                    }
                    return;
                }

                const span = document.createElement('span');
                const textValue = input.value ? input.value.trim() : '';
                const placeholderValue = input.getAttribute('placeholder') || '';
                span.textContent = (textValue === '' || textValue === placeholderValue) ? ' ' : textValue;
                span.style.cssText = 'font-size:11px; color:#000; border-bottom:1px solid #666; display:block; min-width:25px; padding:2px 4px; white-space:pre;';
                if (input.parentNode) {
                    input.parentNode.replaceChild(span, input);
                }
            });
        } catch (e) {
            console.warn('Erro ao aplicar mobileOverrides:', e);
        }
    }

    // Forçar largura A4 se mobile
    let prevDocMinWidth = '';
    let prevHtmlMinWidth = '';
    let appliedDocMinWidth = false;
    
    if (opts.mobileOverrides) {
        try {
            prevDocMinWidth = document.body.style.minWidth || '';
            prevHtmlMinWidth = document.documentElement.style.minWidth || '';
            document.body.style.minWidth = '794px';
            document.documentElement.style.minWidth = '794px';
            appliedDocMinWidth = true;

            cloneElement.style.width = '794px';
            cloneElement.style.maxWidth = '794px';
            cloneElement.style.boxSizing = 'border-box';
        } catch (e) {
            console.warn('Erro ao definir largura A4:', e);
        }
    }

    await new Promise(r => setTimeout(r, 160));

    // Criar wrapper para captura
    let wrapper = null;
    try {
        const bg = window.getComputedStyle(cloneElement).backgroundColor || window.getComputedStyle(document.body).backgroundColor || '#2c5468';
        wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:794px; max-width:794px; box-sizing:border-box; margin:0 !important; margin-left:0 !important; padding:0; background:' + bg + '; position:relative; left:0;';
        
        // Usar o elemento já modificado diretamente (não clonar novamente)
        const printable = cloneElement;
        
        printable.style.background = printable.style.background || 'transparent';
        printable.style.boxSizing = 'border-box';
        printable.style.width = '794px';
        printable.style.maxWidth = '794px';

        // Apertar espaçamento
        try {
            printable.querySelectorAll('.subsection').forEach(s => {
                s.style.marginTop = '2px';
            });
            printable.querySelectorAll('.section').forEach(s => {
                s.style.marginBottom = '2px';
                s.style.paddingBottom = '4px';
            });
        } catch (e) {
            console.warn('Erro ao apertar espaçamento:', e);
        }
        
        wrapper.appendChild(printable);
        document.body.appendChild(wrapper);
    } catch (e) {
        console.warn('Erro ao criar wrapper:', e);
    }

    const elementToPrint = wrapper || cloneElement;

    // Ajustar escala para caber em A4
    try {
        if (opts.mobileOverrides && wrapper) {
            const printableElem = wrapper.querySelector(':scope > *') || wrapper.firstElementChild || cloneElement;
            const a4HeightPx = 1122;
            const currentH = printableElem.scrollHeight || printableElem.offsetHeight || printableElem.getBoundingClientRect().height || 0;
            if (currentH > 0) {
                const currentScale = pdfOptions.html2canvas.scale;
                if (currentH * currentScale > a4HeightPx) {
                    const newScale = Math.max(0.6, Math.min(currentScale, a4HeightPx / currentH));
                    pdfOptions.html2canvas.scale = newScale;
                    console.log('Escala ajustada para:', newScale);
                }
            }
        }
    } catch (e) {
        console.warn('Erro ao ajustar escala:', e);
    }

    const blob = await html2pdf().set(pdfOptions).from(elementToPrint).output('blob');

    // Limpar wrapper
    if (wrapper && wrapper.parentNode) {
        try {
            wrapper.parentNode.removeChild(wrapper);
        } catch (e) {
            console.warn('Erro ao remover wrapper:', e);
        }
    }

    // Restaurar estilos do documento
    if (opts.mobileOverrides && appliedDocMinWidth) {
        try {
            document.body.style.minWidth = prevDocMinWidth;
            document.documentElement.style.minWidth = prevHtmlMinWidth;
        } catch (e) {
            console.warn('Erro ao restaurar estilos:', e);
        }
    }

    return blob;
}
