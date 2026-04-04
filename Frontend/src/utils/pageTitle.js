export const setPageTitle = (title) => {
  const normalizedTitle =
    title?.replace(/\s*\|\s*Skillify$/i, "") || "Skillify";
  document.title = `${normalizedTitle} | Skillify`;

  // Update meta description if needed
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `${normalizedTitle} - Skillify freelancer network`,
    );
  }
};

export const resetPageTitle = () => {
  document.title = "Home | Skillify";
};
