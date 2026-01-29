export const setPageTitle = (title) => {
  document.title = `${title} | Skillify`;

  // Update meta description if needed
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `${title} - Skillify skill exchange platform`,
    );
  }
};

export const resetPageTitle = () => {
  document.title = "Skillify - Skill Exchange Platform";
};
