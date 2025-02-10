// emailSender.js
const EmailSender = {
  sendUserChoicesEmail: function (userChoices) {
    // Prepare the parameters for the email template.
    const templateParams = {
      texture: userChoices.texture,
      "design.jacket.Back": userChoices.design.jacket.Back || "",
      "design.jacket.Lapels": userChoices.design.jacket.Lapels || "",
      "design.jacket.Pockets": userChoices.design.jacket.Pockets || "",
      // Pass embroidery as an object with a "jacket" key containing the array.
      embroidery: { jacket: userChoices.embroidery.jacket },
      // Build measurements as a string if userChoices.measurements is an object.
      measurements:
        typeof userChoices.measurements === "object"
          ? Object.entries(userChoices.measurements)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          : userChoices.measurements || "",
    };

    emailjs.send("service_sgrj3ua", "template_exfdszb", templateParams).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.error("FAILED...", error);
      }
    );
  },
};

export default EmailSender;
