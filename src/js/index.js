import PDFObject from 'pdfobject';

const init = () => {
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-pdf-embed]'),
    (container) => {
      PDFObject.embed(
        container.getAttribute('data-url'),
        `#${container.getAttribute('id')}`,
        {
          height: '600px',
          pdfOpenParams: { view: 'FitV' },
        }
      );
    }
  );
};

window.addEventListener('load', init);
