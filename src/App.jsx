import { useState } from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';
import jsPDF from 'jspdf';

function App() {
  const [tables, setTables] = useState([]);

  const handleExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const tables = workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const htmlTable = XLSX.utils.sheet_to_html(worksheet);

        return { sheetName, htmlTable };
      });

      setTables(tables);
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadAsPdf = () => {
    const doc = new jsPDF();

    tables.forEach(({ sheetName, htmlTable }) => {
      doc.text(sheetName, 10, 10);
      doc.html(htmlTable, {
        callback: function (doc) {
          doc.save();
        },
      });
      doc.addPage();
    });

    doc.save('plantilla.pdf');
  };

  return (
    <div>
      <input type="file" id="excelFile" accept=".xlsx, .xls" onChange={handleExcel} />
      <button className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={downloadAsPdf}>Descargar como PDF</button>

      {tables.map(({ sheetName, htmlTable }, index) => (
        <div key={index}>
          <h2>{sheetName}</h2>
          <div dangerouslySetInnerHTML={{ __html: htmlTable }} />
        </div>
      ))}
    </div>
  );
}

export default App;