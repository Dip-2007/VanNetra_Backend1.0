import { useState } from "react";

const OcrProcessor = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processedText, setProcessedText] = useState("");
  const [extractedEntities, setExtractedEntities] = useState(null);
  const [activeTab, setActiveTab] = useState("ocr");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "application/pdf")
    ) {
      setFile(selectedFile);

      if (selectedFile.type.includes("image")) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl("/images/PDFDocument.jpg");
      }

      setProcessedText("");
      setExtractedEntities(null);
    }
  };

  /**
   * Sends the uploaded file to the backend for processing.
   */
  //... inside the processOCR function

  const processOCR = async () => {
    if (!file) return;

    setProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call backend
      const response = await fetch("/ocr-api/ocr/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      // Assuming backend returns something like:
      // { text: "...extracted...", entities: {...} }
      setProcessedText(result.text || "");
      setExtractedEntities(result.entities || null);
    } catch (error) {
      console.error("OCR processing failed:", error);
      alert("Failed to process document. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  //... rest of the function
  //////////////////////////////////////////////

  const exportToJSON = () => {
    if (!extractedEntities) return;

    const dataStr = JSON.stringify(extractedEntities, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileName = `fra_extracted_${new Date().getTime()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            AI Document Processing
          </h1>
          <p className="text-gray-600 mt-1">
            Upload and process Forest Rights Act documents using OCR and NER
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* File upload section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                {!file ? (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">
                      Drag and drop a file or click to browse
                    </p>
                    <p className="text-sm text-gray-400">
                      Supported formats: JPG, PNG
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      {previewUrl && previewUrl.includes("data:image") ? (
                        <img
                          src={previewUrl}
                          alt="Document preview"
                          className="max-h-40 mx-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 font-medium">{file.name}</p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                          setProcessedText("");
                          setExtractedEntities(null);
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        Remove
                      </button>
                      <button
                        onClick={processOCR}
                        disabled={processing}
                        className={`px-4 py-1 text-sm text-white rounded-md ${
                          processing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {processing ? "Processing..." : "Process Document"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 mt-6 md:mt-0">
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <h3 className="font-medium text-gray-700 mb-2">
                  Processing Pipeline:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li
                    className={`p-2 rounded-md ${file ? "bg-green-100" : ""}`}
                  >
                    Document Upload
                    {file && <span className="ml-2 text-green-600">✓</span>}
                  </li>
                  <li
                    className={`p-2 rounded-md ${
                      processedText ? "bg-green-100" : file ? "bg-blue-50" : ""
                    }`}
                  >
                    OCR Text Extraction
                    {processedText && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </li>
                  <li
                    className={`p-2 rounded-md ${
                      extractedEntities
                        ? "bg-green-100"
                        : processedText
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    NER Entity Recognition
                    {extractedEntities && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </li>
                  <li
                    className={`p-2 rounded-md ${
                      extractedEntities ? "bg-blue-50" : ""
                    }`}
                  >
                    JSON Export & Database Integration
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Results section */}
        {(processedText || extractedEntities) && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Processing Results</h2>

            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "ocr"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("ocr")}
                >
                  OCR Text
                </button>
                <button
                  className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === "ner"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("ner")}
                >
                  Extracted Entities
                </button>
              </nav>
            </div>

            <div className="mt-4">
              {activeTab === "ocr" && (
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                    {processedText || "No text extracted."}
                  </div>
                </div>
              )}

              {activeTab === "ner" && extractedEntities && (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={exportToJSON}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Export as JSON
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(extractedEntities).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center capitalize">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {key}
                        </h4>
                        {Array.isArray(value) && value.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {value.map((item, index) => (
                              <li key={index} className="text-gray-600">
                                {typeof item === "object"
                                  ? `${item.type}: ${item.name}`
                                  : item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">
                            No {key} extracted
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OcrProcessor;
