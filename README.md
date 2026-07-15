# PersonalPessoal 🏋️‍♂️🥑

> **Plataforma inteligente de treino e alimentação de baixo custo com IA integrada.**

O **PersonalPessoal** é um ecossistema desenvolvido para democratizar o acesso à preparação física e nutricional de alto rendimento. A plataforma é focada em praticantes de musculação e atletas amadores, combinando inteligência artificial avançada para montagem e substituição de refeições econômicas com um simulador de treino inteligente, esquemas de banco de dados robustos (com políticas de segurança RLS) e um guia detalhado de comandos.

---

## 📌 Descrição para o GitHub (Bio / About)

> 🚀 Plataforma inteligente de treino e nutrição esportiva de baixo custo. Inclui assistente virtual com IA (NutriAI), simulador mobile interativo, arquitetura de banco de dados SQL (Supabase/PostgreSQL) com políticas de segurança RLS e guias de inicialização rápida.

---

## 📸 Mockups e Visual do Projeto

*(Insira aqui os prints ou mockups do seu aplicativo rodando)*

| 📱 Simulador de Treino & Dieta | 🤖 Assistente Virtual NutriAI |
| :---: | :---: |
| ![Simulador de Treino](https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80) | ![NutriAI Assistant](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80) |

---

## ✨ Funcionalidades Principais

### 1. 🤖 NutriAI: Inteligência Artificial Nutricional
* **Substituição Inteligente:** Sugere alternativas saudáveis e baratas para alimentos caros (ex: substituir peito de frango por ovos, patinho por sardinha enlatada, etc.).
* **Cálculo de Macronutrientes:** Informa com precisão calorias, proteínas, carboidratos e gorduras de alimentos individuais ou combinados.
* **Planejamento Econômico:** Sugestões personalizadas de refeições e pré-treinos de baixo custo focados em hipertrofia ou definição.

### 2. 🏋️‍♂️ Planejador de Treinos Dinâmico
* Geração automática de cronograma com base no seu objetivo (ganho de massa ou perda de peso).
* Animações interativas de execução de exercícios no próprio simulador.
* Temporizador integrado para controle preciso do tempo de descanso entre as séries.

### 3. 💧 Controle Hídrico e Calorias Diárias
* Registrador rápido de água bebida.
* Gráfico intuitivo de progresso e acompanhamento da meta diária individualizada.

### 4. 🔑 Autenticação e Segurança (Supabase RLS)
* Fluxo simulado de Login com o Google (OAuth2).
* Arquitetura robusta de segurança garantindo que cada atleta tenha acesso estritamente aos seus próprios dados de treino e peso.

---

## 🛠️ Arquitetura e Estrutura de Pastas

O repositório foi construído utilizando práticas modernas de modularização para garantir escalabilidade e fácil conversão para aplicativos móveis nativos (Expo/React Native).

```text
├── src/
│   ├── components/
│   │   ├── MobileSimulator.tsx    # Interface principal simulando o aplicativo móvel
│   │   └── DevWorkspace.tsx       # Console de comandos de desenvolvimento e explorador de SQL
│   ├── data/
│   │   ├── nutritionData.ts       # Tabela nutricional e banco de dados de substitutos baratos
│   │   ├── workoutData.ts         # Lista de exercícios e rotinas de treinos inteligentes
│   │   └── dbSchema.ts            # Esquema SQL completo do Supabase com tabelas, triggers e RLS
│   ├── App.tsx                    # Componente raiz que renderiza a plataforma
│   └── main.tsx                   # Ponto de entrada do React
├── server.ts                      # Servidor backend Express que se conecta à API Gemini
├── metadata.json                  # Metadados e permissões da plataforma
├── vite.config.ts                 # Configurações do Vite
└── package.json                   # Dependências e scripts do sistema
```

---

## 📊 Arquitetura do Banco de Dados SQL

O projeto foi planejado com o **PostgreSQL (Supabase)** em mente, garantindo segurança a nível de linha de dados (Row Level Security - RLS). O arquivo `/src/data/dbSchema.ts` contém as seguintes tabelas:

1. **`usuarios`**: Perfis dos atletas contendo objetivo, peso, local de treino e dias de dedicação.
2. **`rotinas_treino`**: Planejamentos de exercícios vinculados a cada usuário.
3. **`historico_peso`**: Registros históricos para análise de progresso físico.
4. **`registro_agua`**: Registro diário de ingestão de líquidos.

### Exemplo de Política de Segurança RLS (Row Level Security):
```sql
-- Garante que o usuário só consiga ver seus próprios registros de água
ALTER TABLE public.registro_agua ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver apenas sua própria ingestão"
ON public.registro_agua
FOR SELECT
USING (auth.uid() = usuario_id);
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* Uma chave de API da **Google Gemini API** (configurada no arquivo `.env`)

### Passos para Inicialização

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/personal-pessoal.git
   cd personal-pessoal
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto e adicione sua chave do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para interagir com o simulador.

5. **Construa para produção:**
   ```bash
   npm run build
   npm start
   ```

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Se você tiver sugestões de novos substitutos de alimentos baratos ou novas rotinas de treino dinâmicas, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

Desenvolvido com carinho para fortalecer e democratizar a musculação e a nutrição de baixo custo! 💪🔥
