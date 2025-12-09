import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { observer } from 'mobx-react';
import store, { TreeNode } from './store';
import { Box, Button } from '@mui/material';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(1, 2),
    margin: theme.spacing(0.5, 0),
    // backgroundColor: '#d1dffc'
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function CollapseIcon(
  props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>,
) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />;
}

type BorderedTreeViewProps = {
};


const BorderedTreeView = observer((props: BorderedTreeViewProps) => {

  const buildTree = (node: TreeNode) => {
    return <CustomTreeItem itemId={node.id.toString()} label={<>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <span>
          {node.name}
          <span style={{opacity: "70%"}} >  {node.short_name && `(${node.short_name})`}</span>
        </span>

        <Box display={"flex"} alignItems={"center"}>
          <Button onClick={() => store.onEditClicked(0, node.id)}>
            Добавить
          </Button>
          <Button onClick={() => store.onEditClicked(node.id, 0)}>
            Редактировать
          </Button>
        </Box>
      </Box>
    </>}>
      {node.children.map(children => {
        return buildTree(children)
      })}
    </CustomTreeItem>
  }

  return (
    <SimpleTreeView
      aria-label="customized"
      disableSelection
      disabledItemsFocusable
      expansionTrigger='iconContainer'
      defaultExpandedItems={['1']}
      slots={{
        expandIcon: ExpandIcon,
        collapseIcon: CollapseIcon,
        endIcon: EndIcon,
      }}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, }}
    >
      {store.treeData.map(node => {
        return buildTree(node)
      })}
    </SimpleTreeView>
  );
})


export default BorderedTreeView