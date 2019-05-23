import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config.js';
import GameRoom from '../imports/ui/pages/gameRoom/gameRoom';

Meteor.startup(() => {
  render(<GameRoom/>, document.getElementById('render-target'));
});
