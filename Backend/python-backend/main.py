from fastapi import FastAPI, File, UploadFile
from PIL import Image
import pytesseract
import torch
from transformers import pipeline

app = FastAPI()

# Load the NER pipeline from Hugging Face
ner_pipeline = pipeline("ner", model="dslim/bert-base-NER")

@app.post("/ocr/process")
async def process_ocr(file: UploadFile = File(...)):
    """
    Processes an uploaded image file to perform OCR and NER.
    """
    # Perform OCR using Tesseract
    image = Image.open(file.file)
    processed_text = pytesseract.image_to_string(image)

    # Perform NER using the Hugging Face pipeline
    ner_results = ner_pipeline(processed_text)

    # Process NER results to extract entities
    extracted_entities = {
        "names": [],
        "locations": [],
        "organizations": [],
        "dates": [],
        "misc": []
    }
    for entity in ner_results:
        if entity['entity_group'] == 'PER':
            extracted_entities["names"].append(entity['word'])
        elif entity['entity_group'] == 'LOC':
            extracted_entities["locations"].append(entity['word'])
        elif entity['entity_group'] == 'ORG':
            extracted_entities["organizations"].append(entity['word'])
        elif entity['entity_group'] == 'MISC':
             # You might want to add more sophisticated date extraction logic here
            extracted_entities["misc"].append(entity['word'])

    return {
        "processedText": processed_text,
        "extractedEntities": extracted_entities
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)