const fs = require("fs");
const path = require("path");

const filePath =
  "d:\\Skillify\\Frontend\\src\\components\\profile\\EditProfileForm.jsx";

try {
  const content = fs.readFileSync(filePath, "utf8");
  const beforeCount = (content.match(/focus:ring-teal-500/g) || []).length;

  const newContent = content.replace(
    /focus:ring-teal-500/g,
    "focus:ring-blue-500",
  );

  const afterCount = (newContent.match(/focus:ring-teal-500/g) || []).length;

  fs.writeFileSync(filePath, newContent, "utf8");

  console.log(`✓ Replacement complete: ${beforeCount} instances replaced`);
  console.log(`✓ File saved: ${filePath}`);
  console.log(`✓ Remaining 'focus:ring-teal-500' instances: ${afterCount}`);
} catch (err) {
  console.error("Error:", err.message);
}
