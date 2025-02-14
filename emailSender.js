// emailSender.js
const EmailSender = {
  sendUserChoicesEmail: function (userChoices) {
    // Prepare the parameters for the email template.
    const templateParams = {
      texture: userChoices.texture,
      design: {
        jacket: {
          Back: userChoices.design.jacket.Back || "",
          Lapels: userChoices.design.jacket.Lapels || "",
          PocketsTop: userChoices.design.jacket.PocketsTop || "",
          PocketsBottom: userChoices.design.jacket.PocketsBottom || "",
        },
      },
      embroidery: { jacket: userChoices.embroidery.jacket },
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
