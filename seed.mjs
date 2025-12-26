import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🌱 Iniciando seed do banco de dados...');

// Limpar dados existentes (exceto users)
await db.delete(schema.properties);
await db.delete(schema.leads);
await db.delete(schema.interactions);
await db.delete(schema.blogPosts);
await db.delete(schema.blogCategories);
await db.delete(schema.siteSettings);

console.log('✅ Dados antigos removidos');

// Inserir configurações do site
await db.insert(schema.siteSettings).values({
  companyName: 'Corretor das Mansões',
  companyDescription: 'Consultoria imobiliária de luxo em Brasília. Especializado em imóveis de alto padrão com atendimento personalizado e exclusivo.',
  realtorName: 'Ernani Nunes',
  realtorBio: 'Corretor de imóveis com mais de 15 anos de experiência no mercado de luxo de Brasília. Especialista em propriedades de alto padrão, oferecendo atendimento personalizado e consultoria completa para compra e venda de imóveis exclusivos.',
  realtorCreci: '17921-DF',
  phone: '(61) 3254-4464',
  whatsapp: '(61) 99999-9999',
  email: 'ernanisimiao@hotmail.com',
  address: 'Brasília, DF',
  instagram: 'https://instagram.com/ernaninunes',
  facebook: 'https://facebook.com/ernaninunes',
  youtube: 'https://youtube.com/@ernaninunes',
  siteTitle: 'Corretor das Mansões - Ernani Nunes | Imóveis de Luxo em Brasília',
  siteDescription: 'Consultoria imobiliária de luxo em Brasília. Imóveis exclusivos com atendimento personalizado.',
  siteKeywords: 'imóveis de luxo, mansões, brasília, corretor, alto padrão',
});

console.log('✅ Configurações do site inseridas');

// Inserir categorias de blog
const categories = await db.insert(schema.blogCategories).values([
  {
    name: 'Mercado Imobiliário',
    slug: 'mercado-imobiliario',
    description: 'Novidades e tendências do mercado imobiliário de luxo',
  },
  {
    name: 'Dicas de Compra',
    slug: 'dicas-de-compra',
    description: 'Orientações para comprar seu imóvel dos sonhos',
  },
  {
    name: 'Investimentos',
    slug: 'investimentos',
    description: 'Como investir em imóveis de alto padrão',
  },
]);

console.log('✅ Categorias de blog inseridas');

// Inserir posts de blog
await db.insert(schema.blogPosts).values([
  {
    title: 'Como Escolher o Imóvel de Luxo Perfeito em Brasília',
    slug: 'como-escolher-imovel-luxo-brasilia',
    excerpt: 'Descubra os principais fatores a considerar ao buscar uma propriedade de alto padrão na capital.',
    content: '# Como Escolher o Imóvel de Luxo Perfeito em Brasília\n\nBrasília oferece diversas opções de imóveis de luxo...',
    categoryId: 2,
    authorId: 1,
    published: true,
    publishedAt: new Date('2024-01-15'),
    views: 245,
  },
  {
    title: 'Tendências do Mercado Imobiliário de Luxo em 2024',
    slug: 'tendencias-mercado-imobiliario-luxo-2024',
    excerpt: 'Conheça as principais tendências que estão moldando o mercado de imóveis de alto padrão.',
    content: '# Tendências do Mercado Imobiliário de Luxo em 2024\n\nO mercado de imóveis de luxo está em constante evolução...',
    categoryId: 1,
    authorId: 1,
    published: true,
    publishedAt: new Date('2024-02-01'),
    views: 189,
  },
]);

console.log('✅ Posts de blog inseridos');

