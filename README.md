📱 Disparador WhatsApp Desktop

Uma aplicação desktop poderosa para envio de mensagens personalizadas em massa via WhatsApp Web

🚀 Características Principais

✅ Interface Intuitiva: Design moderno e amigável inspirado no WhatsApp

✅ Mensagens Personalizadas: Use {nome} para personalizar cada mensagem.

✅ Variação de Mensagem (Spintax): Use {opção1|opção2} para variar o texto e reduzir o risco de bloqueio.

✅ Processamento CSV: Suporte completo a arquivos CSV com formato simples.

✅ Controles de Envio: Pause, retome e pare os envios a qualquer momento.

✅ Relatórios Detalhados: Ao final, visualize um sumário de sucessos/falhas com opção de baixar um CSV dos contatos que falharam.

✅ Verificação de Números: Checa se um número existe no WhatsApp antes de tentar enviar.

✅ Prevenção de Bloqueios (Jitter): Pausas com intervalos aleatórios entre mensagens para simular comportamento humano.

✅ Parada Inteligente: O programa encerra automaticamente se encontrar 5 linhas em branco consecutivas.

✅ QR Code Integrado: Autenticação fácil via WhatsApp Web.

✅ Instalador Windows: Distribuição profissional com assistente de instalação.

📋 Pré-requisitos

Windows 10/11 (64-bit)

WhatsApp instalado no celular

Conexão com internet estável

Arquivo CSV com contatos no formato: Nome;Telefone

🔧 Instalação

Opção 1: Usar o Instalador (Recomendado)

Baixe o arquivo Disparador WhatsApp Setup.exe

Execute o instalador como administrador

Siga as instruções do assistente de instalação

Inicie a aplicação pelo ícone na área de trabalho

Opção 2: Executar do Código Fonte

