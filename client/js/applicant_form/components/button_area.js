import React from 'react';


class ButtonArea extends React.Component {

  render() {
    let prevBtn = null;
    let nextBtn = null;
    if(this.props.showPrevBtn) { prevBtn = <button className="pt-button" type="button" onclick={this.props.prevStep}>Previous</button> }
    if(this.props.showNextBtn) { nextBtn = <button className="pt-button" type="button" onclick={this.props.prevStep}>Next</button> }

    return(
      <div id="button-bar">
        <div className="pt-button-group pt-fill" style={{width: '100px', display: 'inline-block'}}>
          { prevBtn }
          { nextBtn }
        </div>
        <button className="pt-button" onClick={ this.props.save }>Save and Continue</button>
      </div>
    );
  }

}


export default ButtonArea
