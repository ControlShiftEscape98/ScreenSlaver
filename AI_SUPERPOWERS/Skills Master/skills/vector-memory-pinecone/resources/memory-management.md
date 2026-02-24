# Memory Management Strategies

How to structure your data in Pinecone for effective AI memory.

## 1. Namespace Isolation
Use namespaces to separate users, sessions, or project domains. This keeps the search context focused and secure.
- `namespace: user_42`
- `namespace: glido_docs`
- `namespace: code_summaries`

## 2. Metadata Filtering
Store high-level attributes in metadata to allow for hybrid search (e.g., "Find all memories about *React* from *last week*").

```python
results = index.query(
    vector=query_vec,
    filter={
        "category": {"$eq": "coding"},
        "date": {"$gt": 20240101}
    },
    top_k=5
)
```

## 3. Memory Refresh (TTL)
Vector databases can get "noisy" over time.
- **Sliding Window**: Retrieve the most recent N vectors.
- **Weighting**: Combine similarity score with a recency score.
- **Pruning**: Delete old or low-relevance vectors periodically.

## 4. The "Second Brain" Layout
Store different data types to facilitate complex reasoning:
1. **Facts**: Atomic pieces of information.
2. **Context**: Larger blocks of background knowledge.
3. **Decisions**: Past logic trails and user preferences.
4. **Skills/Workflows**: Compressed versions of `SKILL.md` for fast retrieval.
