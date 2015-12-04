import React from 'react';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'dan';
import config from 'config';
import './styles.scss';
import Data from 'components/app/projectsData.json';

@i18nComponent
export default class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    	var projects = {
        left : [],
        right : []
      };
      var middle = Math.round(Data.length / 2); 
      _.forEach(Data,(item, key) => {
			var column = key < middle ? projects.left : projects.right
			column.push(
				<div className={item.color + " project"} key={key} >
          <Link route={item.route}>
            <span className="name">{item.name}</span>
            <span className="date"> - {item.date}</span>
          </Link>
				</div>
			);
      });
      
        return (
            <div className="component projects">
      			<div className="left">{projects.left}</div>
              	<div className="right">{projects.right}</div>          
            </div>
        );
    }
}