# Clone o repositório
git clone [https://github.com/seu-usuario/disparador-whatsapp](https://github.com/seu-usuario/disparador-whatsapp)

# Entre no diretório
cd disparador-whatsapp

# Instale as dependências
npm install

# Execute a aplicação
npm start


📊 Como Usar

1. Preparar o Arquivo CSV

Crie um arquivo CSV com o seguinte formato:


João Silva;11999999999
Maria Santos;21988888888
Pedro Costa;(11) 77777-7777


2. Configurar a Mensagem

Digite sua mensagem no campo de texto.

Use {nome} para personalização automática.

Use {opção1|opção2} para variar o texto (Spintax).

Exemplo: {Olá|Oi} {nome}! {Tudo bem?|Como vai?}

3. Iniciar o Processo

Selecione o arquivo CSV com seus contatos.

Clique em "Iniciar Envios".

Escaneie o QR Code com seu WhatsApp.

Acompanhe o progresso em tempo real.

4. Controlar o Envio

Pausar: Interrompe temporariamente os envios.

Retomar: Continua de onde parou.

Parar: Finaliza completamente o processo.

⏯️ Controles Durante o Envio

Depois de iniciar o processo, você terá acesso aos seguintes controles em tempo real:

Pausar: Interrompe temporariamente o envio de mensagens. Ideal para atender a outra demanda ou verificar a conexão.

Retomar: Continua o processo de envio do ponto em que foi pausado.

Parar e Sair: Encerra completamente a sessão de envio. Ao final, um relatório será exibido.

📄 Relatório Final e Download

Ao final de cada processo (seja por conclusão ou interrupção), a aplicação exibirá um relatório completo com:

Total de Contatos Processados

Mensagens Enviadas com Sucesso

Número de Falhas

Se houver alguma falha, um botão "Baixar Relatório de Falhas" ficará disponível, permitindo que você salve um arquivo .csv com os detalhes dos contatos que não receberam a mensagem e o motivo do erro.

⚙️ Configurações Inteligentes

Recurso	Descrição	Valor
Delay entre mensagens	Intervalo aleatório (Jitter) para evitar spam	15 - 25 segundos
Pausa automática	A cada X mensagens	50 mensagens
Tempo de pausa	Duração aleatória da pausa automática	60 - 90 segundos
Formato do número	Código do país + número	+55 (Brasil)

Exportar para as Planilhas

🛡️ Recursos de Segurança

Autenticação Local: Suas credenciais ficam no seu computador

Sem Armazenamento: Não salvamos seus contatos ou mensagens

Pausas Aleatórias (Jitter): Pausas inteligentes e com intervalos aleatórios (entre 15-25s) e pausas longas (60-90s a cada 50 envios) para simular comportamento humano.

Verificação de Números: O sistema verifica se o número existe no WhatsApp antes de enviar, reduzindo a taxa de falhas e melhorando a reputação do número.

Variação de Mensagem (Spintax): Permite o uso de {opção1|opção2} na mensagem para que cada envio seja ligeiramente diferente.

🔧 Desenvolvimento

Tecnologias Utilizadas
Electron - Framework para aplicações desktop

Node.js - Runtime JavaScript

whatsapp-web.js - Biblioteca para integração com WhatsApp Web

QRCode - Geração de códigos QR

Electron Builder - Empacotamento e distribuição

Estrutura do Projeto

disparador-whatsapp/
├── main.js              # Processo principal do Electron
├── preload.js           # Script de pré-carregamento
├── package.json         # Configurações e dependências
├── public/
│   ├── index.html       # Interface da aplicação
│   ├── script.js        # JavaScript do frontend
│   └── icon.ico         # Ícone da aplicação
├── docs/                # Documentação e capturas
└── dist/                # Arquivos de distribuição


Comandos de Build

# Desenvolvimento
npm start

# Gerar instalador Windows
npm run dist-win

# Empacotar sem instalador
npm run pack

# Instalar dependências nativas
npm run postinstall


🚨 Limitações e Avisos

⚠️ RISCO DE BLOQUEIO: O uso de automação com bibliotecas não oficiais (como esta) viola os Termos de Serviço do WhatsApp. Use esta ferramenta com moderação, por sua conta e risco. A API Oficial do WhatsApp Business é a única forma 100% segura.

⚠️ AQUECIMENTO (Warm-up): Não use esta ferramenta com uma conta nova. Aqueça a conta enviando e recebendo mensagens manualmente por vários dias antes de automatizar. Comece com listas pequenas (ex: 20-30) e aumente gradualmente.

⚠️ Não spam: Evite envios excessivos que possam ser considerados spam.

⚠️ Números válidos: Certifique-se de que os números estão corretos.

⚠️ Conexão estável: Mantenha internet estável durante os envios.

🐛 Solução de Problemas

Problemas Comuns
❓ QR Code não aparece

Verifique sua conexão com internet

Reinicie a aplicação

Certifique-se de que o WhatsApp Web está funcionando

❓ Mensagens não são enviadas

Verifique se o número está no formato correto (apenas números).

O script agora identifica números inválidos ou não registrados no WhatsApp automaticamente (veja o relatório de falhas).

Verifique se não há bloqueios temporários.

❓ Aplicação trava durante envios

Reduza a quantidade de contatos por lote.

Verifique se há memória RAM suficiente.

Reinicie a aplicação se necessário.

📞 Suporte

Encontrou um bug ou tem uma sugestão?

📧 Email: ra.evangelist@gmail.com | hiukky.ra@gmail.com

🐛 Issues: GitHub Issues

💬 Discussões: GitHub Discussions

📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

👨‍💻 Desenvolvedor

Rodrigo Angelo

⭐ Contribuições

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

🍴 Faça um Fork do projeto

🔀 Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

💾 Commit suas mudanças (git commit -m 'Add some AmazingFeature')

📤 Push para a branch (git push origin feature/AmazingFeature)

🔃 Abra um Pull Request

📈 Roadmap

[ ] v2.0: Suporte a imagens e documentos

[ ] v2.1: Agendamento de mensagens

[ ] v2.2: Templates de mensagens

[ ] v2.3: Integração com Google Sheets

[ ] v2.4: Relatórios em PDF

[ ] v3.0: Suporte a múltiplas contas

<div align="center">

⚡ Feito com ❤️ e muito ☕ por Rodrigo Angelo

Se este projeto te ajudou, considere dar uma ⭐!

</div>
