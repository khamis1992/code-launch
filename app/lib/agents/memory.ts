export interface MemoryRecord {
  text: string;
  embedding: number[];
}

/**
 * Simple in-memory vector store. In a production system this could be backed
 * by an external vector database such as Pinecone or pgvector. For the
 * purposes of this repo we keep things in memory so tests can run deterministically.
 */
export class MemoryStore {
  private _store = new Map<string, MemoryRecord[]>();

  private _encode(text: string): number[] {
    const vec = [0, 0, 0];

    for (const ch of text) {
      const code = ch.charCodeAt(0);
      vec[0] += code;
      vec[1] += code % 101;
      vec[2] += code % 17;
    }

    return vec;
  }

  private _cosine(a: number[], b: number[]): number {
    const dot = a.reduce((acc, v, i) => acc + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((acc, v) => acc + v * v, 0));
    const magB = Math.sqrt(b.reduce((acc, v) => acc + v * v, 0));

    return magA && magB ? dot / (magA * magB) : 0;
  }

  add(sessionId: string, text: string) {
    const embedding = this._encode(text);
    const list = this._store.get(sessionId) ?? [];

    list.push({ text, embedding });
    this._store.set(sessionId, list);
  }

  search(sessionId: string, query: string, topK = 3): MemoryRecord[] {
    const list = this._store.get(sessionId) ?? [];
    const queryEmbedding = this._encode(query);

    return list
      .map((record) => ({ record, score: this._cosine(queryEmbedding, record.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((r) => r.record);
  }
}

export const globalMemory = new MemoryStore();
