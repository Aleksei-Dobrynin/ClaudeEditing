// placeholder/placeholderui.js

import { getS_PlaceHolderTemplates } from 'api/S_PlaceHolderTemplate';
import {
  Plugin,
  ViewModel,
  addListToDropdown,
  createDropdown,
  Collection
} from 'ckeditor5';

export default class PlaceholderUI extends Plugin {
  async init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('placeholder', (locale) => {
      const dropdownView = createDropdown(locale);

      getS_PlaceHolderTemplates().then(response => {
        if ((response.status === 201 || response.status === 200) && response?.data) {
          const res = response.data.map(x => x.name)
          addListToDropdown(dropdownView, getDropdownItemsDefinitions(res));
        } else {
          throw new Error();
        }
      })
        .catch(x => {
          console.log(x)
        })

      dropdownView.buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t('Placeholder'),
        tooltip: true,
        withText: true
      });

      // Disable the placeholder button when the command is disabled.
      const command = editor.commands.get('placeholder');
      dropdownView.bind('isEnabled').to(command);

      // Execute the command when the dropdown item is clicked (executed).
      this.listenTo(dropdownView, 'execute', evt => {
        editor.execute('placeholder', { value: evt.source.commandParam });
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }
}

function getDropdownItemsDefinitions(placeholderNames) {
  const itemDefinitions = new Collection();

  for (const name of placeholderNames) {
    const definition = {
      type: 'button',
      model: new ViewModel({
        commandParam: name,
        label: name,
        withText: true
      })
    };

    // Add the item definition to the collection.
    itemDefinitions.add(definition);
  }

  return itemDefinitions;
}
