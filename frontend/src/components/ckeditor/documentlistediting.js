import {
  Plugin,
  // MODIFIED
  Widget,
  toWidget,
  viewToModelPositionOutsideModelElement
} from 'ckeditor5';
import DocumentListCommand from './documentlistcommand';

import './theme/placeholder.css';

export default class DocumentListEditing extends Plugin {
  static get requires() {                                                    // ADDED
    return [Widget];
  }

  init() {
    console.log('DocumentListEditing#init() got called');

    this._defineSchema();
    this._defineConverters();

    // ADDED
    this.editor.commands.add('documentlist', new DocumentListCommand(this.editor));

    // ADDED
    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('documentlist'))
    );
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('documentlist', {
      // Behaves like a self-contained inline object (e.g. an inline image)
      // allowed in places where $text is allowed (e.g. in paragraphs).
      // The inline widget can have the same attributes as text (for example linkHref, bold).
      inheritAllFrom: '$inlineObject',

      // The documentlist can have many types, like date, name, surname, etc:
      allowAttributes: ['name']
    });
  }

  _defineConverters() {                                                      // ADDED
    const conversion = this.editor.conversion;

    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: ['documentlist']
      },
      model: (viewElement, { writer: modelWriter }) => {
        let name = '';

        const textNode = viewElement.getChild(0);
        if (textNode && textNode.is('$text')) {
          const match = textNode.data.match(/^\{(.+?)\}$/);
          if (match) {
            name = match[1];
          }
        }
        return modelWriter.createElement('documentlist', { name });
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'documentlist',
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createDocumentListView(modelItem, viewWriter);
        return toWidget(widgetElement, viewWriter);
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'documentlist',
      view: (modelItem, { writer: viewWriter }) => createDocumentListView(modelItem, viewWriter)
    });

    // Helper method for both downcast converters.
    function createDocumentListView(modelItem, viewWriter) {
      const name = modelItem.getAttribute('name');

      const documentlistView = viewWriter.createContainerElement('span', {
        class: 'documentlist'
      });

      if (name) {
        const innerText = viewWriter.createText(`{${name}}`);
        viewWriter.insert(viewWriter.createPositionAt(documentlistView, 0), innerText);
      }

      return documentlistView;
    }
  }
}
