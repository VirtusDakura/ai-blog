import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingsService } from './embeddings.service';
import { randomUUID } from 'crypto';

@Injectable()
export class SearchService {
    private readonly logger = new Logger(SearchService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly embeddingsService: EmbeddingsService,
    ) { }

    async search(query: string, limit: number = 5) {
        try {
            // 1. Generate embedding for the query
            const embedding = await this.embeddingsService.generateEmbedding(query);

            // 2. Format embedding for pgvector (string representation specific to pgvector if needed, 
            // but usually Prisma raw query handles string array '[...]' cast to vector)
            // Actually, passing it as a parameter with `::vector` cast works best.
            const vectorString = `[${embedding.join(',')}]`;

            // 3. Execute raw query using Cosine Similarity (<=> distance)
            // We diligently select the fields we need. 
            // Note: We join with Post to get the post title/slug if needed, 
            // but for now let's return the embedding/chunk info + postId
            const results = await this.prisma.$queryRaw`
        SELECT 
          e.id, 
          e."postId", 
          e.content, 
          1 - (e.vector <=> ${vectorString}::vector) as similarity
        FROM "embeddings" e
        ORDER BY e.vector <=> ${vectorString}::vector ASC
        LIMIT ${limit};
      `;

            return results;
        } catch (error) {
            this.logger.error('Error executing vector search', error);
            throw error;
        }
    }

    // Helper to store embedding (used by worker)
    async saveEmbedding(postId: string, content: string, vector: number[]) {
        // We must use executeRaw because Prisma Client doesn't support writing to Unsupported type directly yet in all versions
        // or at least it is safer for 'vector' type without 'TypedSql' preview.
        const vectorString = `[${vector.join(',')}]`;
        const id = crypto.randomUUID();

        await this.prisma.$executeRaw`
      INSERT INTO "embeddings" (id, "postId", content, vector, "createdAt")
      VALUES (${id}, ${postId}, ${content}, ${vectorString}::vector, NOW());
    `;

        return { id };
    }
}
