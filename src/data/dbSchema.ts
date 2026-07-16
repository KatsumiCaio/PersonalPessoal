export const supabaseSQL = `-- ====================================================================
-- GYMDEMOCRA - ESTRUTURA COMPLETA DE BANCO DE DADOS (SUPABASE/POSTGRES)
-- Autor: Arquiteto de Software & Senior Full Stack
-- Objetivo: Banco de dados relacional robusto, com RLS, Índices e Seed inicial.
-- ====================================================================

-- 1. HABILITAR EXTENSÃO DE UUID (Normalmente já ativa no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE USUÁRIOS (Sincronizada ou complementar ao auth.users do Supabase)
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    objetivo VARCHAR(50) CHECK (objetivo IN ('emagrecer', 'ganhar_massa', 'condicionamento')),
    local_treino VARCHAR(50) CHECK (local_treino IN ('academia', 'casa')),
    dias_por_semana INT CHECK (dias_por_semana BETWEEN 1 AND 7),
    peso_kg DECIMAL(5,2),
    meta_agua_ml INT GENERATED ALWAYS AS (CAST(peso_kg * 35 AS INT)) STORED, -- Cálculo dinâmico recomendável de 35ml/kg
    meta_proteina_g INT GENERATED ALWAYS AS (CAST(peso_kg * 2.0 AS INT)) STORED, -- Foco em hipertrofia/preservação (2.0g/kg)
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. TABELA DE EXERCÍCIOS (Catálogo Geral de Referência com URLs de GIFs/Imagens)
CREATE TABLE public.exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL UNIQUE,
    grupo_muscular VARCHAR(50) NOT NULL,
    equipamento VARCHAR(50) NOT NULL, -- 'halteres', 'barra', 'maquina', 'peso_corporal', etc.
    dificuldade VARCHAR(20) CHECK (dificuldade IN ('iniciante', 'intermediario', 'avancado')),
    gif_url TEXT, -- Link para armazenamento no Supabase Storage
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. TABELA DE FICHAS DE TREINO (Dias da semana que o usuário treina)
CREATE TABLE public.fichas_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1 (Segunda) a 7 (Domingo)
    nome_treino VARCHAR(100) NOT NULL, -- Ex: 'Treino A - Peito e Tríceps' ou 'Fullbody'
    ativo BOOLEAN DEFAULT TRUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(usuario_id, dia_semana) -- Impede que o usuário tenha dois treinos ativos no mesmo dia da semana
);

-- 5. TABELA DE EXERCÍCIOS DO TREINO (Relação M:N de exercícios, séries e cargas do usuário)
CREATE TABLE public.treino_exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ficha_treino_id UUID NOT NULL REFERENCES public.fichas_treino(id) ON DELETE CASCADE,
    exercicio_id UUID NOT NULL REFERENCES public.exercicios(id) ON DELETE RESTRICT,
    ordem INT NOT NULL, -- Sequência de execução (1, 2, 3...)
    series INT DEFAULT 4 NOT NULL CHECK (series > 0),
    repeticoes VARCHAR(30) DEFAULT '12' NOT NULL, -- VARCHAR para permitir '10 a 12' ou 'FALHA'
    carga_kg DECIMAL(5,2) DEFAULT 0.0, -- Peso atual para rastreamento progressivo
    tempo_descanso_segundos INT DEFAULT 60 NOT NULL CHECK (tempo_descanso_segundos >= 0),
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(ficha_treino_id, ordem) -- Evita conflitos de ordem na ficha
);

-- 5.1 TABELA DE HISTÓRICO DE PESO (Acompanhamento antropométrico)
CREATE TABLE public.historico_peso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    peso_kg DECIMAL(5,2) NOT NULL CHECK (peso_kg > 0),
    data_registro DATE DEFAULT CURRENT_DATE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5.2 TABELA DE REGISTRO DE ÁGUA (Controle diário de hidratação)
CREATE TABLE public.registro_agua (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    quantidade_ml INT NOT NULL CHECK (quantidade_ml > 0),
    data_registro DATE DEFAULT CURRENT_DATE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 6. POLÍTICAS DE SEGURANÇA DE LINHA (ROW LEVEL SECURITY - RLS)
-- ====================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fichas_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treino_exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_peso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registro_agua ENABLE ROW LEVEL SECURITY;

-- Políticas para 'usuarios'
CREATE POLICY "Usuários podem visualizar seu próprio perfil" 
    ON public.usuarios FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
    ON public.usuarios FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Inserção automática via Trigger de Auth" 
    ON public.usuarios FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para 'exercicios' (Todos autenticados leem o catálogo, apenas admins modificam)
CREATE POLICY "Qualquer usuário autenticado pode ler os exercícios" 
    ON public.exercicios FOR SELECT TO authenticated USING (true);

-- Políticas para 'fichas_treino' (Usuário só gerencia suas fichas)
CREATE POLICY "Usuários veem suas próprias fichas" 
    ON public.fichas_treino FOR SELECT 
    USING (usuario_id = auth.uid());

CREATE POLICY "Usuários criam suas próprias fichas" 
    ON public.fichas_treino FOR INSERT 
    WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários atualizam suas próprias fichas" 
    ON public.fichas_treino FOR UPDATE 
    USING (usuario_id = auth.uid());

CREATE POLICY "Usuários deletam suas próprias fichas" 
    ON public.fichas_treino FOR DELETE 
    USING (usuario_id = auth.uid());

-- Políticas para 'treino_exercicios' (Acesso baseado na posse da ficha_treino)
CREATE POLICY "Usuários veem exercícios de suas fichas" 
    ON public.treino_exercicios FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.fichas_treino f 
            WHERE f.id = treino_exercicios.ficha_treino_id AND f.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Usuários inserem exercícios em suas fichas" 
    ON public.treino_exercicios FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.fichas_treino f 
            WHERE f.id = ficha_treino_id AND f.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Usuários editam exercícios de suas fichas" 
    ON public.treino_exercicios FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.fichas_treino f 
            WHERE f.id = treino_exercicios.ficha_treino_id AND f.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Usuários deletam exercícios de suas fichas" 
    ON public.treino_exercicios FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.fichas_treino f 
            WHERE f.id = treino_exercicios.ficha_treino_id AND f.usuario_id = auth.uid()
        )
    );

-- Políticas para 'historico_peso' (Controle antropométrico)
CREATE POLICY "Usuários veem seu próprio histórico de peso" 
    ON public.historico_peso FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Usuários inserem seu próprio peso" 
    ON public.historico_peso FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários deletam seu próprio peso" 
    ON public.historico_peso FOR DELETE USING (usuario_id = auth.uid());

-- Políticas para 'registro_agua' (Controle hídrico)
CREATE POLICY "Usuários veem seu próprio registro de água" 
    ON public.registro_agua FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Usuários inserem seu próprio registro de água" 
    ON public.registro_agua FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários deletam seu próprio registro de água" 
    ON public.registro_agua FOR DELETE USING (usuario_id = auth.uid());

-- ====================================================================
-- 7. ÍNDICES DE PERFORMANCE PARA CONSULTAS RÁPIDAS (OTIMIZAÇÃO DO APP)
-- ====================================================================
CREATE INDEX idx_usuarios_objetivo ON public.usuarios(objetivo);
CREATE INDEX idx_fichas_treino_usuario ON public.fichas_treino(usuario_id);
CREATE INDEX idx_treino_exercicios_ficha ON public.treino_exercicios(ficha_treino_id);
CREATE INDEX idx_exercicios_grupo ON public.exercicios(grupo_muscular);
CREATE INDEX idx_historico_peso_usuario ON public.historico_peso(usuario_id);
CREATE INDEX idx_registro_agua_usuario ON public.registro_agua(usuario_id);

-- ====================================================================
-- 8. TRIGGER DE CRIAÇÃO AUTOMÁTICA DE PERFIL (AUTH -> PUBLIC)
-- Sincroniza o Auth do Supabase com nossa tabela de usuários públicos
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (id, nome, objetivo, local_treino, dias_por_semana, peso_kg)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'nome', 'Atleta PersonalPessoal'), 
        'ganhar_massa', -- Objetivo padrão
        'academia',     -- Local padrão
        4,              -- Dias padrão
        70.0            -- Peso padrão
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 9. POPULAR CATÁLOGO INICIAL DE EXERCÍCIOS (SEED DATA)
-- ====================================================================
INSERT INTO public.exercicios (nome, grupo_muscular, equipamento, dificuldade, descricao) VALUES
('Flexão de Braço', 'Peitoral', 'peso_corporal', 'iniciante', 'Apoie as mãos no chão alinhadas ao ombro e desça flexionando os cotovelos.'),
('Supino Reto', 'Peitoral', 'barra', 'intermediario', 'Deitado no banco reto, empurre a barra verticalmente até estender os braços.'),
('Agachamento Livre', 'Quadríceps', 'peso_corporal', 'iniciante', 'Flexione quadril e joelhos como se fosse sentar em uma cadeira, mantendo a coluna ereta.'),
('Agachamento com Halteres', 'Quadríceps', 'halteres', 'intermediario', 'Segure halteres ao lado do corpo e realize o agachamento livre.'),
('Remada Unilateral (Serrote)', 'Costas', 'halteres', 'iniciante', 'Incline o tronco à frente apoiando uma mão no banco e puxe o halter até o quadril.'),
('Puxada na Polia Alta', 'Costas', 'maquina', 'iniciante', 'Puxe a barra em direção à parte superior do peito contraindo as escápulas.'),
('Desenvolvimento com Halteres', 'Ombros', 'halteres', 'intermediario', 'Sentado, empurre os halteres para cima a partir da linha das orelhas.'),
('Elevação Lateral', 'Ombros', 'halteres', 'iniciante', 'Segure halteres e eleve os braços lateralmente até a linha dos ombros.'),
('Rosca Direta', 'Bíceps', 'barra', 'iniciante', 'Flexione os cotovelos trazendo a barra em direção aos ombros, sem mover os cotovelos à frente.'),
('Tríceps Banco', 'Tríceps', 'peso_corporal', 'iniciante', 'Apoie as mãos em um banco atrás do corpo e desça flexionando os cotovelos.'),
('Abdominal Supra', 'Abdominais', 'peso_corporal', 'iniciante', 'Deitado de costas, flexione o tronco aproximando as costelas do quadril.');
`;
