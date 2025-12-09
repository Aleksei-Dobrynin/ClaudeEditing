import {
  ClassicEditor, Context, Bold, TodoList, List, Indent, Alignment, Heading, ImageUpload, TableSelection, Base64UploadAdapter, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, LinkImage,
  Essentials, Italic, Paragraph, ContextWatchdog, Link, Underline, Table, TableEditing, TableUI, TableAlignmentCommand, ImageInsert,
  SourceEditing, Strikethrough, FontFamily, FontSize, FontColor, FontBackgroundColor, TableToolbar, TableCellProperties, TableProperties
} from 'ckeditor5';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';

import Placeholder from './placeholder';
import DocumentList from './documentlist';

import 'ckeditor5/ckeditor5.css';

type EditorProps = {
  onChange: (a) => void;
  value: string;
  name: string;
  withoutPlaceholder?: boolean;
  disabled?: boolean;
  id: string;
}
const Ckeditor = (props: EditorProps) => {
  const fontSize = [
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17,
    19,
    21
  ]
  if (props.withoutPlaceholder) {
    return <CKEditorContext context={Context} contextWatchdog={ContextWatchdog}>
      <CKEditor
        disabled={props.disabled}
        editor={ClassicEditor}
        id={props.id}
        config={{
          fontSize: {
            options: fontSize
          },
          plugins: [
            Essentials, Bold, Italic, Paragraph, Link, Underline, List, TodoList, Indent, Alignment, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, LinkImage, ImageInsert,
            Heading, Table, TableEditing, TableSelection, TableUI, Table, TableToolbar, TableCellProperties, TableProperties,
            SourceEditing, Strikethrough, FontFamily, FontSize, FontColor, FontBackgroundColor, DocumentList],
          table: {
            contentToolbar: [
              'tableColumn', 'tableRow', 'mergeTableCells',
              'tableProperties', 'TableCellProperties'
            ],
            tableProperties: {
            },
            tableCellProperties: {
            }
          },
          toolbar: {
            items: [
              'undo', 'redo', '|', 'Base64UploadAdapter',
              'heading', 'fontfamily', 'FontSize', 'FontColor', 'FontBackgroundColor', '|',
              'bold', 'italic', 'strikethrough', 'underline', 'insertImage',
              '-', 'alignment', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent', '|',
              'link', 'inserttable', 'tableColumn', 'sourceediting', '|',
            ],
          }
        }}
        data={props.value}
        onChange={(e, i) => {
          props.onChange({ target: { value: i.getData(), name: props.name } })
        }}
      />
    </CKEditorContext>
  }
  return (
    <CKEditorContext context={Context} contextWatchdog={ContextWatchdog}>
      <CKEditor
        editor={ClassicEditor}
        id={props.id}
        config={{
          fontSize: {
            options: fontSize
          },
          plugins: [
            Essentials, Bold, Italic, Paragraph, Link, Underline, List, TodoList, Indent, Alignment, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, LinkImage, ImageInsert,
            Heading, Table, TableEditing, TableSelection, TableUI, Table, TableToolbar, TableCellProperties, TableProperties,
            SourceEditing, Strikethrough, FontFamily, FontSize, FontColor, FontBackgroundColor, Placeholder, DocumentList],
          table: {
            contentToolbar: [
              'tableColumn', 'tableRow', 'mergeTableCells',
              'tableProperties', 'TableCellProperties'
            ],
            tableProperties: {
            },
            tableCellProperties: {
            }
          },
          toolbar: {
            items: [
              'undo', 'redo', '|', 'Base64UploadAdapter',
              'heading', 'fontfamily', 'FontSize', 'FontColor', 'FontBackgroundColor', '|',
              'bold', 'italic', 'strikethrough', 'underline', 'insertImage',
              '-', 'alignment', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent', '|',
              'link', 'inserttable', 'tableColumn', 'placeholder', 'sourceediting', '|',
            ],
          }
        }}
        data={props.value}
        onChange={(e, i) => {
          props.onChange({ target: { value: i.getData(), name: props.name } })
        }}
      />
    </CKEditorContext>
  );
}

export default Ckeditor;
