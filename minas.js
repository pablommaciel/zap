const { Client, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const moment = require('moment');

const client = new Client({
	puppeteer: {
		args: ['--no-sandbox'],
	}
})

// Gera do Tabuleiro das Minas 
function gerarTabuleiro(dimensao, numeroMinas) {
    const tabuleiro = [];
    const posicoes = [];
  
    for (let i = 0; i < dimensao; i++) {
      tabuleiro.push([]);
      for (let j = 0; j < dimensao; j++) {
        tabuleiro[i].push('🟦');
        posicoes.push([i, j]);
      }
    }
  
    for (let i = 0; i < numeroMinas; i++) {
      const posicaoIndex = Math.floor(Math.random() * posicoes.length);
      const [x, y] = posicoes.splice(posicaoIndex, 1)[0];
      tabuleiro[x][y] = '⭐️';
    }
  
    return tabuleiro;
}
// Onde você le o Qrcode
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Leia o código QR com seu celular para fazer login.');
});

client.on('ready', () => {
  console.log('Bot está pronto para enviar mensagens.');

  setInterval(() => {

    const groupName = 'GRUPO VIP MINES (L)';
    function enviarMensagemParaGrupo(groupName, message) {
      client.getChats().then((chats) => {
        const group = chats.find((chat) => chat.name === groupName);
    
        if (group) {
          client.sendMessage(group.id._serialized, message).then((result) => {
            console.log('Mensagem enviada com sucesso! - Grupo3');
          }).catch((error) => {
            console.error('Erro ao enviar a mensagem:', error);
          });
        } else {
          console.error('Grupo não encontrado!');
        }
      }).catch((error) => {
        console.error('Erro ao obter os chats:', error);
      });
    }

    
    // Definir os dados
    const minas = 3;
    const duracaoMinutos = 3;
    const tentativas = 2;
    const linkAcesso = 'https://sunybet.com/?v=65TUYVX7WEV';
    const dimensaoTabuleiro = 5;
    const numeroMinas = 5;

    const tabuleiro = gerarTabuleiro(dimensaoTabuleiro, numeroMinas);
  
    // Calcular o horário de validade 
    const horarioValidade = moment().add(duracaoMinutos, 'minutes').format('HH:mm');

    const message = `💰 Entrada Confirmada 💰\n💣 Minas: ${minas}\n🕑 Válido até: ${horarioValidade}\n🔁 Nº de tentativas: ${tentativas}\n🔗 Aposte aqui 🤑: ${linkAcesso}\n`+ tabuleiro.map(linha => linha.join('')).join('\n');
    enviarMensagemParaGrupo(groupName, message);


    setTimeout(() => {
      const greenMessage = `✅✅ ACERTOU 100% ✅✅\n⭐️Mines\n🕑 Finalizado ás ${horarioValidade}\nLink para cadastro : ${linkAcesso}`;
      enviarMensagemParaGrupo(groupName, greenMessage);
    }, 1 * 60 * 1000); // 3 minutos

  }, 1 * 60 * 1000); // 5 minutos
});


client.initialize();
