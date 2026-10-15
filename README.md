<div align="center">

# Just Move

Exercícios guiados pela câmera, com detecção de pose em tempo real direto no navegador.

[![Demo](https://img.shields.io/badge/demo-just--move--flax.vercel.app-FF6B2C?style=for-the-badge)](https://just-move-flax.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose-0097A7?logo=google&logoColor=white)

</div>

## Índice

- [Demo](#demo)
- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Exercícios disponíveis](#exercícios-disponíveis)
- [Tecnologias](#tecnologias)
- [Como rodar](#como-rodar)
- [Scripts](#scripts)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como funciona](#como-funciona)

## Demo

Acesse em **[just-move-flax.vercel.app](https://just-move-flax.vercel.app)**.

Permita o acesso à câmera e fique com o corpo inteiro visível. Sem câmera disponível, o app entra no modo demonstração com um atleta virtual.

## Sobre

O Just Move usa a webcam para acompanhar o movimento durante exercícios. O app conta repetições, avalia a amplitude de cada uma e dá feedback visual e sonoro sobre a execução. Todo o processamento acontece no navegador e nenhum vídeo é enviado para servidores.

## Funcionalidades

| Recurso | Descrição |
| --- | --- |
| Detecção de pose | Esqueleto desenhado sobre o vídeo com MediaPipe Pose |
| Contagem de repetições | Fases do movimento: repouso, subida, pico e descida |
| Feedback de execução | Mensagens sobre ângulo e postura, com classificação PERFEITO, BOM ou REGULAR |
| Feedback sonoro | Sons gerados com Web Audio API a cada repetição |
| Pontuação e precisão | Pontos por sessão e percentual de acerto |
| Progresso | Nível, sequência de dias, meta semanal e histórico de treinos |
| Tutorial interativo | Instruções e dicas para cada exercício antes de começar |
| Modo demonstração | Atleta virtual simulado quando a câmera não está disponível |
| Layout responsivo | Dashboards separados para web e mobile |

## Exercícios disponíveis

| Exercício | Categoria | Articulações |
| --- | --- | --- |
| Abdução de ombro | Membros superiores | Ombros e cotovelos |
| Flexão de ombro | Membros superiores | Ombros e peitoral superior |
| Agachamento livre | Membros inferiores | Quadril e joelhos |
| Polichinelo cardio | Cardio e agilidade | Corpo inteiro |

Os parâmetros de cada exercício (ângulo alvo, ângulo de repouso, meta de repetições) ficam em `src/services/exerciseData.ts`.

## Tecnologias

- [React 18](https://react.dev) com [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) para dev server e build
- [Tailwind CSS](https://tailwindcss.com) para estilos
- [MediaPipe Pose](https://developers.google.com/mediapipe) para detecção de pose, carregado via CDN
- [Lucide](https://lucide.dev) para ícones
- `localStorage` para persistir perfil e histórico

## Como rodar

**Pré-requisitos:** Node.js 18 ou superior.

```bash
git clone https://github.com/Lorenalgm/just-move.git
cd just-move
npm install
npm run dev
```

O app abre em `http://localhost:3333`.

> A câmera só funciona em `localhost` ou em conexões HTTPS.

## Scripts

| Comando | Ação |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta 3333 |
| `npm run build` | Verifica tipos e gera o build em `dist/` |
| `npm run preview` | Serve o build localmente |

## Estrutura do projeto

```
src/
├── components/        # Telas e componentes de UI
│   ├── LandingPage.tsx
│   ├── WebDashboard.tsx / MobileDashboard.tsx
│   ├── WorkoutView.tsx         # Tela de treino com câmera
│   ├── PoseCanvas.tsx          # Desenho do esqueleto
│   ├── FeedbackOverlay.tsx
│   └── WorkoutSummary.tsx
├── services/
│   ├── poseDetector.ts         # Integração com MediaPipe e modo demonstração
│   ├── exerciseEngines.ts      # Lógica de contagem e avaliação por exercício
│   └── exerciseData.ts         # Configuração dos exercícios
├── utils/
│   ├── geometry.ts             # Cálculo de ângulos e suavização de landmarks
│   ├── audioFeedback.ts
│   ├── confetti.ts
│   └── storage.ts              # Perfil e histórico no localStorage
└── types/
    └── exercise.ts
```

## Como funciona

1. `poseDetector.ts` captura o vídeo da webcam e envia cada frame ao MediaPipe Pose.
2. Os 33 pontos do corpo retornados passam por suavização em `geometry.ts` para reduzir tremores.
3. `exerciseEngines.ts` calcula o ângulo das articulações principais e identifica a fase do movimento.
4. Ao completar o ciclo repouso, pico e retorno, a repetição é contada e classificada conforme a amplitude atingida.
5. No fim da série, o resultado é salvo no histórico e os pontos entram no perfil.
