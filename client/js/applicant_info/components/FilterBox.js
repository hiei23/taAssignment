import React, { Component } from "react";
import Serialize from "form-serialize";


export default class FilterBox extends Component {
    handleOnchange()
    {
        var form = document.querySelector('#filterBox');
        var obj = Serialize(form, { hash: true });
        return obj
    }

    renderSlider(name, value, index) {
        return(
            <div key={index}>
                <label className="switch">
                    <input
                          type="checkbox"
                          name={name}
                          onChange={() => this.props.filterType(value, this.props.table, this.handleOnchange())}
                          value={value} />
                    <div className="slider round"></div>
                </label>
                <label className="filterTypeLabel">
                    {name}
                </label>
            </div>
        );
    }

    renderFilter(type, options) {
        const Sliders = options.map((item,index) => {
            return this.renderSlider(item.name, item.value, index)
        });
        
        return(
            <div className="filter-card-item">
                <h5>{type}</h5>
                {Sliders}
            </div>
        );
	}

	render() {
		const Filters = this.props.filters.map((item, index) => {
			return 	<div key={index}>
						{this.renderFilter(item.type, item.options)}
					</div>
		});
        
        if (this.props.maximizeNavigation)
        {
            return null;
        }

        return (
            <div id="filter-card" className="pt-card">
                <form id="filterBox" >
                    <h4>Filters</h4>
                    <hr></hr>
                    {Filters}
                </form>
            </div>
  )}
}

FilterBox.propTypes = {
  table: React.PropTypes.array.isRequired,
  filterType: React.PropTypes.func.isRequired,
  filters: React.PropTypes.array.isRequired,
  maximizeNavigation: React.PropTypes.bool
}