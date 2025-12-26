import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const properties = [
  {
    title: 'Mansão Moderna no Lago Sul',
    description: 'Espetacular mansão contemporânea com vista privilegiada para o Lago Paranoá. Projeto arquitetônico exclusivo com acabamentos de primeira linha, amplos espaços integrados e área de lazer completa com piscina infinity, spa e academia.',
    type: 'casa',
    purpose: 'venda',
    salePrice: 950000000, // R$ 9.500.000
    bedrooms: 6,
    bathrooms: 8,
    area: 1200,
    address: 'SHIS QI 23',
    neighborhood: 'Lago Sul',
    zipCode: '71660-230',
    referenceCode: 'MAN-LS-001',
    status: 'disponivel',
    featured: true,
    images: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', order: 0 },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', order: 1 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', order: 2 }
    ])
  },
  {
    title: 'Cobertura Duplex no Sudoeste',
    description: 'Cobertura duplex de alto padrão com 4 suítes, terraço gourmet com churrasqueira e piscina privativa. Vista panorâmica da cidade, acabamento em mármore e automação completa. Localização privilegiada próxima ao Parque da Cidade.',
    type: 'apartamento',
    purpose: 'venda',
    salePrice: 480000000, // R$ 4.800.000
    bedrooms: 4,
    bathrooms: 5,
    area: 450,
    address: 'SQSW 304',
    neighborhood: 'Sudoeste',
    zipCode: '70673-404',
    referenceCode: 'COB-SW-002',
    status: 'disponivel',
    featured: true,
    images: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', order: 0 },
      { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200', order: 1 },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', order: 2 }
    ])
  },
  {
    title: 'Casa de Luxo no Park Way',
    description: 'Residência de luxo em condomínio fechado com segurança 24h. Terreno de 2.000m² com jardim paisagístico, piscina aquecida, quadra de tênis e casa de hóspedes. Perfeita para quem busca privacidade e contato com a natureza.',
    type: 'casa',
    purpose: 'venda',
    salePrice: 650000000, // R$ 6.500.000
    bedrooms: 5,
    bathrooms: 6,
    area: 800,
    address: 'Condomínio Vivendas Bela Vista',
    neighborhood: 'Park Way',
    zipCode: '71750-000',
    referenceCode: 'CAS-PW-003',
    status: 'disponivel',
    featured: true,
    images: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', order: 0 },
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200', order: 1 },
      { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200', order: 2 }
    ])
  },
  {
    title: 'Apartamento Premium no Lago Norte',
    description: 'Apartamento de alto padrão com 3 suítes, varanda gourmet e vista para o lago. Edifício exclusivo com apenas 2 apartamentos por andar, hall privativo, piscina coberta e aquecida, sauna e salão de festas.',
    type: 'apartamento',
    purpose: 'venda',
    salePrice: 320000000, // R$ 3.200.000
    bedrooms: 3,
    bathrooms: 4,
    area: 280,
    address: 'SHIN QL 10',
    neighborhood: 'Lago Norte',
    zipCode: '71520-100',
    referenceCode: 'APT-LN-004',
    status: 'disponivel',
    featured: true,
    images: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', order: 0 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', order: 1 },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200', order: 2 }
    ])
  },
  {
    title: 'Mansão Clássica no Noroeste',
    description: 'Residência de arquitetura clássica com detalhes em cantaria portuguesa. Pé-direito duplo, escadaria em mármore, biblioteca, adega climatizada e 5 vagas de garagem. Localização nobre próxima ao comércio e restaurantes.',
    type: 'casa',
    purpose: 'venda',
    salePrice: 280000000, // R$ 2.800.000
    bedrooms: 4,
    bathrooms: 5,
    area: 550,
    address: 'SQNW 108',
    neighborhood: 'Noroeste',
    zipCode: '70687-800',
    referenceCode: 'MAN-NW-005',
    status: 'disponivel',
    featured: true,
    images: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200', order: 0 },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200', order: 1 },
      { url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200', order: 2 }
    ])
  }
];

console.log('🏠 Inserindo imóveis de exemplo...');

for (const property of properties) {
  await db.insert(schema.properties).values(property);
  console.log(`✅ ${property.title} - ${property.referenceCode}`);
}

console.log('\n✨ 5 imóveis cadastrados com sucesso!');
console.log('📸 Todos marcados como destaque e com imagens do Unsplash');

await connection.end();
