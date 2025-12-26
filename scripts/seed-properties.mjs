import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { properties } from '../drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const sampleProperties = [
  {
    title: "Mansão de Luxo no Lago Sul",
    description: "Magnífica mansão com vista panorâmica para o Lago Paranoá. Projeto arquitetônico exclusivo com acabamentos de primeira linha, piscina infinity, sauna, home theater e amplo jardim paisagístico. Perfeita para quem busca privacidade e sofisticação.",
    propertyType: "casa",
    transactionType: "venda",
    salePrice: 850000000, // R$ 8.500.000
    bedrooms: 6,
    bathrooms: 8,
    parkingSpaces: 6,
    totalArea: 1200,
    address: "SHIS QL 10 Conjunto 5",
    neighborhood: "Lago Sul",
    city: "Brasília",
    state: "DF",
    zipCode: "71630-055",
    status: "disponivel",
    isFeatured: true,
    referenceCode: "LS-001",
    mainImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Cobertura Duplex no Sudoeste",
    description: "Cobertura duplex de alto padrão com 360° de vista. Amplo terraço gourmet com piscina privativa, churrasqueira e jardim vertical. Acabamentos em mármore e madeira nobre, automação completa e 4 suítes master.",
    propertyType: "cobertura",
    transactionType: "venda",
    salePrice: 420000000, // R$ 4.200.000
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 4,
    totalArea: 450,
    address: "SQSW 300 Bloco A",
    neighborhood: "Sudoeste",
    city: "Brasília",
    state: "DF",
    zipCode: "70673-401",
    status: "disponivel",
    isFeatured: true,
    referenceCode: "SW-002",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Casa Moderna no Park Way",
    description: "Residência contemporânea em condomínio fechado de alto padrão. Arquitetura moderna com amplos espaços integrados, pé-direito duplo, piscina aquecida, quadra de tênis e área de lazer completa. Segurança 24h.",
    propertyType: "casa",
    transactionType: "venda",
    salePrice: 620000000, // R$ 6.200.000
    bedrooms: 5,
    bathrooms: 6,
    parkingSpaces: 5,
    totalArea: 850,
    address: "Condomínio Park Way",
    neighborhood: "Park Way",
    city: "Brasília",
    state: "DF",
    zipCode: "71750-000",
    status: "disponivel",
    isFeatured: true,
    referenceCode: "PW-003",
    mainImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Apartamento de Luxo no Lago Norte",
    description: "Apartamento sofisticado com vista privilegiada. Planta inteligente com ambientes amplos e integrados, varanda gourmet, 3 suítes com closet, cozinha planejada e 2 vagas de garagem. Condomínio com infraestrutura completa.",
    propertyType: "apartamento",
    transactionType: "venda",
    salePrice: 280000000, // R$ 2.800.000
    bedrooms: 3,
    bathrooms: 4,
    parkingSpaces: 2,
    totalArea: 220,
    address: "SHIN QL 10 Conjunto 3",
    neighborhood: "Lago Norte",
    city: "Brasília",
    state: "DF",
    zipCode: "71520-300",
    status: "disponivel",
    isFeatured: false,
    referenceCode: "LN-004",
    mainImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Casa de Alto Padrão no Noroeste",
    description: "Residência exclusiva em localização nobre. Design contemporâneo com linhas retas, grandes janelas de vidro, piscina com borda infinita, espaço gourmet e jardim zen. Acabamentos premium e tecnologia de ponta.",
    propertyType: "casa",
    transactionType: "venda",
    salePrice: 520000000, // R$ 5.200.000
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 4,
    totalArea: 650,
    address: "SQNW 107 Bloco B",
    neighborhood: "Noroeste",
    city: "Brasília",
    state: "DF",
    zipCode: "70687-200",
    status: "disponivel",
    isFeatured: true,
    referenceCode: "NW-005",
    mainImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Cobertura Triplex Lago Sul",
    description: "Cobertura triplex única com elevador privativo. Rooftop com piscina aquecida, sauna, bar e lounge. Vista espetacular 360°. 5 suítes master, home office, adega climatizada e garagem para 8 carros. Puro luxo e exclusividade.",
    propertyType: "cobertura",
    transactionType: "venda",
    salePrice: 950000000, // R$ 9.500.000
    bedrooms: 5,
    bathrooms: 7,
    parkingSpaces: 8,
    totalArea: 680,
    address: "SHIS QL 12 Conjunto 1",
    neighborhood: "Lago Sul",
    city: "Brasília",
    state: "DF",
    zipCode: "71630-125",
    status: "disponivel",
    isFeatured: true,
    referenceCode: "LS-006",
    mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Apartamento Moderno no Sudoeste",
    description: "Apartamento de 3 quartos com acabamento impecável. Living amplo com varanda integrada, cozinha gourmet, suíte master com banheira, closet e vista panorâmica. Condomínio com piscina, academia e salão de festas.",
    propertyType: "apartamento",
    transactionType: "locacao",
    rentPrice: 1200000, // R$ 12.000/mês
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    totalArea: 180,
    address: "SQSW 304 Bloco C",
    neighborhood: "Sudoeste",
    city: "Brasília",
    state: "DF",
    zipCode: "70673-403",
    status: "disponivel",
    isFeatured: false,
    referenceCode: "SW-007",
    mainImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Casa Térrea com Piscina - Park Way",
    description: "Casa térrea aconchegante em condomínio fechado. Área de lazer completa com piscina, churrasqueira e forno de pizza. 4 suítes, escritório, despensa e lavanderia. Jardim arborizado e garagem coberta para 3 carros.",
    propertyType: "casa",
    transactionType: "venda",
    salePrice: 380000000, // R$ 3.800.000
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 3,
    totalArea: 480,
    address: "Condomínio Vivendas Park Way",
    neighborhood: "Park Way",
    city: "Brasília",
    state: "DF",
    zipCode: "71750-000",
    status: "disponivel",
    isFeatured: false,
    referenceCode: "PW-008",
    mainImage: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop"
    ])
  },
  {
    title: "Apartamento Compacto no Noroeste",
    description: "Apartamento moderno e funcional. Planta otimizada com 2 quartos sendo 1 suíte, sala com varanda, cozinha americana e 1 vaga. Perfeito para jovens profissionais ou investimento. Localização privilegiada próximo ao metrô.",
    propertyType: "apartamento",
    transactionType: "locacao",
    rentPrice: 650000, // R$ 6.500/mês
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    totalArea: 85,
    address: "SQNW 109 Bloco D",
    neighborhood: "Noroeste",
    city: "Brasília",
    state: "DF",
    zipCode: "70687-400",
    status: "disponivel",
    isFeatured: false,
    referenceCode: "NW-009",
    mainImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop"
    ])
  }
];

console.log('🏠 Inserindo imóveis de exemplo...');

for (const property of sampleProperties) {
  await db.insert(properties).values(property);
  console.log(`✅ ${property.title}`);
}

console.log(`\n✨ ${sampleProperties.length} imóveis inseridos com sucesso!`);

await connection.end();
