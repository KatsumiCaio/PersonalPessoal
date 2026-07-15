# PersonalPessoal - Diretrizes e Instruções de Desenvolvimento

Este arquivo contém as diretrizes persistentes, convenções de código e regras de negócio essenciais para o desenvolvimento e manutenção do projeto **PersonalPessoal**. Qualquer agente de IA ou desenvolvedor deve aderir estritamente a estas instruções para garantir a consistência e a qualidade da plataforma.

---

## 📱 1. Visão Geral do Projeto

**PersonalPessoal** é uma plataforma inovadora de treino e alimentação personalizada. O core da experiência do usuário é um **Simulador de Dispositivo Móvel interativo** (`MobileSimulator.tsx`), permitindo que usuários gerenciem treinos diários, controlem tempos de descanso, e experimentem a diferença entre as experiências **Freemium** e **Premium** (com e sem anúncios).

---

## 🛠️ 2. Arquitetura e Stack Tecnológica

- **Frontend**: React 18+ com Vite.
- **Backend (Full-stack)**: Servidor Express em TypeScript (`server.ts`), atuando como proxy para APIs e entrega de assets.
- **Estilização**: Tailwind CSS com foco em design responsivo e visual moderno de alta fidelidade.
- **Ícones**: Uso exclusivo da biblioteca `lucide-react`. **Não criar SVGs customizados inline.**
- **Animações**: Motion (`motion/react`) para transições suaves e estados fluidos.
- **Idioma da Interface**: **Português (Brasil)** para todos os textos, toasts, labels e feedbacks.

---

## ⏱️ 3. Regras de Ouro do Cronômetro de Descanso (Timer)

O gerenciamento de estado do temporizador de descanso é crítico para a usabilidade e não deve ser quebrado. As regras a seguir regem o funcionamento do timer:

1. **Reatividade Instantânea (`timerResetCount`)**:
   - Para evitar que o temporizador fique travado ou "congelado" em 0 quando redefinido, usamos uma variável de controle de redefinição chamada `timerResetCount`.
   - O `useEffect` responsável pelo `setInterval` do cronômetro deve incluir `timerResetCount` em sua lista de dependências. Isso força o reinício limpo do intervalo sempre que um novo descanso é acionado.
   - Sempre que `startTimer(seconds)` ou `prepareTimer(seconds)` for invocado, atualize `setTimerResetCount(prev => prev + 1)`.

2. **Exercícios sem Descanso (`rest = 0`)**:
   - Alguns exercícios (como aquecimento geral ou cardios constantes) possuem tempo de descanso igual a `0`.
   - Se o tempo passado para `startTimer` for `<= 0`, o sistema deve definir `timerActive(false)` e marcar `timerCompleted(true)` imediatamente para evitar contagens negativas ou zeradas estáticas.

3. **Início do Timer com Base no Plano (Premium vs. Freemium)**:
   - **Premium**: O treino flui imediatamente. Ao marcar ou iniciar o descanso, a contagem regressiva começa instantaneamente (`startTimer(rest)`).
   - **Freemium (Com Anúncios)**: O descanso prepara o timer em background (`prepareTimer(rest)`), mas inicia mostrando uma tela de anúncio simulada de 5 segundos. O timer de descanso real só começa a rodar (`setTimerActive(true)`) quando o anúncio é finalizado ou o usuário clica em "Pular Anúncio" (após o término dos 5 segundos obrigatórios).

---

## 🎨 4. Diretrizes de Design e UI

- **Fidelidade de Simulador**: O layout do celular simulado deve conter elementos clássicos (barra de status superior com relógio em tempo real, notch de câmera, indicador de bateria e barra de navegação inferior fluida).
- **Consistência de Cores**: Visual escuro moderno (Cosmic Slate), utilizando tons de `zinc-900`/`zinc-950` combinados com detalhes vibrantes em laranja (`orange-500`/`orange-600`) para simular alto desempenho e energia esportiva.
- **Feedback Visual Instantâneo**: Usar Toasts breves e objetivos para notificar ações como conclusão de exercícios, ativação do descanso ou troca de planos.

---

## 🧹 5. Práticas de Código e Qualidade

- **Modularidade**: Evitar centralizar toda a lógica em um único arquivo gigantesco se novas features forem solicitadas. Se necessário, crie componentes focados sob `src/components/`.
- **Prevenção de Loops**: Em efeitos colaterais (`useEffect`), evite incluir dependências não primitivas que possam causar re-renderizações infinitas.
- **Validação**: Sempre execute `npm run lint` e garanta que o build compila sem erros antes de concluir as alterações.
