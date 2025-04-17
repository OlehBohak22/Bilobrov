export function truncateHtmlString(htmlString: string, maxLength: number) {
  // Створюємо тимчасовий елемент щоб витягнути чистий текст
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;
  const plainText = tempElement.textContent || tempElement.innerText || "";

  if (plainText.length > maxLength) {
    return plainText.slice(0, maxLength) + "...";
  }

  return plainText;
}
