import os
import sys

try:
    from pinecone import Pinecone
except ImportError:
    print("❌ pinecone-client not installed. Run: pip install pinecone-client")
    sys.exit(1)

def verify_pinecone():
    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        print("❌ Error: PINECONE_API_KEY environment variable not set.")
        return

    try:
        pc = Pinecone(api_key=api_key)
        indexes = pc.list_indexes()
        
        print(f"✅ Successfully connected to Pinecone!")
        print(f"Index Names: {[idx.name for idx in indexes]}")
        
    except Exception as e:
        print(f"❌ Error connecting to Pinecone: {str(e)}")

if __name__ == "__main__":
    verify_pinecone()
