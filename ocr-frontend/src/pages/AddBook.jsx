import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tesseract from 'tesseract.js'; // Import Tesseract for OCR

export default function AddBook() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    ISBN: "",
    author: "",
    type: "Jaffna",
    bookContent: [
      {
        chapterText: "",
      },
    ],
  });
  const [text, setText] = useState(''); // State for extracted text
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("Please upload only one image");
      setUploading(false);
    }
  };

  const extractTextFromImage = (file) => {
    Tesseract.recognize(
      file,
      'tam',  // Use the Tamil language code
      {
        logger: (m) => console.log(m)
      }
    ).then(({ data: { text } }) => {
      setText(text); // Set the extracted text
    }).catch((error) => {
      console.error(error);
      alert("An error occurred while processing the image.");
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    setText(''); // Clear extracted text when image is removed
  };

  const handleChange = (e) => {
    if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
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

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Add a Book</h1>
      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Sidebar with input fields - aligned to the left */}
        <div className="flex flex-col gap-4 w-full sm:w-1/4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Author"
            className="border p-2 rounded-lg"
            id="author"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.author}
          />
          <input
            type="text"
            placeholder="ISBN"
            className="border p-2 rounded-lg"
            id="ISBN"
            required
            onChange={handleChange}
            value={formData.ISBN}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-2 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          
          {/* Place checkboxes in a single line */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Jaffna"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "Jaffna"}
              />
              <span>Jaffna</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Eastern"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "Eastern"}
              />
              <span>Eastern</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="Upcountry"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "Upcountry"}
              />
              <span>Upcountry</span>
            </div>
          </div>

          <div className="flex gap-4">
            <input
              onChange={(e) => setSelectedFile(e.target.files)}
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
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          <button
            disabled={loading || uploading}
            className="p-2 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create book"}
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
                Delete
              </button>
            </div>
          )}

          {/* Text section */}
      <div className="border p-3 w-1/2">
        <h2 className="font-semibold">Extracted Text:</h2>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  </form>
</main>



  );
}

