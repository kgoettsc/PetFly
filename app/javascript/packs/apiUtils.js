export const getCsrfToken = (document) => {
  return document.querySelector('[name="csrf-token"]').getAttribute('content')
}