import React, { useRef } from "react";
import "./A4Preview.css";
import MainStore from "MainStore";
import store from "./store"

const A4Preview = ({ htmlString, code }) => {
    const previewRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    // const handleSendPDFToServer = () => {
    //     const element = previewRef.current;

    //     const opt = {
    //         margin: 0,
    //         filename: 'document.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    //     };

    //     html2pdf()
    //         .set(opt)
    //         .from(element)
    //         .outputPdf('blob') // returns a Blob instead of saving
    //         .then((pdfBlob) => {
    //             const formData = new FormData();
    //             formData.append('file', pdfBlob, 'document.pdf');

    //             return;

    //             fetch('/api/upload-pdf', {
    //                 method: 'POST',
    //                 body: formData,
    //             })
    //                 .then(response => {
    //                     if (!response.ok) throw new Error("Upload failed");
    //                     return response.json();
    //                 })
    //                 .then(data => {
    //                     console.log("PDF uploaded successfully:", data);
    //                 })
    //                 .catch(err => {
    //                     console.error("Error uploading PDF:", err);
    //                 });
    //         });
    // };

    // const handleDownloadPDF = () => {
    //     const element = previewRef.current;
    //     const opt = {
    //         margin: [15, 0, 15, 0],// top, left, bottom, right
    //         filename: 'document.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: {
    //             unit: 'mm',
    //             format: [250, 297], // custom width x height
    //             orientation: 'portrait'
    //         }
    //     };
    //     html2pdf().set(opt).from(element).save();
    // };



    return (
        <div className="preview-container">
            <div className="toolbar">
                <button onClick={() => {
                    store.uploadHtmlString(code);
                    // MainStore.digitalSign.fileId = fileId;
                    // MainStore.openDigitalSign(
                    //     fileId,
                    //     async () => {
                    //         MainStore.onCloseDigitalSign();
                    //         onSaved()
                    //     },
                    //     () => MainStore.onCloseDigitalSign(),
                    // );

                }}>📄 Прикрепить</button>
            </div>
            <div
                className="a4-preview"
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: htmlString }}
            />
        </div>
    );
};

export default A4Preview;
