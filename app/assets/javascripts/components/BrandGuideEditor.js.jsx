/** @jsx React.DOM */

//= require ./Modal

var EditorTree = React.createClass({
  getInitialState: function() {
    return {
      open: true,
      settingsOpen: false
    }
  },
  toggleSettings: function(event) {
    event.preventDefault();
    this.setState({ settingsOpen: !this.state.settingsOpen })
  },
  handleTitleChange: function(event) {
    this.props.guide.set('title', event.target.value);
  },
  handleSettingsSubmit: function(event) {
    event.preventDefault();
    this.props.guide.save();
  },
  toggleTree: function(event) {
    event.preventDefault();
    this.setState({ open: !this.state.open });
  },
  addPage: function(event) {
    event.preventDefault();
    this.props.modal.open({ title: 'Add Page', content: (
      <form action={'/'+this.props.guide.get('slug')+'/pages'} method="post">
        <input type="hidden" name="authenticity_token" value={window.csrfToken} />
        <input type="text" placeholder="Title" name="page[title]" />
        <input type="submit" />
      </form>
    ) });
  },
  addSection: function(page, event) {
    event.preventDefault();
    this.props.modal.open({ title: 'Add Section', content: (
      <form action={'/'+this.props.guide.get('slug')+'/pages/'+page.get('slug')+'/sections'} method="post">
        <input type="hidden" name="authenticity_token" value={window.csrfToken} />
        <input type="text" placeholder="Title" name="section[title]" />
        <input type="submit" />
      </form>
    ) });
  },
  render: function() {
    var self = this;

    var style = {};

    var classSet = React.addons.classSet({
      EditorTree: true,
      editor__tree: true,
      open: this.state.open
    });

    var pageList = this.props.guide.get('pages').map(function(page) {
      var sections = page.get('sections').map(function(section) {
        var editSectionUrl = '/'+self.props.guide.get('slug')+'/pages/'+page.get('slug')+'/'+section.id+'/edit';

        return (<li key={section.id} className="tree__section">
          <a href={editSectionUrl}>{section.title}</a>
        </li>);
      });

      var editPageUrl = '/'+self.props.guide.get('slug')+'/pages/'+page.get('slug')+'/edit';

      return (<li key={page.get('id')} className="tree__page">
        <a href={editPageUrl}>{page.get('title')}</a>
        <ul className="tree__sectionlist">
          {sections}
          <li className="tree__section">
            <a onClick={self.addSection.bind(self, page)} className="tree__btn" href="#">+ add section</a>
          </li>
        </ul>
      </li>);
    });

    var settingsClassSet = React.addons.classSet({
      tree__settings: true,
      open: this.state.settingsOpen
    });

    return (<div className={classSet}>
      <a onClick={this.toggleTree} href="#" className="editor__toggle">
        <span className="_icon ss-icon">record</span>
        <span className="_icon ss-icon">record</span>
        <span className="_icon ss-icon">record</span>
      </a>

      <div className="tree__header">
        <a className="ss-icon _icon" href="/">left</a>
        <h1 className="_text">{this.props.guide.get('title')}</h1>
        <a className="ss-icon _icon" href="#" onClick={this.toggleSettings}>settings</a>
      </div>

      <div className={settingsClassSet}>
        <form onSubmit={this.handleSettingsSubmit}>
          <input type="text" value={this.props.guide.get('title')} onChange={this.handleTitleChange} />
        </form>
      </div>

      <div className="tree__list">
        <ul className="tree__pagelist">
          {pageList}
          <li className="tree__page">
            <a className="tree__btn" href="#" onClick={this.addPage}>+ add page</a>
          </li>
        </ul>
      </div>
    </div>);
  }
});

var BrandGuidePage = Backbone.Model.extend({
  defaults: {
    title: 'Untitled',
    sections: []
  }
});

var BrandGuidePagesCollection = Backbone.Collection.extend({
  model: BrandGuidePage
});

var BrandGuideModel = Backbone.Model.extend({
  url: function() {
    return '/'+this.get('slug')+'.json'
  },
  parse: function(response) {
    response.pages = new BrandGuidePagesCollection(response.pages);
    return response;
  },
  set: function(attributes, options) {
    if(attributes.pages !== undefined && !(attributes.pages instanceof BrandGuidePagesCollection)) {
      attributes.pages = new BrandGuidePagesCollection(attributes.pages);
    }

    return Backbone.Model.prototype.set.call(this, attributes, options);
  },
  defaults: {
    title: 'Untitled',
    pages: []
  }
});

var BrandGuideEditor = React.createClass({
  mixins: [ModalMixin],
  getInitialState: function() {
    return {
      model: new BrandGuideModel()
    }
  },
  componentWillMount: function() {
    var self = this;

    this.state.model.on('change', function() {
      self.forceUpdate();
    });

    var Router = Backbone.Router.extend({
      routes: {
        ':id/edit': 'edit',
        ':id/pages/:pageId/edit': 'editPage',
        ':id/pages/:pageId/sections/:sectionId': 'editPageSection'
      }
    });

    this.router = new Router();

    this.router.on('route:edit', function(id) {
      self.state.model.set('slug', id);
      self.state.model.fetch();
    });

    this.router.on('route:editPage', function(id, pageId) {
      console.log('edit', id, pageId);
    });

    this.router.on('route:editPageSection', function(id, pageId, sectionId) {
      console.log('edit', id, pageId, sectionId);
    })

    Backbone.history.start({ pushState: true });
  },
  componentWillUnmount: function() {
    this.state.model.off('change');
  },
  render: function() {
    return (<div className="BrandGuideEditor editor">
      <EditorTree modal={this.modal} guide={this.state.model} />
      <div className="editor__content">
        Editor
      </div>
      <Modal onClose={this.modal.close} data={this.state.modal} />
    </div>);
  }
});