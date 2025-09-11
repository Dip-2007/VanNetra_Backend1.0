from fastapi import FastAPI, File, UploadFile
import easyocr
from transformers import pipeline
import re
import os

# --------------------------
# Initialize FastAPI
# --------------------------
app = FastAPI(title="OCR + Multilingual NER API")

# --------------------------
# Initialize EasyOCR
# --------------------------
# Add 'hi' for Hindi, 'mr' for Marathi, 'en' for English
reader = easyocr.Reader(['en', 'hi', 'mr'])

# --------------------------
# Load NER model (Fine-tuned)
# --------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "ner-finetuned-multilingual")

# Check if model exists
if not os.path.exists(MODEL_PATH):
    raise RuntimeError(
        f"Model not found at {MODEL_PATH}. "
        "Please train or place your fine-tuned model here."
    )

ner_pipeline = pipeline(
    "ner",
    model=MODEL_PATH,
    aggregation_strategy="simple"  # merges subwords automatically
)

# --------------------------
# Helper function to clean OCR text
# --------------------------
def clean_text(text: str) -> str:
    """Remove extra symbols, multiple spaces, and fix line breaks."""
    text = re.sub(r'\s+', ' ', text)  # multiple spaces → single
    text = re.sub(r'[^\w\s:/-]', '', text)  # remove special chars except : / -
    return text.strip()

# --------------------------
# Helper function to chunk text
# --------------------------
def chunk_text(text: str, max_words=50) -> list:
    """Splits text into chunks of max_words each. Returns list of strings."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunk = " ".join(words[i:i+max_words])
        chunks.append(chunk)
    return chunks

# --------------------------
# OCR + NER Endpoint
# --------------------------
@app.post("/ocr/process")
async def process_ocr(file: UploadFile = File(...)):
    try:
        # Step 1: Save uploaded file temporarily
        contents = await file.read()
        temp_file = "temp_upload.jpg"
        with open(temp_file, "wb") as f:
            f.write(contents)

        # Step 2: OCR using EasyOCR
        results = reader.readtext(temp_file)
        raw_text = " ".join([res[1] for res in results])
        clean_ocr_text = clean_text(raw_text)

        # Step 3: Chunk the text for NER
        text_chunks = chunk_text(clean_ocr_text, max_words=50)

        # Step 4: Apply NER chunk by chunk
        aggregated_entities = {
            "names": [],
            "locations": [],
            "organizations": [],
            "misc": []
        }

        for chunk in text_chunks:
            ner_results = ner_pipeline(chunk)
            for entity in ner_results:
                label = entity["entity_group"]
                word = entity["word"]

                if label == "PER" and word not in aggregated_entities["names"]:
                    aggregated_entities["names"].append(word)
                elif label == "LOC" and word not in aggregated_entities["locations"]:
                    aggregated_entities["locations"].append(word)
                elif label == "ORG" and word not in aggregated_entities["organizations"]:
                    aggregated_entities["organizations"].append(word)
                elif label == "MISC" and word not in aggregated_entities["misc"]:
                    aggregated_entities["misc"].append(word)

        return {
            "text": clean_ocr_text,
            "entities": aggregated_entities
        }

    except Exception as e:
        return {"error": str(e)}

# --------------------------
# Run FastAPI (only if called directly)
# --------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
