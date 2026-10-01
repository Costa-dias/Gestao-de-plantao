# EscalaFácil — Gestão de Turnos Médicos

Aplicativo web para organizar plantões e turnos médicos: calendário mensal, cadastro de turnos, modelos reutilizáveis, plantões recorrentes, relatórios financeiros e backup criptografado. Os dados ficam **somente no seu aparelho**, protegidos por PIN.

🔗 **Site:** https://gestao-de-plantao.onrender.com/

## Funcionalidades

- Tela de bloqueio com PIN de 4 a 6 dígitos
- Calendário mensal de plantões
- Cadastro, edição e exclusão de turnos
- Modelos de turno reutilizáveis
- Plantão recorrente: repetir todo dia, a cada 2 dias (12x36), toda semana ou a cada 2 semanas
- Relatórios com valores, horas e controle de pagamento
- Tema claro e escuro
- Backup dos dados em JSON criptografado (exportar e importar)
- Lembrete de backup após 30 dias
- Interface pensada para uso no celular
- Exportação em planilha (CSV) para conferir plantões, horas e valores no celular ou no PC

## Segurança

- Dados criptografados no aparelho com **AES-GCM de 256 bits**, usando uma chave derivada do PIN (PBKDF2 com SHA-256)
- O PIN nunca é salvo; o app guarda apenas uma verificação criptografada
- PINs óbvios (como 1111 ou 1234) são recusados na criação
- Bloqueio temporário após 5 tentativas de PIN incorretas
- Bloqueio automático quando o app vai para segundo plano, com os dados removidos da memória
- Backup criptografado com validação rigorosa do formato e limite de 5 MB na importação
- Entradas validadas e sanitizadas; interface sem renderização de HTML inserido pelo usuário
- Content Security Policy aplicada no build de produção
- Nenhum dado é enviado a servidores externos

## Limitações conhecidas

- Os dados ficam **somente no navegador do aparelho**. Limpar os dados do site apaga tudo, por isso faça backup com frequência.
- **Não há recuperação de PIN.** Esquecendo o PIN, os dados não podem ser abertos.
- O backup só abre com o PIN que estava ativo quando ele foi exportado. Após trocar o PIN, exporte um backup novo.
- Com PIN numérico curto, a proteção depende de o aparelho não ser acessado por terceiros.

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Web Crypto API e IndexedDB

## Como rodar localmente

Requer Node.js 18 ou superior.

```bash
git clone https://github.com/Costa-dias/Gestao-de-plantao.git
cd Gestao-de-plantao
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Autor

**João Vitor**
GitHub: [Costa-dias](https://github.com/Costa-dias)
LinkedIn: [joao-vitor-tec](https://linkedin.com/in/joao-vitor-tec)
