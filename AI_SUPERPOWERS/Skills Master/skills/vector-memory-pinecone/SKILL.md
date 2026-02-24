---
name: vector-memory-pinecone
description: Manages long-term vector memory, semantic search, and Retrieval Augmented Generation (RAG) using Pinecone. Use when the user requests "memory", "semantic search", "knowledge base", or "AI learning" capabilities.
---

# Pinecone Vector Memory Integration

This skill enables the agent to store and retrieve information using Pinecone's vector database, effectively providing the system with "long-term memory" and the ability to ground responses in large knowledge bases.

## When to Use This Skill

- Implementing **Retrieval Augmented Generation (RAG)** pipelines.
- Adding **long-term memory** to AI agents or applications.
- Building **semantic search** across documents, codebases, or chat history.
- "Compressing" data by storing semantic embeddings instead of raw text.
- Grounding AI responses in private or domain-specific data.

## Workflow & Safety

- [ ] Verify Pinecone connectivity (use `scripts/verify-pinecone.py`).
- [ ] Ensure `PINECONE_API_KEY` is present in the environment or `.env` file.
- [ ] Select appropriate embedding model (e.g., `text-embedding-3-small`).
- [ ] Design the index schema (dimension, metric - use `cosine` for text).
- [ ] Implement chunking strategy for long documents.
- [ ] Implement basic retrieval (Top-K) or Hybrid Search.

## Core Instructions

1. **Client Setup**: Use the Serverless SDKs for performance and ease of use. Reference templates in [client-templates.md](resources/client-templates.md).
2. **Data Compression (Embeddings)**: Convert text to vectors using an embedding model before upserting to Pinecone. Store only necessary metadata.
3. **Retrieval**: Use semantic search to find relevant context. Filter by metadata (namespace, type) to increase precision.
4. **Maintenance**: Periodically clean up or update vectors to prevent memory drift.

## Resources

- [Client Templates (Python/TS)](resources/client-templates.md)
- [RAG & Semantic Patterns](resources/rag-patterns.md)
- [Memory Management Strategies](resources/memory-management.md)
