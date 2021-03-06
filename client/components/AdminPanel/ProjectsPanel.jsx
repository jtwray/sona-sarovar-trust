import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ProjectListPanel from './ProjectsPanel/ProjectListPanel';
import ProjectAddPanel from './ProjectsPanel/ProjectAddPanel';
import ProjectEditPanel from './ProjectsPanel/ProjectEditPanel';

const ProjectsPanel = () => (
  <div className="controller projects-panel">
    <h1>Projects Panel</h1>
    <Switch>
      <Route path="/admin/projects/edit/:index" component={ProjectEditPanel} />
      <Route path="/admin/projects/add" component={ProjectAddPanel} />
      <Route path="/admin/projects" component={ProjectListPanel} />
    </Switch>
  </div>
);

export default ProjectsPanel;
