const fs = require("fs");

async function testUpload() {
  const { FormData } = await import("formdata-node");
  const { fileFromSync } = await import("fetch-blob/from.js");

  const formData = new FormData();

  // Create dummy image and pdf
  fs.writeFileSync("dummy.jpg", "dummy image content");
  fs.writeFileSync("dummy1.pdf", "dummy pdf 1");
  fs.writeFileSync("dummy2.pdf", "dummy pdf 2");

  const profilePhoto = fileFromSync("dummy.jpg", "image/jpeg");
  const pdf1 = fileFromSync("dummy1.pdf", "application/pdf");
  const pdf2 = fileFromSync("dummy2.pdf", "application/pdf");

  formData.append(
    "data",
    JSON.stringify({
      patientInfo: {
        name: "Adi Dey Testing",
        contactNumber: "01911223344",
      },
      patientHealthData: {
        gender: "MALE",
      },
    })
  );

  formData.append("profilePhoto", profilePhoto);
  formData.append("medicalReports", pdf1);
  formData.append("medicalReports", pdf2);

  // Authenticate to get a token?
  // User ID is existing patient `adidey244@gmail.com`
  // We need a valid token. Oh, I don't have the token.
}
testUpload();
