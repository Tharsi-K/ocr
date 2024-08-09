import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function OCR() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            Tesseract.recognize(
                selectedFile,
                'tam',  // Use the Tamil language code
                {
                    logger: (m) => console.log(m)
                }
            ).then(({ data: { text } }) => {
                setText(text);
            }).catch((error) => {
                console.error(error);
                alert("An error occurred while processing the image.");
            });
        }
    };

    return (
        <div className="text-center p-5">
            <h1 className="text-2xl font-bold mb-4">OCR App</h1>
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="mb-5"
            />
            <button 
                onClick={handleFileUpload} 
                className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-5"
            >
                Upload
            </button>
            <p className="whitespace-pre-wrap text-left mx-auto w-4/5 border border-gray-300 p-4 bg-gray-100">
                {text}
            </p>
        </div>
    );
}
