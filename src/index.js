import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { Grid } from './components';

ReactDOM.render(
  <Grid rows={50} cols={50} threshold={5} />,
  document.getElementById('root')
);
