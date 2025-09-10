from fastapi import FastAPI, File, UploadFile
from PIL import Image
import pytesseract
import torch
from transformers import pipeline

# IMPORTANT: Update this path to where you installed Tesseract
# On Windows, it's typically in Program Files.
# The 'r' before the string is important on Windows to handle backslashes correctly.
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = FastAPI()

# Load the NER pipeline from Hugging Face
# This model will be downloaded the first time you run the script.
ner_pipeline = pipeline("ner", model="dslim/bert-base-NER")

@app.post("/ocr/process")
async def process_ocr(file: UploadFile = File(...)):
    """
    Processes an uploaded image file to perform OCR and NER.
    """
    try:
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
        
        current_entity_words = []
        current_entity_type = None

        for entity in ner_results:
            # BERT-based NER models often split words (e.g., "Washington" -> "Wash", "##ington")
            # This logic handles re-joining those words.
            if entity['entity'].startswith('B-'): # Beginning of a new entity
                if current_entity_type:
                    # Append the previously collected entity
                    entity_name = "".join(current_entity_words).replace("##", "")
                    if current_entity_type == 'PER' and entity_name not in extracted_entities["names"]:
                         extracted_entities["names"].append(entity_name)
                    elif current_entity_type == 'LOC' and entity_name not in extracted_entities["locations"]:
                        extracted_entities["locations"].append(entity_name)
                    elif current_entity_type == 'ORG' and entity_name not in extracted_entities["organizations"]:
                        extracted_entities["organizations"].append(entity_name)
                    elif current_entity_type == 'MISC' and entity_name not in extracted_entities["misc"]:
                        extracted_entities["misc"].append(entity_name)

                current_entity_words = [entity['word']]
                current_entity_type = entity['entity'][2:]
            elif entity['entity'].startswith('I-') and current_entity_type == entity['entity'][2:]:
                # Inside an entity, continue collecting words
                current_entity_words.append(entity['word'])
            else:
                 # Not part of the previous entity, so append what we have
                if current_entity_type:
                    entity_name = "".join(current_entity_words).replace("##", "")
                    if current_entity_type == 'PER' and entity_name not in extracted_entities["names"]:
                         extracted_entities["names"].append(entity_name)
                    elif current_entity_type == 'LOC' and entity_name not in extracted_entities["locations"]:
                        extracted_entities["locations"].append(entity_name)
                    elif current_entity_type == 'ORG' and entity_name not in extracted_entities["organizations"]:
                        extracted_entities["organizations"].append(entity_name)
                    elif current_entity_type == 'MISC' and entity_name not in extracted_entities["misc"]:
                        extracted_entities["misc"].append(entity_name)
                current_entity_words = []
                current_entity_type = None

        # Append the last entity if it exists
        if current_entity_type and current_entity_words:
            entity_name = "".join(current_entity_words).replace("##", "")
            if current_entity_type == 'PER' and entity_name not in extracted_entities["names"]:
                    extracted_entities["names"].append(entity_name)
            elif current_entity_type == 'LOC' and entity_name not in extracted_entities["locations"]:
                extracted_entities["locations"].append(entity_name)
            elif current_entity_type == 'ORG' and entity_name not in extracted_entities["organizations"]:
                extracted_entities["organizations"].append(entity_name)
            elif current_entity_type == 'MISC' and entity_name not in extracted_entities["misc"]:
                extracted_entities["misc"].append(entity_name)


        return {
            "processedText": processed_text,
            "extractedEntities": extracted_entities
        }
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


if __name__ == "__main__":
    import uvicorn
    # This will run the server on http://localhost:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)