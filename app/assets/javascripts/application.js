//= require bower_components/eventEmitter/EventEmitter.js
//= require bower_components/moment/moment
//= require bower_components/jquery/dist/jquery
//= require bower_components/underscore/underscore
//= require bower_components/backbone/backbone
//= require bower_components/showdown/compressed/showdown
//= require bower_components/react/react-with-addons
//= require bower_components/react-async/react-async
//= require bower_components/react-router-component/react-router-component

//= require Dispatcher
//= require GuideStore
//= require GuideModel
//= require_tree ./components

React.renderComponent(Application(), document.body);