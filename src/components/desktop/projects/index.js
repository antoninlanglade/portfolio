import React from 'react';
import ReactDOM from 'react-dom';
import _ from '_';
import {Localize, Link, i18n, i18nComponent, Asset, assets, router} from 'dan';
import config from 'config';
import './styles.scss';

@i18nComponent
export default class Projects extends React.Component {
    constructor(props) {
      super(props);
      this.dom = [];
      this.data = {};
      this.sync();
    }

    sync() {
      this.data = i18n.localize('data', null, 'data', i18n.locale);
    }

    componentDidMount() {
      _.forEach(this.data,(item,key) => {
        this.dom.push(ReactDOM.findDOMNode(this.refs["project"+key]));
      });
      
    }
    onHover(key, direction) {
      var opacity;
      if (direction===Projects.direction.IN) {
        _.forEach(this.dom, (item, currentKey) => {
            if (key !== currentKey) {
              item.style.color = "rgba(0,0,0,0.25)";  
            }      
        });
      }
      else if (direction===Projects.direction.OUT) {
        _.forEach(this.dom, (item) => {
            item.style.color = "rgb(0,0,0)";
        });
      } 
    }

    goToProject(route, e) {
      e.preventDefault();
      if (router.ctx.params.projectId !== route) {
        router.goto(router.getRoute('project',{
          projectId : route
        }));  
      }
    }

    render() {
      var projects = {
        left : [],
        right : []
      };
      var middle = Math.round(this.data.length / 2); 
      _.forEach(this.data,(item, key) => {
        var column = key < middle ? projects.left : projects.right
        column.push(
          <div className={item.color + " project"} key={key} onMouseOver={this.onHover.bind(this,key,Projects.direction.IN)} onMouseOut={this.onHover.bind(this,key,Projects.direction.OUT)}>
            <Link onClick={this.goToProject.bind(this, item.route)} ref={'project'+key}>
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
Projects.direction = {
  IN : 1,
  OUT : 2
}