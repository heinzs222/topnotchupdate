// UserChoicesHandler.js
const UserChoicesHandler = {
  // Save the final configuration to local storage
  save: function (userChoices) {
    try {
      const json = JSON.stringify(userChoices);
      localStorage.setItem("userChoices", json);
      console.log("User choices saved:", json);
    } catch (err) {
      console.error("Failed to save user choices", err);
    }
  },

  // Retrieve saved user choices from local storage
  get: function () {
    try {
      const json = localStorage.getItem("userChoices");
      return json ? JSON.parse(json) : null;
    } catch (err) {
      console.error("Failed to load user choices", err);
      return null;
    }
  },

  // Create and download a text file containing all the user choices
  download: function (userChoices) {
    try {
      // Convert the userChoices object to a formatted text string.
      // You can also customize the formatting here.
      const text = JSON.stringify(userChoices, null, 2);

      // Create a Blob containing the text, and set its MIME type to plain text.
      const blob = new Blob([text], { type: "text/plain" });

      // Generate a URL for the Blob.
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download.
      const link = document.createElement("a");
      link.href = url;
      link.download = "userChoices.txt"; // This will be the downloaded file's name

      // Append the link to the document body and trigger a click on it.
      document.body.appendChild(link);
      link.click();

      // Remove the link and revoke the object URL to free up memory.
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      console.log("User choices downloaded as userChoices.txt");
    } catch (err) {
      console.error("Failed to download user choices", err);
    }
  },
};

export default UserChoicesHandler;
