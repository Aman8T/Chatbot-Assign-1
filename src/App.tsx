import React, { useState } from "react";

export default function App() {
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false); // New state to track file upload status

  const handleQuestionChange = (event : any) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event : any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileUploaded(false); // Reset file upload status
    uploadFile(selectedFile); // Call upload function
  };

  const uploadFile = (selectedFile : File) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        
        setFileUploaded(true); // Set file upload status to true upon successful upload
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleSubmitQuestion = (event : any) => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: JSON.stringify({ question }), // Sending question as JSON
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data =>setResult(data.result))
    .catch(error => console.error("Error sending question:", error));
  };

  return (
    <div className="appBlock">
      <form className="form">
        <label className="fileLabel" htmlFor="file">
          Upload CSV file:
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".csv, .txt, .docx, .pdf"
          onChange={handleFileChange}
          className="fileInput"
        />
      </form>
      <form onSubmit={handleSubmitQuestion} className="form">
        <label className="questionLabel" htmlFor="question">
          Question:
        </label>
        <input
          name="question"
          className="questionInput"
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
        />
        <button
          className="submitBtn"
          type="submit"
          disabled={!question || !fileUploaded} // Disable button until question is provided and file is uploaded
        >
          Submit Question
        </button>
      </form>
      <p className="resultOutput">Result: {result}</p>
    </div>
  );
}
