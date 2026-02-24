# RAG & Semantic Patterns

Retrieval Augmented Generation (RAG) is the pattern of giving an LLM access to external knowledge stored in Pinecone.

## 1. Chunking Strategy
Don't embed entire files. Break them into smaller pieces for better relevance.

- **Fixed-size**: 500-1000 tokens with 10% overlap.
- **Semantic**: Split by paragraph or section headers.
- **Recursive**: Use tools like LangChain's `RecursiveCharacterTextSplitter`.

## 2. Embedding Selection (Semantic Compression)
The "compression" happens here. Use modern, dense embedding models:
- `text-embedding-3-small` (Cheap, 1536 dim)
- `text-embedding-3-large` (Precise, 3072 dim)

## 3. Hybrid Search
Combines Keyword search (Sparse) + Semantic search (Dense).

```python
# Conceptual Hybrid Search
# Requires an index configured with 'dotproduct' or 'cosine' 
# and sparse-capable embeddings (like SPLADE or BM25).

results = index.query(
    vector=dense_vector,
    sparse_vector=sparse_vector,
    top_k=10
)
```

## 4. Grounding (The "Healing" Pattern)
Use retrieved context to fix hallucinations and provide factual answers.

```python
# Build the prompt
context = "\n".join([match.metadata['text'] for match in search_results])
prompt = f"Using ONLY the context below, answer the question:\n\n{context}\n\nQuestion: {query}"
```
