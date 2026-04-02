export const setPageTitle = (title) => {
  document.title = `${title} | Skillify`;

  // Update meta description if needed
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `${title} - Skillify freelancer network`,
    );
  }
};

export const resetPageTitle = () => {
  document.title = "Skillify | Freelancer Network";
};