// Inserir imóveis
await db.insert(schema.properties).values([
  {
    title: 'Mansão Moderna no Lago Sul',
    description: 'Espetacular mansão com vista para o lago, acabamento de primeira linha e projeto arquitetônico exclusivo. Amplos espaços, piscina infinita e área gourmet completa.',
    referenceCode: 'MLS-001',
    propertyType: 'casa',
    transactionType: 'venda',
    address: 'SHIS QL 10',
    neighborhood: 'Lago Sul',
    city: 'Brasília',
    state: 'DF',
    zipCode: '71630-105',
    salePrice: 850000000, // R$ 8.500.000,00
    bedrooms: 5,
    bathrooms: 6,
    suites: 4,
    parkingSpaces: 4,
    totalArea: 1200,
    builtArea: 800,
    features: JSON.stringify(['Piscina', 'Área Gourmet', 'Home Theater', 'Academia', 'Sauna', 'Jardim']),
    status: 'disponivel',
    featured: true,
    published: true,
    createdBy: 1,
  },
  {
    title: 'Cobertura Duplex no Sudoeste',
    description: 'Cobertura duplex com acabamento impecável, vista panorâmica e localização privilegiada. Projeto de interiores assinado, automação completa.',
    referenceCode: 'COB-002',
    propertyType: 'cobertura',
    transactionType: 'venda',
    address: 'SQSW 300',
    neighborhood: 'Sudoeste',
    city: 'Brasília',
    state: 'DF',
    zipCode: '70673-003',
    salePrice: 320000000, // R$ 3.200.000,00
    bedrooms: 4,
    bathrooms: 5,
    suites: 3,
    parkingSpaces: 3,
    totalArea: 450,
    builtArea: 380,
    features: JSON.stringify(['Piscina Privativa', 'Churrasqueira', 'Automação', 'Vista Panorâmica']),
    status: 'disponivel',
    featured: true,
    published: true,
    createdBy: 1,
  },
  {
    title: 'Casa de Alto Padrão no Park Way',
    description: 'Casa em condomínio fechado de alto padrão, com amplo terreno, jardim paisagístico e estrutura completa de lazer.',
    referenceCode: 'PKW-003',
    propertyType: 'casa',
    transactionType: 'venda',
    address: 'Condomínio Mansões Park Way',
    neighborhood: 'Park Way',
    city: 'Brasília',
    state: 'DF',
    zipCode: '71750-000',
    salePrice: 450000000, // R$ 4.500.000,00
    bedrooms: 4,
    bathrooms: 5,
    suites: 3,
    parkingSpaces: 4,
    totalArea: 2000,
    builtArea: 600,
    features: JSON.stringify(['Condomínio Fechado', 'Segurança 24h', 'Quadra de Tênis', 'Piscina']),
    status: 'disponivel',
    featured: true,
    published: true,
    createdBy: 1,
  },
  {
    title: 'Apartamento de Luxo no Setor Noroeste',
    description: 'Apartamento moderno com 3 suítes, varanda gourmet e vista livre. Prédio com infraestrutura completa.',
    referenceCode: 'NOR-004',
    propertyType: 'apartamento',
    transactionType: 'venda',
    address: 'SQNW 108',
    neighborhood: 'Noroeste',
    city: 'Brasília',
    state: 'DF',
    zipCode: '70687-083',
    salePrice: 180000000, // R$ 1.800.000,00
    bedrooms: 3,
    bathrooms: 4,
    suites: 3,
    parkingSpaces: 2,
    totalArea: 180,
    builtArea: 160,
    features: JSON.stringify(['Varanda Gourmet', 'Vista Livre', 'Piscina', 'Academia']),
    status: 'disponivel',
    featured: false,
    published: true,
    createdBy: 1,
  },
  {
    title: 'Mansão com Campo de Golfe Privativo',
    description: 'Propriedade única com campo de golfe privativo, heliponto e estrutura de resort. Perfeita para quem busca exclusividade absoluta.',
    referenceCode: 'GLF-005',
    propertyType: 'casa',
    transactionType: 'venda',
    address: 'Condomínio Privê',
    neighborhood: 'Jardim Botânico',
    city: 'Brasília',
    state: 'DF',
    zipCode: '71680-001',
    salePrice: 1200000000, // R$ 12.000.000,00
    bedrooms: 6,
    bathrooms: 8,
    suites: 5,
    parkingSpaces: 6,
    totalArea: 5000,
    builtArea: 1500,
    features: JSON.stringify(['Campo de Golfe', 'Heliponto', 'Casa de Hóspedes', 'Lago Privativo', 'Spa']),
    status: 'disponivel',
    featured: true,
    published: true,
    createdBy: 1,
  },
  {
    title: 'Apartamento para Locação no Lago Norte',
    description: 'Apartamento mobiliado de alto padrão, pronto para morar. Localização nobre e vista privilegiada.',
    referenceCode: 'LNR-006',
    propertyType: 'apartamento',
    transactionType: 'locacao',
    address: 'SHIN QL 12',
    neighborhood: 'Lago Norte',
    city: 'Brasília',
    state: 'DF',
    zipCode: '71525-200',
    rentPrice: 1500000, // R$ 15.000,00/mês
    bedrooms: 3,
    bathrooms: 3,
    suites: 2,
    parkingSpaces: 2,
    totalArea: 200,
    builtArea: 180,
    features: JSON.stringify(['Mobiliado', 'Vista para o Lago', 'Piscina', 'Salão de Festas']),
    status: 'disponivel',
    featured: false,
    published: true,
    createdBy: 1,
  },
]);

