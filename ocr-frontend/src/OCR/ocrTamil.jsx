// src/OCR.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set the workerSrc for pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`;

const OCR = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null); // Holds the PDF data for rendering

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setText('');
        setPdfData(null); // Clear PDF data when a new file is selected
    };

    const extractTextFromPDF = async (file) => {
        setIsLoading(true);
        setText('');
        try {
            // Load the PDF
            const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;

            let fullText = '';

            // Loop through each page
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);

                // Render the page to a canvas
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                // Convert canvas to an image and run OCR
                const imageData = canvas.toDataURL('image/png');
                const { data: { text } } = await Tesseract.recognize(
                    imageData,
                    'tam', // Use Tamil language code
                    {
                        logger: (m) => console.log(m)
                    }
                );
                fullText += text + '\n';
            }

            setText(fullText);
            setPdfData(URL.createObjectURL(file)); // Set PDF URL for rendering
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing the PDF.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            extractTextFromPDF(selectedFile);
        } else {
            alert('Please select a file first.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">OCR App</h1>
            <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange} 
                className="border border-gray-300 p-2 rounded-md mb-4"
            />
            <button 
                onClick={handleFileUpload} 
                disabled={isLoading} 
                className={`bg-blue-500 text-white p-2 rounded-md ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
            >
                {isLoading ? 'Processing...' : 'Upload'}
            </button>

            <div className="flex mt-4 space-x-4">
                {/* PDF Viewer on the Left */}
                <div className="flex-1">
                    <h2 className="text-xl font-medium mb-2">PDF Preview</h2>
                    {pdfData && (
                        <iframe
                            src={pdfData}
                            width="100%"
                            height="500px"
                            title="PDF Preview"
                            frameBorder="0"
                        />
                    )}
                </div>

                {/* Extracted Text on the Right */}
                <div className="flex-1">
                    <h2 className="text-xl font-medium mb-2">Extracted Text</h2>
                    <textarea
                        value={text}
                        readOnly
                        rows="20"
                        cols="50"
                        placeholder="Extracted text will appear here..."
                        className="border border-gray-300 p-2 rounded-md w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default OCR;
