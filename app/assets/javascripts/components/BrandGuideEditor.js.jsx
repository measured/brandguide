/** @jsx React.DOM */

//= require ./Modal

var EditorTree = React.createClass({
  getInitialState: function() {
    return {
      open: true
    }
  },
  toggleTree: function(event) {
    event.preventDefault();
    this.setState({ open: !this.state.open });
  },
  addPage: function(event) {
    event.preventDefault();
    this.props.modal.open({ title: 'Add Page', content: (
      <form action={'/'+this.props.guide.slug+'/pages'} method="post">
        <input type="hidden" name="authenticity_token" value={window.csrfToken} />
        <input type="text" placeholder="Title" name="page[title]" />
        <input type="submit" />
      </form>
    ) });
  },
  addSection: function(page, event) {
    event.preventDefault();
    this.props.modal.open({ title: 'Add Section', content: (
      <form action={'/'+this.props.guide.slug+'/pages/'+page.slug+'/sections'} method="post">
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

    var pages = this.props.guide.pages.map(function(page) {
      var sections = page.sections.map(function(section) {
        var editSectionUrl = '/'+self.props.guide.slug+'/pages/'+page.slug+'/'+section.id+'/edit';

        return (<li className="tree__section">
          <a href={editSectionUrl}>{section.title}</a>
        </li>);
      });

      var editPageUrl = '/'+self.props.guide.slug+'/pages/'+page.slug+'/edit';

      return (<li key={page.id} className="tree__page">
        <a href={editPageUrl}>{page.title}</a>
        <ul className="tree__sectionlist">
          {sections}
          <li className="tree__section">
            <a onClick={self.addSection.bind(self, page)} className="tree__btn" href="#">+ add section</a>
          </li>
        </ul>
      </li>);
    });

    return (<div className={classSet}>
      <a onClick={this.toggleTree} href="#" className="editor__toggle">
        <span className="_icon ss-icon">record</span>
        <span className="_icon ss-icon">record</span>
        <span className="_icon ss-icon">record</span>
      </a>

      <div className="tree__header">
        <a className="ss-icon _icon" href="/">left</a>
        <h1 className="_text">{this.props.guide.title}</h1>
        <a className="ss-icon _icon" href="#">settings</a>
      </div>

      <div className="tree__list">
        <ul className="tree__pagelist">
          {pages}
          <li className="tree__page">
            <a className="tree__btn" href="#" onClick={this.addPage}>+ add page</a>
          </li>
        </ul>
      </div>
    </div>);
  }
});

var BrandGuideEditor = React.createClass({
  mixins: [ModalMixin],
  render: function() {
    return (<div className="BrandGuideEditor editor">
      <EditorTree modal={this.modal} guide={this.props.guide} />
      <div className="editor__content">
        {this.props.guide.title}
      </div>
      <Modal onClose={this.modal.close} data={this.state.modal} />
    </div>);
  }
});