console.log('✅ Imóveis inseridos');

// Inserir leads
await db.insert(schema.leads).values([
  {
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    phone: '(61) 98888-1111',
    whatsapp: '(61) 98888-1111',
    source: 'site',
    stage: 'novo',
    buyerProfile: 'investidor',
    budgetMin: 200000000,
    budgetMax: 500000000,
    preferredNeighborhoods: JSON.stringify(['Lago Sul', 'Park Way']),
    preferredPropertyTypes: JSON.stringify(['casa', 'cobertura']),
    notes: 'Interessado em imóveis para investimento. Busca propriedades com potencial de valorização.',
    priority: 'alta',
    score: 85,
  },
  {
    name: 'Marina Oliveira',
    email: 'marina.oliveira@email.com',
    phone: '(61) 98888-2222',
    whatsapp: '(61) 98888-2222',
    source: 'instagram',
    stage: 'contato_inicial',
    buyerProfile: 'primeira_casa',
    budgetMin: 150000000,
    budgetMax: 250000000,
    preferredNeighborhoods: JSON.stringify(['Sudoeste', 'Noroeste']),
    preferredPropertyTypes: JSON.stringify(['apartamento']),
    notes: 'Primeira compra. Busca apartamento moderno e bem localizado.',
    priority: 'media',
    score: 70,
  },
  {
    name: 'Roberto Mendes',
    email: 'roberto.mendes@email.com',
    phone: '(61) 98888-3333',
    whatsapp: '(61) 98888-3333',
    source: 'portal_zap',
    stage: 'qualificado',
    buyerProfile: 'upgrade',
    budgetMin: 300000000,
    budgetMax: 600000000,
    preferredNeighborhoods: JSON.stringify(['Lago Sul', 'Lago Norte']),
    preferredPropertyTypes: JSON.stringify(['casa']),
    notes: 'Quer fazer upgrade da casa atual. Família com 2 filhos.',
    priority: 'alta',
    score: 90,
    lastContactedAt: new Date('2024-02-20'),
  },
  {
    name: 'Ana Paula Costa',
    email: 'ana.costa@email.com',
    phone: '(61) 98888-4444',
    source: 'whatsapp',
    stage: 'visita_agendada',
    buyerProfile: 'investidor',
    budgetMin: 400000000,
    budgetMax: 800000000,
    preferredNeighborhoods: JSON.stringify(['Lago Sul']),
    notes: 'Visita agendada para sábado às 10h. Interessada na mansão do Lago Sul.',
    priority: 'urgente',
    score: 95,
    lastContactedAt: new Date('2024-02-22'),
  },
  {
    name: 'Felipe Rodrigues',
    email: 'felipe.rodrigues@email.com',
    phone: '(61) 98888-5555',
    whatsapp: '(61) 98888-5555',
    source: 'google',
    stage: 'proposta',
    buyerProfile: 'upgrade',
    budgetMin: 250000000,
    budgetMax: 350000000,
    preferredNeighborhoods: JSON.stringify(['Sudoeste']),
    preferredPropertyTypes: JSON.stringify(['cobertura']),
    notes: 'Proposta enviada para a cobertura do Sudoeste. Aguardando retorno.',
    priority: 'urgente',
    score: 92,
    lastContactedAt: new Date('2024-02-23'),
  },
  {
    name: 'Juliana Santos',
    email: 'juliana.santos@email.com',
    phone: '(61) 98888-6666',
    source: 'indicacao',
    stage: 'novo',
    buyerProfile: 'curioso',
    notes: 'Apenas pesquisando. Sem urgência.',
    priority: 'baixa',
    score: 30,
  },
]);

console.log('✅ Leads inseridos');

console.log('🎉 Seed concluído com sucesso!');
process.exit(0);
