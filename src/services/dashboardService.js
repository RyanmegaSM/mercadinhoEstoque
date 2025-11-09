import prisma from "../prisma/client.js";

class DashboardService {
  /**
   * Retorna a soma total das quantidades de todos os registros em `batchOnProducts`.
   * Ou seja, total de unidades em estoque considerando todos os lotes.
   * @returns {Promise<number>} total de unidades em estoque
   */
  async getTotalProducts() {
    const productsOnBatches = await prisma.batchOnProducts.findMany();
    const productCount = productsOnBatches.reduce(
      (acc, item) => acc + item.quantidade,
      0
    );

    return productCount;
  }

  /**
   * Calcula e retorna a soma do campo `preco` de todos os lotes (`batch`).
   * Representa o valor agregado (soma dos preços) dos lotes cadastrados.
   * @returns {Promise<number>} soma dos preços dos lotes
   */
  async getBatchAmount() {
    const batches = await prisma.batch.findMany();
    const totalAmount = batches.reduce((acc, item) => acc + item.preco, 0);
    return totalAmount;
  }

  /**
   *
   * @param {Date} limit
   * @returns
   */
  /**
   * Retorna lotes cuja validade seja menor ou igual ao `limit` fornecido.
   * - Inclui dados do fornecedor e dos produtos relacionados (omitindo campos sensíveis).
   * - Ordena os lotes por validade ascendente.
   * - Retorna um objeto com `total` (quantidade de lotes) e `batches` formatados:
   *   cada lote com id, validade, nome do fornecedor e lista de produtos (id, nome, quantidade).
   *
   * Observação: a variável `today` é definida mas não é usada na lógica atual.
   *
   * @param {Date} limit data limite (inclusive) para validade dos lotes
   * @returns {Promise<{total:number, batches: Array}>} resumo dos lotes expirando
   */
  async getExpiringBatches(limit) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const batches = await prisma.batch.findMany({
      where: {
        validade: {
          lte: limit,
        },
      },
      omit: {
        preco: true,
        quantidade: true,
        fornecedorId: true,
      },
      include: {
        fornecedor: {
          omit: {
            cnpj: true,
            telefone: true,
            endereco: true,
          },
        },
        BatchOnProducts: {
          omit: {
            produtoId: true,
            loteId: true,
          },
          include: {
            produto: {
              omit: {
                descricao: true,
                precoUnitario: true,
              },
            },
          },
        },
      },
      orderBy: {
        validade: "asc",
      },
    });

    return {
      total: batches.length,
      batches: batches.map((item) => ({
        id: item.id,
        validade: item.validade,
        fornecedor: item.fornecedor.nome,
        produtos: item.BatchOnProducts.map((prod) => ({
          id: prod.produto.id,
          nome: prod.produto.nome,
          quantidade: prod.quantidade,
        })),
      })),
    };
  }

  /**
   * @param {number} threshold
   */
  /**
   * Busca produtos com estoque menor ou igual ao `threshold`.
   * - Usa `distinct: ["produtoId"]` para deduplicar por produto.
   * - Omite campos do produto que não são necessários.
   * - Retorna:
   *   - `products`: até os 3 primeiros produtos em baixo estoque (slice(0,3))
   *   - `total`: total de produtos encontrados abaixo do limiar.
   *
   * @param {number} threshold limite de quantidade para considerar baixo estoque
   * @returns {Promise<{products:Array, total:number}>}
   */
  async getLowStockProducts(threshold) {
    const products = await prisma.batchOnProducts.findMany({
      where: {
        quantidade: {
          lte: threshold,
        },
      },
      omit: {
        produtoId: true,
        loteId: true,
      },
      include: {
        produto: {
          omit: {
            descricao: true,
            precoUnitario: true,
            categoriaId: true,
          },
        },
      },
      distinct: ["produtoId"],
    });

    return {
      products: [...products.slice(0, 3)],
      total: products.length,
    };
  }

  /**
   * Gera um resumo de estoque por produto:
   * - Para cada produto distinto, retorna id, nome, quantidade total disponível,
   *   preço unitário em centavos e valor total (quantidade * preço unitário) em centavos.
   * - Usa `distinct: ["produtoId"]` para obter um registro por produto.
   * @returns {Promise<Array>} lista com resumo de estoque por produto
   */
  async getStockSummary() {
    const summary = await prisma.batchOnProducts.findMany({
      include: {
        produto: {
          select: {
            nome: true,
            precoUnitario: true,
          },
        },
      },
      distinct: ["produtoId"],
    });

    return summary.map((item) => ({
      id: item.produtoId,
      nome: item.produto.nome,
      totalQuantidade: item.quantidade,
      precoUnitarioCentavos: item.produto.precoUnitario,
      totalValorCentavos: item.quantidade * item.produto.precoUnitario,
    }));
  }
}

export default DashboardService;
