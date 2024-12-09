import { useState } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable,} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js"; // Import Tesseract for OCR

export default function AddBook() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSize, setSelectedSize] = useState('A4');
  const [customSize, setCustomSize] = useState('');
  const [selectedDocumentType, setSelectedDocumentType ] = useState('');
  const [customDocumentType, setCustomDocumentType] = useState('');

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    ISBN: "",
    author: "",
    type: "",
    year: new Date(),
    publisher: "",
    copyright: "",
    internetReference: "",
    release: "",
    keyWords: "",
    Date: "",
    collector: "",
    address: "",
    pages: "",
    size: "",
    language: "",
    condition: "",
    documentType: "",
    textStyle: "",
    collector: "",
    address: "",
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (selectedFile && selectedFile.length === 1) {
      setUploading(true);
      setImageUploadError(false);

      storeImage(selectedFile[0])
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: [url],
          });
          setImageUploadError(false);
          setUploading(false);
          extractTextFromImage(selectedFile[0]); // Call to extract text
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

  // Extract image data to text
  const extractTextFromImage = (file) => {
    Tesseract.recognize(
      file,
      "tam", // Use the Tamil language code
      {
        logger: (m) => console.log(m),
      }
    )
      .then(({ data: { text } }) => {
        setText(text); // Set the extracted text
      })
      .catch((error) => {
        console.error(error);
        alert("படத்தைச் செயலாக்கும்போது பிழை ஏற்பட்டதது");
      });
  };

  const storeImage = async (file) => {
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
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    setText(""); // Clear extracted text when image is removed
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
    }
  };

  const handleYearChange = (date) => {
    setFormData({
      ...formData,
      year: date.getFullYear(), // Set the selected date to formData.year
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("நீங்கள் குறைந்தது ஒரு படத்தையாவது பதிவேற்ற வேண்டும்");
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
        return { ...prevState, type: [...prevState.type, id] }; // Add the checked item to the array
      } else {
        return {
          ...prevState,
          type: prevState.type.filter((type) => type !== id), // Remove unchecked item
        };
      }
    });
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">புதிய புத்தகத்தை பதிவேற்ற</h1>
      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Sidebar with input fields - aligned to the left */}
        <div className="flex flex-col gap-4 w-full sm:w-2/5">
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
          <input
            type="text"
            placeholder="தொகுப்பு எண் "
            className="border p-2 rounded-lg"
            id="ISBN"
            required
            onChange={handleChange}
            value={formData.ISBN}
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
            <label className="font-semibold">மொழி : </label>
            <select
              id="language"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="Tamil">தமிழ்</option>
              <option value="English">ஆங்கிலம்</option>
              <option value="Tamil-english">தமிழ்-ஆங்கிலம்</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">நிலை : </label>
            <select
              id="condition"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="New">புதியது</option>
              <option value="Fully old">முழுமையாக பழுதடைந்தது</option>
              <option value="Half old">பகுதியாகப் பழுதடைந்தது</option>
              <option value="Illuminable">ஒளிவருட முடியாதது</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">நீளம்/அளவு : </label>
            <div className="px-4 flex items-center">
              <label className="mr-1">பக்கங்கள்: </label>
              <input
                type="number"
                className="border p-2 text-center ml-2 mt-2 w-20 rounded-lg"
                id="Pages"
                onChange={handleChange}
                
              />
            </div>
            <div className="px-4 flex items-center ">
              <label className="mr-2 mt-3">ஆவண அளவு: </label>
              <select
                id="Size"
                className="border rounded-lg mt-3 px-5 py-2"
                value={selectedSize}
                onChange={handleChanges}
              >
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="B5">B5</option>
                <option value="B6">B6</option>
                <option value="Other">வேறு</option>
              </select>
              {selectedSize === 'Other' && (
                <input
                  type="text"
                  className="border rounded-lg mt-3 p-2 ml-3"
                  placeholder="ஆவண அளவு"
                  value={customSize}
                  onChange={handleCustomSizeChange}
                />
              )}
            </div>
          </div>
          <div>
            <label className="font-semibold">ஆவண வகை : </label>
            <select
              id="documentType"
              className="border rounded-lg mt-3 px-5 py-2"
              value={selectedDocumentType}
              onChange={handleChangesType}
            >
              <option value="Documentation">தொகுப்பு</option>
              <option value="Book">நூல்</option>
              <option value="Magazine">இதழ்</option>
              <option value="News Paper">பத்திரிகை</option>
              <option value="Pamphlet">துண்டு பிரசுரம்</option>
              <option value="flower">மலர்</option>
              <option value="Report">அறிக்கை</option>
              <option value="Other">வேறு</option>
            </select>
            {selectedDocumentType === 'Other' && (
                <input
                  type="text"
                  className=" mt-3 p-1 ml-12"
                  placeholder="வேறு ஆவண வகை"
                  value={customDocumentType}
                  onChange={handleCustomTypeChange}
                />
              )}
          </div>
          <div>
          <input
            type="number"
            placeholder="ஆண்டு"
            className="border p-2 rounded-lg"
            id="year"
            onChange={handleChange}
            value={formData.year}
          />
          </div>
          <div>
            <label className="font-semibold">எழுத்துவகை : </label>
            <select
              id="textStyle"
              className="border p-2 rounded-lg"
              onChange={handleChange}
            >
              <option value="Prose">உரைநடை</option>
              <option value="Rhyme">செய்யுள்</option>
              <option value="Drama">நாடகம்</option>
              <option value="Poetry">கவிதை</option>
              <option value="Fiction">புனைவு</option>
            </select>
          </div>

          {/* Place checkboxes in a single line */}
          <div className="">
            <label className="font-semibold">கிளைமொழி/ வட்டார வழக்கு:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Jaffna"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.type.includes("Jaffna")}
              />
              <span>யாழ்ப்பாணம்</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Batticaloa"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.type.includes("Batticaloa")}
              />
              <span>மட்டக்களப்பு</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Upcountry"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.type.includes("Upcountry")}
              />
              <span>மலையகம்</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Vanni"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.type.includes("Vanni")}
              />
              <span>வன்னி</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Muslim Tamil"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.type.includes("Muslim Tamil")}
              />
              <span>முஸ்லிம் தமிழ்</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Other"
                className="w-5"
                onChange={handleCheckboxChange}
                checked={formData.type.includes("Other")}
              />
              <span>வேறு</span>
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
          
  {/* <label htmlFor="webLink">இணைய இணைப்பு</label> */}
  <input
    type="text"
    placeholder="இணைய இணைப்பு"
    id="webLink"
    value={formData.webLink}
    onChange={(e) => setFormData({ ...formData, webLink: e.target.value })}
    className="border p-2 rounded-lg"
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
          <input
            type="text"
            placeholder="திறவுச்சொற்கள்"
            className="border p-2 rounded-lg"
            id="KeyWords"
            onChange={handleChange}
            value={formData.KeyWords}
          />

          {/* Image upload section */}
          <div className="flex gap-4">
            <input
              onChange={(e) => setSelectedFile(e.target.files)}
              className="p-2 border border-gray-300 rounded-lg w-full"
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
              {uploading ? "படம் பதிவேற்றப்படுகிறது..." : "பதிவேற்றவும்"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          <button
            disabled={loading || uploading}
            className="p-2 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "தயவுசெய்து காத்திருங்கள்..." : "புத்தகத்தை சேர்க்கவும்"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>

        {/* Image and text side by side */}
        <div className="flex flex-1 gap-4">
          {/* Image section */}
          {formData.imageUrls.length > 0 && (
            <div className="p-3 border items-center w-1/2">
              <img
                src={formData.imageUrls[0]}
                alt="listing image"
                className="w-full h-auto object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(0)}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 mt-4"
              >
                அகற்று
              </button>
            </div>
          )}

          {/* Text section */}
          <div className="border bg-slate-50 p-5 rounded-lg h-4/5 w-full">
            <h2 className="font-semibold text-slate-600">படத்தில் இருந்து OCR மூலம் பெறப்பட்ட உரை : </h2>
            {/* <h2 className="font-semibold">படத்தில் இருந்து பிரித்தெடுக்கப்பட்ட உரை : </h2> */}

            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        </div>
      </form>
    </main>
  );
}