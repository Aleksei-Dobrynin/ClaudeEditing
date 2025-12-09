// documentlist/documentlistcommand.js

import { Command } from 'ckeditor5';

export default class DocumentListCommand extends Command {
  execute({ value }) {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    editor.model.change(writer => {
      // Create a <documentlist> element with the "name" attribute (and all the selection attributes)...
      const documentlist = writer.createElement('documentlist', {
        ...Object.fromEntries(selection.getAttributes()),
        name: value
      });

      // ... and insert it into the document. Put the selection on the inserted element.
      editor.model.insertObject(documentlist, null, null, { setSelection: 'on' });
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;

    const isAllowed = model.schema.checkChild(selection.focus.parent, 'documentlist');

    this.isEnabled = isAllowed;
  }
}
