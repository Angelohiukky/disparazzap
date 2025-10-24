const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js'); // Importar MessageMedia
const qrcode = require('qrcode');

let mainWindow;
let client;
let isPaused = false;
let isStopped = false;
let falhasCSV = ''; 

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 900, // Aumentei um pouco a altura para o novo campo
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'public/icon.ico'),
        autoHideMenuBar: true,
    });
    mainWindow.loadFile('public/index.html');
}

app.whenReady().then(createWindow);

// Função de pausa (delay) simples
const delay = ms => new Promise(res => setTimeout(res, ms));

// Função para pausas aleatórias (Jitter)
function randomDelay(minMs, maxMs) {
    const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(res => setTimeout(res, ms));
}

// Função para processar Spintax (Variação de Mensagem)
function spinMessage(template) {
    const regex = /\{([^}]+)\}/g;
    return template.replace(regex, (match, choices) => {
        // Ignora a tag {nome}
        if (choices.toLowerCase() === 'nome') {
            return match;
        }
        const options = choices.split('|');
        return options[Math.floor(Math.random() * options.length)];
    });
}


ipcMain.on('start-whatsapp', (event, { filePath, messageTemplate, attachmentPath }) => { // Recebe attachmentPath
    isPaused = false;
    isStopped = false;
    falhasCSV = 'Nome;Telefone;Erro\n'; 
    
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    });

    client.on('qr', async (qr) => {
        const qrDataUrl = await qrcode.toDataURL(qr);
        mainWindow.webContents.send('qr_code', qrDataUrl);
    });

    client.on('ready', async () => {
        mainWindow.webContents.send('session_ready');
        
        let media = null; // Variável para armazenar a mídia

        // NOVO: Carregar a mídia ANTES do loop
        if (attachmentPath) {
            try {
                const cleanPath = attachmentPath.replace(/^file:\/\//, '');
                mainWindow.webContents.send('status_update', `Carregando anexo...`);
                media = MessageMedia.fromFilePath(cleanPath);
                mainWindow.webContents.send('status_update', 'Anexo carregado com sucesso.');
            } catch (err) {
                console.error("Erro ao carregar anexo:", err);
                mainWindow.webContents.send('status_update', `Erro ao carregar o anexo: ${err.message}. O envio continuará sem anexo.`);
            }
        }
        
        const contatosComFalha = [];
        const contatosComSucesso = [];
        let linhas;
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            linhas = data.split(/\r?\n/); 
            mainWindow.webContents.send('status_update', `Arquivo lido. ${linhas.filter(l => l.trim() !== '').length} contatos encontrados. Iniciando envios...`);
        } catch (err) {
            mainWindow.webContents.send('status_update', `Erro ao ler o arquivo: ${err.message}`);
            return;
        }

        let contadorSucesso = 0;
        let linhasEmBrancoConsecutivas = 0;

        for (let i = 0; i < linhas.length; i++) {
            if (isStopped) {
                mainWindow.webContents.send('status_update', 'Processo interrompido pelo usuário.');
                break;
            }

            if (linhas[i].trim() === '') {
                linhasEmBrancoConsecutivas++;
                if (linhasEmBrancoConsecutivas >= 5) {
                    mainWindow.webContents.send('status_update', 'Detetadas 5 linhas em branco consecutivas. Finalizando processo.');
                    break;
                }
                continue; 
            }
            linhasEmBrancoConsecutivas = 0; 

            while (isPaused) await delay(1000);

            const linha = linhas[i];
            let nome = `Linha ${i + 1}`;
            let telefone = '';

            try {
                const colunas = linha.split(';');
                if (colunas.length >= 2) {
                    nome = colunas[0].trim();
                    telefone = colunas[1].trim().replace(/\D/g, '');

                    if (!telefone) throw new Error("Número de telefone vazio.");

                    const numeroFormatado = `55${telefone}@c.us`;
                    const statusMsg = `(${contadorSucesso + contatosComFalha.length + 1}/${linhas.filter(l => l.trim() !== '').length}) Verificando: ${nome}`;
                    mainWindow.webContents.send('status_update', statusMsg);
                    
                    const isRegistered = await client.isRegisteredUser(numeroFormatado);
                    if (!isRegistered) {
                        throw new Error("Número não registrado no WhatsApp.");
                    }

                    const mensagemVariada = spinMessage(messageTemplate);
                    const mensagemFinal = mensagemVariada.replace(/{nome}/g, nome);
                    
                    mainWindow.webContents.send('status_update', `Enviando para: ${nome}`);

                    // ATUALIZADO: Lógica de envio com ou sem mídia
                    if (media) {
                        // Envia com mídia (mensagem vira legenda/caption)
                        await client.sendMessage(numeroFormatado, media, { caption: mensagemFinal });
                    } else {
                        // Envia apenas texto
                        await client.sendMessage(numeroFormatado, mensagemFinal);
                    }

                    contadorSucesso++;
                    contatosComSucesso.push({ nome, telefone });

                    // Pausas aleatórias
                    if (contadorSucesso > 0 && contadorSucesso % 50 === 0 && (i + 1) < linhas.length) {
                        mainWindow.webContents.send('status_update', `PAUSA LONGA... (${contadorSucesso} enviados)`);
                        await randomDelay(60000, 90000); 
                    } else {
                        await randomDelay(15000, 25000); 
                    }
                }
            } catch (err) {
                const erroMsg = err.message || 'Erro desconhecido';
                console.error(`ERRO ao enviar para ${nome}: ${erroMsg}`);
                contatosComFalha.push({ nome, telefone, erro: erroMsg });
                falhasCSV += `"${nome}";"${telefone}";"${erroMsg}"\n`; 
                mainWindow.webContents.send('status_update', `Erro ao enviar para ${nome}. Pulando...`);
                
                await randomDelay(5000, 10000); 
            }
        }

        if (client) {
            await client.destroy();
            client = null;
        }
        
        mainWindow.webContents.send('show-report', {
            sucesso: contadorSucesso,
            falhas: contatosComFalha.length,
            total: contadorSucesso + contatosComFalha.length,
            temFalhas: contatosComFalha.length > 0
        });
    });

    client.initialize();
});

// Handler para salvar o relatório de falhas
ipcMain.on('download-report', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Salvar Relatório de Falhas',
        defaultPath: `relatorio_falhas_${Date.now()}.csv`,
        filters: [{ name: 'Arquivos CSV', extensions: ['csv'] }]
    });

    if (!canceled && filePath) {
        fs.writeFile(filePath, falhasCSV, 'utf8', (err) => {
            if (err) {
                mainWindow.webContents.send('status_update', `Erro ao salvar o relatório: ${err.message}`);
            } else {
                mainWindow.webContents.send('status_update', `Relatório de falhas salvo em: ${filePath}`);
            }
        });
    }
});


// Controles e seletor de arquivo (sem alterações)
ipcMain.on('pause-sending', () => { isPaused = true; });
ipcMain.on('resume-sending', () => { isPaused = false; });
ipcMain.on('stop-sending', async () => {
    isStopped = true;
    mainWindow.webContents.send('status_update', 'Parando o processo...');
    if (client) {
        await client.destroy();
        client = null;
    }
});

ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Arquivos CSV', extensions: ['csv'] }]
    });
    return canceled ? null : filePaths[0];
});

// NOVO: Handler para selecionar o anexo
ipcMain.handle('dialog:openAttachment', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Mídia', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'mp4', 'mkv'] },
            { name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] },
            { name: 'Documentos', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'] },
            { name: 'Todos os Arquivos', extensions: ['*'] }
        ]
    });
    return canceled ? null : filePaths[0];
});
