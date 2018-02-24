import React, {Component, PropTypes} from 'react';
import NamePicker from './NamePicker';
import BirthPicker from './BirthPicker';

export default class App extends Component {
  render() {
    return (
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">Available slots for Dr.Sumit</h1>
        </header>
        <main className="page-body">
          <NamePicker />
        </main>
      </div>
    );
  }
}
