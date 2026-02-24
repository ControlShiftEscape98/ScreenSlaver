# Pinecone Client Templates

Ready-to-use snippets for the 2025 Pinecone Serverless architecture.

## Python (pinecone-client)

**Install:** `pip install "pinecone[grpc]"`

```python
from pinecone import Pinecone, ServerlessSpec

# Initialize with API Key
pc = Pinecone(api_key="YOUR_API_KEY")

# Create a Serverless Index
index_name = "ai-memory"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536, # OpenAI embedding size
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

# Connect to index
index = pc.Index(index_name)

# Upsert (Store Memory)
index.upsert(
    vectors=[
        {
            "id": "doc_1", 
            "values": [0.1, 0.2, ...], # Your embedding here
            "metadata": {"text": "Original text here", "type": "fact"}
        }
    ],
    namespace="user-123"
)

# Search (Retrieve Memory)
query_response = index.query(
    namespace="user-123",
    vector=[0.1, 0.2, ...],
    top_k=5,
    include_metadata=True
)
```

## TypeScript (@pinecone-database/pinecone)

**Install:** `npm install @pinecone-database/pinecone`

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: 'YOUR_API_KEY' });

// Initialize index
const index = pc.index('ai-memory');

// Upsert
await index.namespace('user-123').upsert([
  {
    id: 'doc_1',
    values: [0.1, 0.2, ...],
    metadata: { text: 'Memory content here', category: 'workflow' }
  }
]);

// Search
const results = await index.namespace('user-123').query({
  vector: [0.1, 0.2, ...],
  topK: 5,
  includeMetadata: true
});
```

## Compression Tip: Product Quantization (PQ)
Pinecone handles internal vector compression automatically. To optimize for scale:
1. Use **Serverless** indexes (cheaper, handles compression automatically).
2. Choose **Cosine** similarity for text-based semantic search.
3. Store raw text in the `metadata` field, or store an ID that links to a primary DB (Postgres/Supabase) to keep the index lean.
