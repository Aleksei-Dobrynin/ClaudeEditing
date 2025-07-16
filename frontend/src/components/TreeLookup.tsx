import { FC } from 'react'
import {
  InputLabel
} from '@mui/material';
import DropdownTreeSelect from "react-dropdown-tree-select";
import 'react-dropdown-tree-select/dist/styles.css'
import "./treeLookUp.css";
import { observer } from 'mobx-react';
import styled from "styled-components";


type TreeLookUpProps = {
  data: { name: string, id: number, parent_id: number, short_name: string }[];
  value: any;
  id: string;
  label?: string;
  onChange: (e: any) => void;
  currentId?: number;
  hideLabel?: boolean;
  name: string;
  disabled?: boolean;
};

const TreeLookUp: FC<TreeLookUpProps> = observer((props) => {

  const createDataTree = (dataset: { name: string, id: number, parent_id: number, short_name: string }[], id: number) => {
    if (id === null) id = 0;
    const hashTable = Object.create(null);

    dataset.filter(x => x.id !== props.currentId).forEach(aData => hashTable[aData.id] = {
      label: aData.name + (aData.short_name ?  `  (${aData.short_name})` : ""),
      value: aData.id,
      expanded: true,
      checked: aData.id === id,
      children: []
    });
    const dataTree = [{
      label: "Не выбрано",
      value: 0,
      expanded: true,
      checked: id == 0,
      children: []
    }];
    dataset.filter(x => x.id !== props.currentId).forEach(aData => {
      if (aData.parent_id && hashTable[aData.parent_id]) {
        if (hashTable[aData.parent_id].children === null) hashTable[aData.parent_id].children = []
        hashTable[aData.parent_id].children.push(hashTable[aData.id])
      }
      else dataTree.push(hashTable[aData.id])
    });
    return dataTree;
  };

  let data = createDataTree(props.data, props.value)

  return (
    <Root>
      {!props.hideLabel && <InputLabel>{props.label}</InputLabel>}
      <DropdownTreeSelect
        id={props.id}
        className="mdl-demo"
        data={data}
        disabled={props.disabled}
        onChange={(curNode) => {
          let value = 0;
          if (curNode.checked === true) {
            value = +curNode.value;
          }
          let event = { target: { name: props.name, value: value } };
          props.onChange(event);
        }}
        keepTreeOnSearch={true}
        mode={"radioSelect"}
        inlineSearchInput={true}
        texts={{
          inlineSearchPlaceholder: "Поиск",
          placeholder: "Выбрать",
          label: props.label
        }}
      />
    </Root>
  )
})

const Root = styled.div`
  width: 100%;
  .placeholder {
    background: white;
  }
`

export default TreeLookUp
