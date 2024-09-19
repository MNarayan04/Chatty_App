// import { useState } from "react";
// import { BsSend } from "react-icons/bs";
// import useSendMessage from "../../hooks/useSendMessage";
// import EmojiPicker from "emoji-picker-react";
// import { MdOutlineEmojiEmotions } from "react-icons/md";
// import { IoIosAttach } from "react-icons/io";

// const MessageInput = () => {
//   const [message, setMessage] = useState("");
//   const [showPicker, setShowPicker] = useState(false); // State to toggle emoji picker visibility
//   const { loading, sendMessage } = useSendMessage();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message) return;
//     await sendMessage(message);
//     setMessage("");
//   };

//   const handleEmojiClick = (event, emojiObject) => {
//     setMessage((prevMessage) => prevMessage + event.emoji); // Append emoji to message	
//     // setShowPicker(false); // Hide the picker after selecting an emoji
//   };

//   const handleTogglePicker = () => {
//     setShowPicker((prevShowPicker) => !prevShowPicker); // Toggle picker visibility
//   };

//   return (
//     <form className="px-4 my-3" onSubmit={handleSubmit}>
//       <div className="w-full relative">
// 	  <button
//           type="submit"
//           className="absolute top-3 pl-2  flex items-center pe-3"
//         >
//           {loading ? (
//             <div className="loading loading-spinner"></div>
//           ) : (
//             <IoIosAttach />
//           )}
//         </button>
//         <input
//           type="text"
//           className="border pl-9 text-sm w-full rounded-lg block p-2.5 bg-gray-700 border-gray-600 text-white"
//           placeholder="Send a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         <button
//           type="button"
//           onClick={handleTogglePicker}
//           className="absolute inset-y-1 mr-5  end-0 flex items-center p-3"	
//           style={{ paddingRight: "32px" }}
//         >
//           <MdOutlineEmojiEmotions />
//         </button>

//         <button
//           type="submit"
//           className="absolute inset-y-0 end-0 flex items-center pe-3"
//         >
//           {loading ? (
//             <div className="loading loading-spinner"></div>
//           ) : (
//             <BsSend />
//           )}
//         </button>

//         {showPicker && (
//           <div className="absolute bottom-12 end-0">
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         )}
//       </div>
//     </form>
//   );
// };



// export default MessageInput;
import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoIosAttach } from "react-icons/io";
// import { storage } from "../../firebase"; // Adjust the import path

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && !file) return;

    let fileUrl = "";

    // Handle file upload if a file is selected
    if (file) {
      setUploading(true);
      const fileRef = storage.ref().child(`uploads/${file.name}`);
      try {
        await fileRef.put(file);
        fileUrl = await fileRef.getDownloadURL();
      } catch (error) {
        console.error("File upload failed", error);
      }
      setUploading(false);
      setFile(null); // Clear the file state
    }

    // Construct message with file URL if available
    const finalMessage = file ? `${message} [File: ${fileUrl}]` : message;

    await sendMessage(finalMessage); // Send the message with file URL
    setMessage(""); // Clear the message input
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + event.emoji);
  };

  const handleTogglePicker = () => {
    setShowPicker((prevShowPicker) => !prevShowPicker);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage((prevMessage) => prevMessage + `[File: ${selectedFile.name}]`);
    }
  };

  const handleAttachClick = () => {
    document.getElementById('file-input').click(); // Trigger the hidden file input field
  };

  return (
    <form className="relative px-4 my-3" onSubmit={handleSubmit}>
      <div className="relative flex items-center border border-gray-600 rounded-lg bg-gray-700">
        {/* Attach Button */}
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-2 text-white flex items-center"
        >
          <IoIosAttach />
        </button>

        {/* Hidden File Input */}
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Input Field */}
        <input
          type="text"
          className="flex-grow pl-4 text-sm rounded-lg bg-gray-700 border-0 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Emoji Button */}
        <button
          type="button"
          onClick={handleTogglePicker}
          className="absolute inset-y-1 right-7 flex items-center p-3"
        >
          <MdOutlineEmojiEmotions />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center p-2 text-white"
        >
          {uploading || loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend />
          )}
        </button>

        {/* Emoji Picker */}
        {showPicker && (
          <div className="absolute bottom-full right-0 mt-2 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageInput;




/* 
../../firebase
// firebase.js
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth"; // Optional if you use Firebase Authentication

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();
const auth = firebase.auth(); // Optional

export { storage, auth };

*/