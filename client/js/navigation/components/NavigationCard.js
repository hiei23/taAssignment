import React from 'react';

import NavigationMasterlistContainer from '../containers/NavigationMasterlistContainer'
import NavigationSublistContainer from '../containers/NavigationSublistContainer'

var classNames = require('classnames');

function GetCardClassName(props) {
    return classNames({
        'pt-card': true,
        'no-padding': !props.maximizeNavigation
    });
}

export default class NavigationCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let navigation = null;

        if (this.props.maximizeNavigation)
        {
            navigation = <NavigationMasterlistContainer/>
        }
        else
        {
            navigation = <NavigationSublistContainer/>
        }
    
        return (
            <div id="navigation-card" className={GetCardClassName(this.props)}>
                {navigation}
            </div>
        );
    }
}

NavigationCard.propTypes = {
    maximizeNavigation: React.PropTypes.bool.isRequired
};
