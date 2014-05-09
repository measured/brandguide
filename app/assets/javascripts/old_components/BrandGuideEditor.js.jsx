/** @jsx React.DOM */

//= require ./Modal

var SectionEditor = React.createClass({
  handleTitleChange: function(event) {
    this.props.section.set('title', event.target.value);
    this.props.guide.trigger('change');
  },
  handleContentChange: function(event) {
    this.props.section.set('content', event.target.value);
    this.props.guide.trigger('change');
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.props.guide.save();
  },
  render: function() {
    return (
      <div key={this.props.section.get('id')}>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.props.section.get('title')} onChange={this.handleTitleChange} />
          <textarea onChange={this.handleContentChange}>{this.props.section.get('content')}</textarea>
          {this.props.section.get('assetGroups')}
        </form>
      </div>
    );
  }
});

var EditorContent = React.createClass({
  render: function() {
    var self = this;

    var editorPages = this.props.guide.get('pages').map(function(page) {
      var pageSections = page.get('sections').map(function(section) {
        return (
          <SectionEditor
            key={section.get('id')}
            guide={self.props.guide}
            page={page}
            section={section} />
        );
      });

      return (
        <div key={page.id}>
          <h1>{page.get('title')}</h1>
          {page.get('content')}
          {pageSections}
        </div>
      );
    });

    return (
      <div className="EditorContent editor__content">
        {editorPages}
      </div>
    )
  }
});

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

    var self = this;

    this.props.guide.save({}, {
      success: function() {
        self.setState({ settingsOpen: false });
      }
    });
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
        var editSectionUrl = '/'+self.props.guide.get('slug')+'/pages/'+page.get('slug')+'/'+section.get('id')+'/edit';

        return (<li key={section.get('id')} className="tree__section">
          <a href={editSectionUrl}>{section.get('title')}</a>
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
          <input type="submit" />
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

var BrandGuideSection = Backbone.Model.extend({
  defaults: {
    title: 'Untitled',
    assetGroups: []
  }
});

var BrandGuideSectionsCollection = Backbone.Collection.extend({
  model: BrandGuideSection
});

var BrandGuidePage = Backbone.Model.extend({
  defaults: {
    title: 'Untitled',
    sections: []
  },
  parse: function(response) {
    response.sections = new BrandGuideSectionsCollection(response.sections);
  },
  set: function(attributes, options) {
    if(attributes.sections !== undefined && !(attributes.sections instanceof BrandGuideSectionsCollection)) {
      attributes.sections = new BrandGuideSectionsCollection(attributes.sections);
    }

    return Backbone.Model.prototype.set.call(this, attributes, options);
  },
  toJSON: function() {
    var json = this.attributes;

    json.sections_attributes = _.clone(json.sections.toJSON());

    return json;
  }
});

var BrandGuidePagesCollection = Backbone.Collection.extend({
  model: BrandGuidePage
});

var BrandGuideModel = Backbone.Model.extend({
  defaults: {
    title: 'Untitled',
    pages: []
  },
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
  toJSON: function() {
    var json = this.attributes;
    var pages = _.clone(json.pages.toJSON());

    json.sections_attributes = [];

    pages.forEach(function(page) {
      var sections = _.clone(page.sections_attributes);

      json.sections_attributes.push(page);

      sections.forEach(function(section) {
        json.sections_attributes.push(section);
      });
    });

    console.log({
      brand_guide: json
    });

    return {
      brand_guide: json
    }
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
      <EditorContent guide={this.state.model} />
      <Modal onClose={this.modal.close} data={this.state.modal} />
    </div>);
  }
});