export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  description: string;
  code?: string;
  children?: FileNode[];
}

export const projectFilesTree: FileNode = {
  name: 'gymdemocra-mobile',
  type: 'folder',
  description: 'Pasta raiz do projeto mobile React Native / Expo.',
  children: [
    {
      name: '.env',
      type: 'file',
      description: 'Variáveis de ambiente locais (guardadas em segredo). Não deve ser enviado ao Git.',
      code: `# Supabase Credentials
EXPO_PUBLIC_SUPABASE_URL=https://sua-url-supabase.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=seu-token-anonimo-jwt-do-supabase
`
    },
    {
      name: 'package.json',
      type: 'file',
      description: 'Dependências do projeto Expo, NativeWind e Supabase.',
      code: `{
  "name": "gymdemocra-mobile",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "ts:check": "tsc"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.21.0",
    "@supabase/supabase-js": "^2.39.8",
    "expo": "~51.0.0",
    "expo-router": "~3.5.14",
    "expo-status-bar": "~1.12.1",
    "lucide-react-native": "^0.368.0",
    "nativewind": "^2.0.11",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "tailwindcss": "^3.3.2",
    "typescript": "~5.3.3"
  },
  "private": true
}`
    },
    {
      name: 'tailwind.config.js',
      type: 'file',
      description: 'Configuração do Tailwind CSS / NativeWind para React Native.',
      code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ea580c", // Laranja motivacional moderno
        dark: "#121214", // Fundo cinza escuro moderno
        card: "#1e1e24", // Fundo do card
      },
    },
  },
  plugins: [],
}`
    },
    {
      name: 'app',
      type: 'folder',
      description: 'Diretório do Expo Router para gerenciamento de rotas e navegação por abas ou gaveta.',
      children: [
        {
          name: '_layout.tsx',
          type: 'file',
          description: 'Layout Raiz do Expo Router que configura o Provedor do Supabase Auth e tema geral.',
          code: `import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121214' }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1e1e24' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#121214' }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ title: 'Comece Agora', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}`
        },
        {
          name: 'index.tsx',
          type: 'file',
          description: 'Tela de entrada do App. Verifica se o usuário tem ficha de treino e redireciona.',
          code: `import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';

export default function EntryScreen() {
  const router = useRouter();

  useEffect(() => {
    // Escuta estado de login no Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Logado: redireciona para as abas do app
        router.replace('/(tabs)/treino');
      } else {
        // Deslogado: vai para a tela de login do Google
        router.replace('/(auth)/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-dark">
      <ActivityIndicator size="large" color="#ea580c" />
    </View>
  );
}`
        },
        {
          name: '(auth)',
          type: 'folder',
          description: 'Grupo de rotas de autenticação (Login com Google).',
          children: [
            {
              name: 'login.tsx',
              type: 'file',
              description: 'Tela de Login do Google integrada ao Supabase Auth usando fluxo nativo de ID Token.',
              code: `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Dumbbell } from 'lucide-react-native';

// Configura o Client ID de Web gerado no console Google Cloud
GoogleSignin.configure({
  webClientId: 'SEU_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com', // Necessário para Firebase e Supabase
  iosClientId: 'SEU_IOS_CLIENT_ID.apps.googleusercontent.com', // Necessário somente se rodar em iOS nativo
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      
      // 1. Abre o seletor nativo de contas do Google
      const { idToken } = await GoogleSignin.signIn();
      
      if (!idToken) {
        throw new Error('ID Token do Google não encontrado. Verifique as credenciais.');
      }

      // 2. Autentica no Supabase Auth usando o ID Token recebido
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;
      
      // O listener no RootLayout/index.tsx detectará a sessão e avançará para o app
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro no Google Login', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#121214] px-6">
      <View className="bg-orange-600/10 p-4 rounded-3xl border border-orange-500/20 mb-4">
        <Dumbbell size={40} color="#ea580c" />
      </View>
      <Text className="text-2xl font-black text-white text-center uppercase mb-1">
        Gym<Text className="text-primary">Democra</Text>
      </Text>
      <Text className="text-sm text-gray-400 text-center mb-8 max-w-[280px]">
        Sua conta fitness gratuita com login seguro do Google pelo Supabase Auth.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ea580c" />
      ) : (
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          className="w-full py-4 bg-white rounded-2xl flex-row items-center justify-center gap-3 shadow-lg active:scale-95"
        >
          <Text className="text-black font-bold text-base">Entrar com o Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}`
            }
          ]
        },
        {
          name: 'onboarding.tsx',
          type: 'file',
          description: 'Ficha de questionário médico/físico para quem acabou de criar a conta do Google.',
          code: `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';

export default function OnboardingScreen() {
  const router = useRouter();
  const [objective, setObjective] = useState('ganhar_massa');
  const [location, setLocation] = useState('academia');

  const handleFinish = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Salva o perfil no Supabase
      await supabase.from('usuarios').update({
        objetivo: objective,
        localizacao: location,
        onboarding_concluido: true
      }).eq('id', user.id);
    }
    router.replace('/(tabs)/treino');
  };

  return (
    <ScrollView className="flex-1 bg-dark px-6 py-10">
      <Text className="text-xl font-bold text-white mb-6">Qual seu objetivo?</Text>
      {/* Botões do questionário e salvamento no Supabase */}
    </ScrollView>
  );
}`
        },
        {
          name: '(tabs)',
          type: 'folder',
          description: 'Grupo de abas de navegação principal.',
          children: [
            {
              name: '_layout.tsx',
              type: 'file',
              description: 'Configura a navegação por Abas (Tabs) inferior usando Lucide icons.',
              code: `import { Tabs } from 'expo-router';
import { Dumbbell, Utensils } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#1e1e24', borderTopWidth: 0 },
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: '#8e8e93',
        headerStyle: { backgroundColor: '#1e1e24', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="treino"
        options={{
          title: 'Treino do Dia',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="alimentacao"
        options={{
          title: 'Alimentação',
          tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />
        }}
      />
    </Tabs>
  );
}`
            },
            {
              name: 'treino.tsx',
              type: 'file',
              description: 'Dashboard principal exibindo o treino do dia e o cronômetro de descanso.',
              code: `// Tela de Treinos que será vinculada ao Supabase`
            }
          ]
        }
      ]
    },
    {
      name: 'src',
      type: 'folder',
      description: 'Diretório contendo código-fonte estruturado de lógica reutilizável, conexões de API e componentes compartilhados.',
      children: [
        {
          name: 'lib',
          type: 'folder',
          description: 'Configurações de conexões externas e SDKs.',
          children: [
            {
              name: 'supabase.ts',
              type: 'file',
              description: 'Configuração e inicialização do Supabase Client com suporte ao AsyncStorage para persistência de login no celular.',
              code: `import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
`
            }
          ]
        },
        {
          name: 'components',
          type: 'folder',
          description: 'Componentes visuais reutilizáveis em todo o projeto.',
          children: [
            {
              name: 'Timer.tsx',
              type: 'file',
              description: 'Cronômetro de contagem regressiva embutido para intervalos.',
              code: `import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TimerProps {
  initialSeconds: number;
  onFinish?: () => void;
}

export function Timer({ initialSeconds, onFinish }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (onFinish) onFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <View className="bg-card p-4 rounded-xl border border-gray-800 items-center justify-center">
      <Text className="text-gray-400 font-medium mb-1">INTERVALO DE DESCANSO</Text>
      <Text className="text-4xl font-bold text-primary tracking-widest">{seconds}s</Text>
      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={() => setIsActive(!isActive)}
          className="bg-primary px-5 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">{isActive ? 'Pausar' : 'Iniciar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setIsActive(false); setSeconds(initialSeconds); }}
          className="bg-gray-700 px-5 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}`
            }
          ]
        }
      ]
    }
  ]
};
