import React from 'react';
import ReactDOM from 'react-dom';

import ApplicantTable from './ApplicantTable';
import ApplicationContextMenu from "./ApplicationContextMenu";

ReactDOM.render(
  <div className="container">
  <ApplicantTable />
  <ApplicationContextMenu />
  </div>
  , document.querySelector('.container'));
