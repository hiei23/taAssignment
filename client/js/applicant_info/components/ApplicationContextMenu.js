import React, { Component } from 'react';
import { ContextMenu } from "react-contextmenu";
import ApplicationContextMenuItem from "./ApplicationContextMenuItem"

const items_name = [  {name:"View Details", action:"View"}, 
                      {name:"Assign Position", action:"Assign"}
                    ];

const item_list = items_name.map( (item, index) => 
  
    <ApplicationContextMenuItem key={index} name={item.name} action={item.action} />
);

export default class ApplicationContextMenu extends Component {

    render() {
    return (    
          <ContextMenu id="some_unique_identifier">
            {item_list}
          </ContextMenu>
    );
  }
}