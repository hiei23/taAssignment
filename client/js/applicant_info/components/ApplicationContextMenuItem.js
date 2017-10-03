import React, { Component } from 'react';
import { MenuItem } from "react-contextmenu";

export default class ApplicationContextMenuItem extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    action: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (e, action, node) {
      alert(action.name + " Applicant id: " + node.childNodes[0].innerHTML);
      /*console.log(action.name + " Applicant id: " + node.childNodes[0].innerHTML);*/
  }

    render() {
        return (
            <MenuItem 
                data={{name:this.props.action}} 
                className="context-menu__link" 
                onClick={this.handleClick}>
                {this.props.name}
            </MenuItem>);
  }
}