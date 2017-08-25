import PDFObject from 'pdfobject';

window.addEventListener('load', () => {
  const container = document.getElementById('pdf-embed');
  if (!container) {
    return;
  }

  PDFObject.embed(container.getAttribute('data-url'), '#pdf-embed', {
    height: '600px',
    pdfOpenParams: { view: 'FitV' },
  });
});
