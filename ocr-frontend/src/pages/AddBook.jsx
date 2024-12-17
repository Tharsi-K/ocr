import * as pdfjsLib from "pdfjs-dist";
import { useState } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable,} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js"; // Import Tesseract for OCR

export default function AddBook() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [formData, setFormData] = useState({
    pdfUrl: "",
    imageUrls: [],
    name: "",
    description: "",
    ISBN: "",
    author: "",
    region: "",
    year: "",
    publisher: "",
    copyright: "",
    internetReference: "",
    release: "",
    keyWords: "",
    Date: "",
    language: "Tamil",
    condition: "New",
    documentType: "Documentation",
    textStyle: "Prose",
    collector: "",
    address: "",
    fullness: "",
    sourceHolder: "",
    bookContent: [
      {
        chapterText: "",
      },
    ],
    media: "", // Added media state
  });

  const [text, setText] = useState(""); // State for extracted text
  const [imageUploadError, setImageUploadError] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState(null); // Holds the PDF data for rendering

  const handleChanges = (e) => {
    setSelectedSize(e.target.value);
    if (e.target.value !== 'Other') {
      setCustomSize(''); // Reset custom size if other option is not selected
    }
  };

  const handleCustomSizeChange = (e) => {
    setCustomSize(e.target.value);
  };

  const handleChangesType = (e) => {
    setSelectedDocumentType(e.target.value);
    if (e.target.value !== 'Other') {
      setCustomDocumentType(''); 
    }
  };

  const handleCustomTypeChange = (e) => {
    setCustomDocumentType(e.target.value);
  };

  const handleImageSubmit = (e) => {
    if (selectedImage && selectedImage.length === 1) {
      setUploading(true);
      setImageUploadError(false);

      storeFile(selectedImage[0])
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: [url],
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("படப் பதிவேற்றம் தோல்வியடைந்தது (ஒரு படத்திற்கு அதிகபட்சம் 2mb மட்டுமே)");
          setUploading(false);
        });
    } else {
      setImageUploadError("ஒரு படத்தை மட்டும் பதிவேற்றவும்");
      setUploading(false);
    }
  };

  const handlePdfSubmit = (e) => {
    if (setSelectedPdf && setSelectedPdf.length === 1) {
      setUploadingPdf(true);
      setPdfUploadError(false);

      const file = selectedPdf[0];
      const fileType = file.type;

      // Check if the file is a PDF
      if (fileType === "application/pdf") {
        storeFile(file)
          .then((url) => {
            setFormData({
              ...formData,
              pdfUrl: url, // Save the PDF file URL
            });
            setUploadingPdf(false);
            extractTextFromPDF(file); // Extract text from the PDF
          })
          .catch((err) => {
            setPdfUploadError("PDF upload failed (2 MB max per file)");
            setUploadingPdf(false);
          });
      } else {
        setPdfUploadError("Unsupported file type. Please upload a PDF.");
        setUploadingPdf(false);
      }
    } else {
      setPdfUploadError("Please upload only one PDF file");
      setUploadingPdf(false);
    }
  };

  const extractTextFromPDF = async (file) => {
    setUploadingPdf(true);
    setText("");
    try {
      // Load the PDF
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;

      let fullText = "";

      // Loop through each page
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        // Render the page to a canvas
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        // Convert canvas to an image and run OCR
        const imageData = canvas.toDataURL("image/png");
        const {
          data: { text },
        } = await Tesseract.recognize(
          imageData,
          "tam", // Use Tamil language code
          {
            logger: (m) => console.log(m),
          }
        );
        fullText += text + "\n";
      }

      setText(fullText);
      setPdfData(URL.createObjectURL(file)); // Set PDF URL for rendering
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing the PDF.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const storeFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Return the file URL
          });
        }
      );
    });
  };

  const handleRemovePdf = (event) => {
    setFormData({
      ...formData,
      pdfUrl: "",
    });
    setSelectedPdf(null);
    setText(""); // Clear extracted text when image is removed
    setPdfData(null);
  };

  const handleChange = (e) => {
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    } else if (e.target.name === "media") {
      setFormData({
        ...formData,
        media: e.target.value, // Update media selection
      });
    } else if (e.target.name === "fullness") {
      setFormData({
        ...formData,
        fullness: e.target.value, // Update media selection
      });
    } else if (e.target.tagName === "SELECT") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1 || !formData.pdfUrl)
        return setError(
          "You must upload at least one image or You must upload a PDF file"
        );
      setLoading(true);
      setError(false);

      // Update formData to only include chapterText (extracted text)
      const updatedFormData = {
        ...formData,
        bookContent: [
          {
            chapterText: text, // Only the extracted text
          },
        ],
        userRef: currentUser._id,
      };

      const res = await fetch("/api/book/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), // Send the updated formData
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/book/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prevState) => {
      if (checked) {
        return { ...prevState, region: [...prevState.region, id] }; // Add the checked item to the region array
      } else {
        return {
          ...prevState,
          region: prevState.region.filter((region) => region !== id), // Remove unchecked item from region
        };
      }
    });
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Add a Book</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="பெயர் "
            className="border p-2 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="விளக்கம்"
            className="border p-2 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <div>
            <label className="font-semibold">நிலை : </label>
            <select
              type="text"
              id="condition"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="New" selected>
                புதியது
              </option>
              <option value="Fully old">முழுமையாக பழுதடைந்தது</option>
              <option value="Half old">பகுதியாகப் பழுதடைந்தது</option>
              <option value="Illuminable">ஒளிவருட முடியாதது</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">ஆவண வகை : </label>
            <select
              type="text"
              id="documentType"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="Documentation" selected>
                தொகுப்பு
              </option>
              <option value="Book">நூல்</option>
              <option value="Magazine">இதழ்</option>
              <option value="News Paper">பத்திரிகை</option>
              <option value="Pamphlet">துண்டு பிரசுரம்</option>
              <option value="flower">மலர்</option>
              <option value="Report">அறிக்கை</option>
              <option value="Other">வேறு</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">கிளைமொழி/ வட்டார வழக்கு:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Jaffna"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.region.includes("Jaffna")}
              />
              <span>யாழ்ப்பாணம்</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Batticaloa"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.region.includes("Batticaloa")}
              />
              <span>மட்டக்களப்பு</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Upcountry"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.region.includes("Upcountry")}
              />
              <span>மலையகம்</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Vanni"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.region.includes("Vanni")}
              />
              <span>வன்னி</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Muslim Tamil"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.region.includes("Muslim Tamil")}
              />
              <span>முஸ்லிம் தமிழ்</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Other"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.region.includes("Other")}
              />
              <span>வேறு</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="சேகரித்தவர்"
            className="border p-2 rounded-lg"
            id="collector"
            onChange={handleChange}
            value={formData.collector}
          />
          <input
            type="text"
            placeholder="திகதி"
            className="border p-2 rounded-lg"
            id="Date"
            onChange={handleChange}
            value={formData.Date}
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="எழுத்தாளர் "
            className="border p-2 rounded-lg"
            id="author"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.author}
          />

          <div>
            <label className="font-semibold">ஊடகம்:</label>
            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="radio"
                  name="media"
                  value="Typing" // Combined value
                  onChange={handleChange}
                  id="Typing"
                  required
                />{" "}
                தட்டச்சு
              </label>
              <label>
                <input
                  type="radio"
                  name="media"
                  value="CharacterFile" // Combined value
                  onChange={handleChange}
                />{" "}
                எழுத்துக் கோர்ப்பு
              </label>
              <label>
                <input
                  type="radio"
                  name="media"
                  value="ComputerTyping" // Combined value
                  onChange={handleChange}
                />{" "}
                கணினித்தட்டச்சு
              </label>

              <label>
                <input
                  type="radio"
                  name="media"
                  value="Multimedia"
                  onChange={handleChange}
                />{" "}
                பல்லூடகம்
              </label>
              <label>
                <input
                  type="radio"
                  name="media"
                  value="Trace"
                  onChange={handleChange}
                />{" "}
                சுவடி
              </label>
              <label>
                <input
                  type="radio"
                  name="media"
                  value="Electronics"
                  onChange={handleChange}
                />{" "}
                இலத்திரனியல்
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold">முழுமை:</label>
            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="radio"
                  name="fullness"
                  value="Full"
                  onChange={handleChange}
                  id="print"
                  required
                />{" "}
                முழுமை
              </label>

              <label>
                <input
                  type="radio"
                  name="fullness"
                  value="Half"
                  onChange={handleChange}
                />{" "}
                பகுதி
              </label>
            </div>
          </div>

          <input
            type="text"
            placeholder="முகவரி"
            className="border p-2 rounded-lg"
            id="address"
            onChange={handleChange}
            value={formData.address}
          />

          <input
            type="text"
            placeholder="திறவுச்சொற்கள்"
            className="border p-2 rounded-lg"
            id="keyWords"
            onChange={handleChange}
            value={formData.keyWords}
          />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="தொகுப்பு எண் "
            className="border p-2 rounded-lg"
            id="ISBN"
            required
            onChange={handleChange}
            value={formData.ISBN}
          />

          <div>
            <label className="font-semibold">மொழி : </label>
            <select
              type="text"
              id="language"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="Tamil" selected>
                தமிழ்
              </option>
              <option value="English">ஆங்கிலம்</option>
              <option value="Tamil-english">தமிழ்-ஆங்கிலம்</option>
            </select>
          </div>

          <input
            type="number"
            placeholder="ஆண்டு"
            className="border p-2 rounded-lg"
            id="year"
            onChange={handleChange}
            value={formData.year}
          />

          <div>
            <label className="font-semibold">எழுத்துவகை : </label>
            <select
              type="text"
              id="textStyle"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="Prose" selected>
                உரைநடை
              </option>
              <option value="Rhyme">செய்யுள்</option>
              <option value="Drama">நாடகம்</option>
              <option value="Poetry">கவிதை</option>
              <option value="Fiction">புனைவு</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="பதிப்பாளர்"
            className="border p-2 rounded-lg"
            id="publisher"
            onChange={handleChange}
            value={formData.publisher}
          />
          <input
            type="text"
            placeholder="பதிப்புரிமை"
            className="border p-2 rounded-lg"
            id="copyright"
            onChange={handleChange}
            value={formData.copyright}
          />
          <input
            type="text"
            placeholder="இணைய இணைப்பு"
            className="border p-2 rounded-lg"
            id="internetReference"
            onChange={handleChange}
            value={formData.internetReference}
          />

          <input
            type="text"
            placeholder="வெளியீடு"
            className="border p-2 rounded-lg"
            id="release"
            onChange={handleChange}
            value={formData.release}
          />
          <input
            type="text"
            placeholder="மூலத்தை வைத்திருப்பவர்"
            id="sourceHolder"
            value={formData.sourceHolder}
            onChange={(e) => setFormData({ ...formData, sourceHolder: e.target.value })}
            className="border p-2 rounded-lg"
          />
        </div>

        {/* Button Section */}
        <div className="col-span-3 flex gap-4 justify-end mt-4">
          <div className="flex gap-4">
            <input
              onChange={(e) => setSelectedImage(e.target.files)}
              className="p-2 border border-gray-300 rounded w-full"
              type="file"
              id="image"
              accept="image/*"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload Book Cover"}
            </button>
          </div>

          <div className="flex gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSelectedPdf(e.target.files)}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              disabled={uploadingPdf}
              onClick={handlePdfSubmit}
              className="p-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploadingPdf ? "Uploading..." : "Upload Book Pdf"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && `Image Upload Error: ${imageUploadError}`}
          </p>
          <p className="text-red-700 text-sm">
            {pdfUploadError && `PDF Upload Error: ${pdfUploadError}`}
          </p>
        </div>
        <div className="col-span-3 flex gap-4 justify-end mt-1">
          <button
            disabled={loading || uploading || uploadingPdf}
            className="p-2 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "தயவுசெய்து காத்திருங்கள்..." : "புத்தகத்தை சேர்க்கவும்"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>

      {/* Image and text side by side */}
      <div className="flex mt-4 space-x-4 w-full">
        {/* PDF Viewer on the Left */}
        <div className="flex-1 w-full">
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
          <button
            type="button"
            onClick={handleRemovePdf}
            className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 mt-4"
          >
            Delete
          </button>
        </div>

        {/* Extracted Text on the Right */}
        <div className="flex-1 w-full">
          <h2 className="text-xl font-medium mb-2">Extracted Text</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)} // Handle text changes
            rows="20"
            cols="50"
            placeholder="Extracted text will appear here..."
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
      </div>
    </main>
  );
}