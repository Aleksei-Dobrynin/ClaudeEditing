import { FC, useState } from "react";
import { observer } from "mobx-react"
import styled from "styled-components";
import {
  EditorProvider,
  Editor,
  Toolbar
} from 'react-simple-wysiwyg';
import EditorFull from 'react-simple-wysiwyg';

type RichTextEditorProps = {
  id?: string;
  name: string;
  value: string;
  minHeight?: number;
  style?: object;
  disabled?: boolean;
  changeValue: (value: string, name: string) => void;
};

const RichTextEditor: FC<RichTextEditorProps> = observer((props) => {

  return (
    <FullWidth>
      <EditorFull
        disabled={props.disabled}
        style={props.style ? props.style : { minHeight: props.minHeight }}
        value={props.value}
        onChange={(e) => { props.changeValue(e.target.value, props.name) }}
      />
    </FullWidth>
  );
});


const FullWidth = styled.div`
  width: 100%;
  .MuiTabs-scrollButtons.Mui-disabled {
    opacity: 0.3;
  }
`

export default RichTextEditor;