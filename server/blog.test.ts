import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    name: "Test Admin",
    email: "admin@test.com",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Blog System", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let testPostId: number;
  let testCategoryId: number;

  beforeAll(async () => {
    // Criar caller com contexto de admin
    const ctx = createAdminContext();
    caller = appRouter.createCaller(ctx);

    // Criar categoria de teste com slug único
    const timestamp = Date.now();
    const category = await caller.blog.createCategory({
      name: "Teste",
      slug: `teste-${timestamp}`,
      description: "Categoria de teste",
    });
    testCategoryId = category.id;
  });

  afterAll(async () => {
    // Limpar dados de teste
    // Nota: testPostId já foi deletado no último teste
    // Categoria pode permanecer para futuros testes
  });

  it("deve criar um novo post", async () => {
    const post = await caller.blog.create({
      title: "Post de Teste",
      slug: "post-de-teste",
      excerpt: "Este é um post de teste",
      content: "Conteúdo completo do post de teste",
      categoryId: testCategoryId,
      published: false,
    });

    expect(post).toBeDefined();
    expect(post.id).toBeDefined();
    expect(post.title).toBe("Post de Teste");
    expect(post.slug).toBe("post-de-teste");
    expect(post.published).toBe(false);

    testPostId = post.id;
  });

  it("deve buscar post por ID", async () => {
    const post = await caller.blog.getById({ id: testPostId });

    expect(post).toBeDefined();
    expect(post?.id).toBe(testPostId);
    expect(post?.title).toBe("Post de Teste");
  });

  it("deve buscar post por slug", async () => {
    const post = await caller.blog.getPostBySlug({ slug: "post-de-teste" });

    expect(post).toBeDefined();
    expect(post?.id).toBe(testPostId);
    expect(post?.slug).toBe("post-de-teste");
  });

  it("deve atualizar um post", async () => {
    const result = await caller.blog.update({
      id: testPostId,
      data: {
        title: "Post Atualizado",
        content: "Conteúdo atualizado",
      },
    });

    expect(result.success).toBe(true);

    const updatedPost = await caller.blog.getById({ id: testPostId });
    expect(updatedPost?.title).toBe("Post Atualizado");
    expect(updatedPost?.content).toBe("Conteúdo atualizado");
  });

  it("deve listar todos os posts", async () => {
    const posts = await caller.blog.list();

    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("deve listar apenas posts publicados", async () => {
    // Publicar o post de teste
    await caller.blog.update({
      id: testPostId,
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });

    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);
    const posts = await publicCaller.blog.published({ limit: 10 });

    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
    
    // Verificar se todos os posts retornados estão publicados
    posts.forEach(post => {
      expect(post.published).toBe(true);
    });
  });

  it("deve listar categorias", async () => {
    const categories = await caller.blog.categories();

    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    
    const testCategory = categories.find(c => c.id === testCategoryId);
    expect(testCategory).toBeDefined();
    expect(testCategory?.name).toBe("Teste");
  });

  it("deve deletar um post", async () => {
    const result = await caller.blog.delete({ id: testPostId });

    expect(result.success).toBe(true);

    const deletedPost = await caller.blog.getById({ id: testPostId });
    expect(deletedPost).toBeNull();
  });
});
