import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo, Table } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

function Editor() {
    return (
        <CKEditor
            editor={ ClassicEditor }
            config={ {
                toolbar: {
                    items: [ 'undo', 'redo', '|', 'bold', 'italic', 'inserttable' ],
                },
                plugins: [
                    Bold, Essentials, Italic, Mention, Paragraph, Undo, Table
                ],
                licenseKey: '<YOUR_LICENSE_KEY>',
                initialData: '<p>Hello from CKEditor 5 in React!</p>',
                table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'], },
            } }
        />
    );
}

export default Editor;
