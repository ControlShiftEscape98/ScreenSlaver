import os
import json
import uuid

# Paths to index
PATHS = [
    "/Users/mac/Desktop/AI_SUPERPOWERS/Skills Master/skills",
    "/Users/mac/Downloads/superpowers-main/skills"
]

def chunk_text(text, max_chars=4000):
    chunks = []
    current_chunk = ""
    for line in text.split("\n"):
        if len(current_chunk) + len(line) + 1 > max_chars:
            chunks.append(current_chunk.strip())
            current_chunk = line + "\n"
        else:
            current_chunk += line + "\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

def extract_records():
    records = []
    for base_path in PATHS:
        if not os.path.exists(base_path):
            continue
            
        for root, dirs, files in os.walk(base_path):
            for file in files:
                if file.endswith((".md", ".html", ".txt")):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, base_path)
                    skill_name = rel_path.split(os.sep)[0]
                    
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                            
                        # Chunking
                        chunks = chunk_text(content)
                        for i, chunk in enumerate(chunks):
                            if not chunk: continue
                            
                            record_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{rel_path}_{i}"))
                            records.append({
                                "id": record_id,
                                "content": chunk, # This matches the fieldMap in Pinecone index
                                "skill": skill_name,
                                "file": rel_path,
                                "chunk_index": i,
                                "source": "AI_SUPERPOWERS" if "AI_SUPERPOWERS" in base_path else "superpowers-main"
                            })
                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")
    
    return records

if __name__ == "__main__":
    records = extract_records()
    print(json.dumps(records, indent=2))
