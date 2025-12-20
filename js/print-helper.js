/**
 * Pinoti - Helper de Impressão via Iframe
 * Gerencia impressão via iframe oculto sem janela pop-up
 */

async function printViaIframe(cloneElement, fileName) {
    return new Promise((resolve, reject) => {
        try {
            // Criar iframe oculto
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.style.visibility = 'hidden';
            document.body.appendChild(iframe);

            const css = 'html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{background:white;padding:8px}@page{size:A4;margin:0mm}.container{box-shadow:none;width:100%;max-width:100%}.action-buttons{display:none!important}.version-footer{display:none!important}';
            
            // Configurar documento mínimo via srcdoc
            iframe.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title><style>' + css + '</style></head><body></body></html>';

            iframe.onload = () => {
                try {
                    const win = iframe.contentWindow;
                    const doc = win.document;
                    
                    // Obter HTML do clone e remover scripts
                    let htmlContent = cloneElement.outerHTML || '';
                    htmlContent = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '');
                    
                    // Injetar HTML no iframe
                    try {
                        doc.body.innerHTML = htmlContent;
                    } catch (e) {
                        const wrapper = doc.createElement('div');
                        wrapper.innerHTML = htmlContent;
                        doc.body.appendChild(wrapper);
                    }

                    // Remover botões e rodapé se existirem
                    const ab = doc.querySelector('.action-buttons');
                    if (ab && ab.parentNode) ab.parentNode.removeChild(ab);
                    const vf = doc.querySelector('.version-footer');
                    if (vf && vf.parentNode) vf.parentNode.removeChild(vf);

                    // Executar impressão
                    win.focus();
                    win.print();
                    
                    // Limpar após impressão
                    setTimeout(() => {
                        try {
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                        } catch (e) {
                            console.warn('Erro ao remover iframe:', e);
                        }
                        resolve(true);
                    }, 600);
                } catch (err) {
                    try {
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                    } catch (e) {}
                    reject(err);
                }
            };

            iframe.onerror = (err) => {
                try {
                    if (iframe.parentNode) {
                        document.body.removeChild(iframe);
                    }
                } catch (e) {}
                reject(err);
            };
        } catch (err) {
            reject(err);
        }
    });
}
