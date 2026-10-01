# EscalaFácil — Gestão de Turnos Médicos

Aplicativo web para organizar plantões e turnos médicos: cadastro de turnos, calendário mensal, modelos reutilizáveis, relatórios e backup dos dados, tudo protegido por PIN.

🔗 **Site:** COLE_AQUI_O_LINK_DO_SITE

## Funcionalidades

- Tela de bloqueio com PIN de 4 a 6 dígitos
- Calendário mensal de plantões
- Cadastro, edição e exclusão de turnos
- Modelos de turno reutilizáveis
- Relatórios com valores e horas
- Configurações do aplicativo
- Backup dos dados em JSON (exportar e importar)
- Interface pensada para uso no celular

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Supabase (opcional, para sincronização)

## Segurança

- Bloqueio temporário após 5 tentativas de PIN incorretas
- Bloqueio automático quando o app vai para segundo plano
- Dados removidos da memória ao bloquear
- Arquivos `.env` fora do Git; o `.env.example` não contém valores reais
- Content Security Policy aplicada no build de produção

## Como rodar localmente

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

## Variáveis de ambiente (opcionais)

Copie o `.env.example` para `.env` e preencha somente se for usar o Supabase:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Autor

**João Vitor**
GitHub: [Costa-dias](https://github.com/Costa-dias)
LinkedIn: [joao-vitor-tec](https://linkedin.com/in/joao-vitor-tec)
