import { FoodReplacement } from '../types';

export const foodReplacements: FoodReplacement[] = [
  {
    original: 'Peito de Frango (Grelhado)',
    originalProtein: '31g prot / 100g',
    originalPrice: 'medio',
    substitute: 'Ovos Inteiros',
    substituteProtein: '6g prot / unidade',
    substitutePrice: 'baixo',
    ratio: '100g de peito de frango = ~4 a 5 ovos inteiros ou 7 claras',
    savingTip: 'Compre cartelas de 30 ovos em feiras locais, distribuidoras ou atacados para reduzir o custo unitário em até 40%.',
    category: 'proteina'
  },
  {
    original: 'Suplemento Whey Protein',
    originalProtein: '24g prot / dose (30g)',
    originalPrice: 'alto',
    substitute: 'Proteína Texturizada de Soja (PTS)',
    substituteProtein: '50g prot / 100g',
    substitutePrice: 'muito_baixo',
    ratio: '30g de Whey = ~50g de PTS hidratada e temperada',
    savingTip: 'A PTS é um dos quilos de proteína mais baratos do mercado. Compre a granel em lojas de produtos naturais e tempere bem com limão, alho e páprica.',
    category: 'proteina'
  },
  {
    original: 'Carne Vermelha Moída (Patinho)',
    originalProtein: '26g prot / 100g',
    originalPrice: 'alto',
    substitute: 'Sardinha em Conserva (Óleo/Tomate)',
    substituteProtein: '24g prot / 100g',
    substitutePrice: 'baixo',
    ratio: '100g de Patinho = ~1 lata de sardinha escorrida',
    savingTip: 'A sardinha enlatada, além de barata, é riquíssima em Ômega-3 e Cálcio. Pode ser consumida fria ou refogada com cebola para comer com arroz ou pão.',
    category: 'proteina'
  },
  {
    original: 'Salmão Grelhado',
    originalProtein: '23g prot / 100g',
    originalPrice: 'alto',
    substitute: 'Atum Ralado em Lata',
    substituteProtein: '23g prot / 100g',
    substitutePrice: 'medio',
    ratio: '100g de Salmão = ~1 lata de atum',
    savingTip: 'Compre atum ralado em conserva de água em vez de óleo (menos calórico) em kits de promoção em supermercados de atacado.',
    category: 'proteina'
  },
  {
    original: 'Batata Doce Roxa (Modismo)',
    originalProtein: '2g prot / 20g carbo',
    originalPrice: 'medio',
    substitute: 'Mandioca / Aipim Cozido',
    substituteProtein: '1g prot / 30g carbo',
    substitutePrice: 'baixo',
    ratio: '100g Batata Doce = ~80g de Mandioca Cozida',
    savingTip: 'A mandioca costuma ser extremamente barata nas safras locais e fornece excelente energia de liberação lenta para treinos intensos.',
    category: 'carbo'
  },
  {
    original: 'Arroz Negro ou Integral',
    originalProtein: '3g prot / 25g carbo',
    originalPrice: 'medio',
    substitute: 'Arroz Branco com Casca de Abóbora',
    substituteProtein: '2g prot / 28g carbo',
    substitutePrice: 'muito_baixo',
    ratio: 'Substitua arroz integral por arroz branco enriquecido com legumes picados',
    savingTip: 'Arroz branco é mais barato. Ao adicionar vegetais ralados (abobrinha, cenoura, brócolis) você ganha a mesma quantidade de fibras e micronutrientes por um custo menor.',
    category: 'carbo'
  },
  {
    original: 'Pasta de Amendoim Importada',
    originalProtein: '7g prot / 16g gord',
    originalPrice: 'medio',
    substitute: 'Amendoim Cru Torrado a Granel',
    substituteProtein: '26g prot / 49g gord (por 100g)',
    substitutePrice: 'baixo',
    ratio: '30g pasta importada = 30g de amendoim torrado moído',
    savingTip: 'Compre amendoim cru com casca a granel. Torre no forno de casa e bata no liquidificador potente por 5 minutos até virar uma pasta natural sem adição de óleos.',
    category: 'gordura'
  },
  {
    original: 'Azeite de Oliva Extra Virgem',
    originalProtein: '0g prot / 99g gord',
    originalPrice: 'alto',
    substitute: 'Sementes de Girassol ou Gergelim',
    substituteProtein: '20g prot / 50g gord (por 100g)',
    substitutePrice: 'baixo',
    ratio: '1 colher de sopa de azeite = ~25g de semente de girassol',
    savingTip: 'As sementes de girassol descascadas custam uma fração do preço do azeite, são ricas em gorduras monoinsaturadas saudáveis, magnésio e zinco.',
    category: 'gordura'
  }
];
