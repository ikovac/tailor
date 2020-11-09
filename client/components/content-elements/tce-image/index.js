import Edit from './edit';
import info from './info';
import Toolbar from './edit/Toolbar';

const initState = () => ({ url: null, name: null });

export default {
  ...info,
  name: 'Image',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-image',
    forceFullWidth: false
  }
};
