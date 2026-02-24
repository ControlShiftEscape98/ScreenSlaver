import argparse
import json
import sys

# AI Superpowers Second Brain - Semantic Query Tool
# This script defines the query structure for the 'ai-superpowers-brain' index.

def main():
    parser = argparse.ArgumentParser(description="Query the AI Superpowers Second Brain semantically.")
    parser.add_argument("query", type=str, help="Natural language query (e.g., 'how to handle errors')")
    parser.add_argument("--top-k", type=int, default=5, help="Number of results to return")
    parser.add_argument("--namespace", type=str, default="skills", help="Pinecone namespace to search")
    parser.add_argument("--index", type=str, default="ai-superpowers-brain", help="Pinecone index name")

    args = parser.parse_args()

    # Output query parameters in JSON format for the AI agent to pick up and execute
    # or for future integration with the Pinecone SDK.
    query_config = {
        "index": args.index,
        "namespace": args.namespace,
        "query": args.query,
        "top_k": args.top_k
    }

    print("--- QUERY CONFIGURATION ---")
    print(json.dumps(query_config, indent=2))
    print("---------------------------")
    print("\n[NOTE] As an AI Agent, I will execute the semantic search using my Pinecone tools based on these parameters.")

if __name__ == "__main__":
    main()
