// placeholder/placeholder.js

import { Plugin } from 'ckeditor5';

import DocumentListEditing from './documentlistediting';
import DocumentListUI from './documentlistui';

export default class DocumentList extends Plugin {
  static get requires() {
    return [DocumentListEditing, DocumentListUI];
  }
}
