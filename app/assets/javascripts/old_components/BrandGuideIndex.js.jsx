/** @jsx React.DOM */

//= require ./Modal

var GuidesBtn = React.createClass({
  render: function() {
    return (<a href={'/'+this.props.data.slug+'/edit'} className="guides__btn">
      <span className="guides__img" />
      <span className="guides__title">{this.props.data.title}</span>
    </a>);
  }
});

var Guides = React.createClass({
  render: function() {
    var guides = this.props.guides.map(function(guide) {
      return (<GuidesBtn key={guide.slug} data={guide} />);
    });

    return (<div className="guides">
      <div className="guides__list">
        {guides}
      </div>

      <a href="#" onClick={this.props.onNewButtonClick} className="guides__create-btn">New Brand Guide</a>
    </div>);
  }
});

var BrandGuideIndex = React.createClass({
  mixins: [ModalMixin],
  handleNewButtonClick: function(event) {
    event.preventDefault();
    this.modal.open({
      title: 'Create New Brand Guide',
      content: (<form action="/" method="post">
        <input type="text" placeholder="Title" name="brand_guide[title]" />
        <input type="hidden" name="authenticity_token" value={window.csrfToken} />
        <input type="submit" />
      </form>)
    });
  },
  render: function() {
    return (<div>
      <Header user={this.props.currentUser} />
      <Guides onNewButtonClick={this.handleNewButtonClick} guides={this.props.guides} />
      <Modal onClose={this.modal.close} data={this.state.modal} />
    </div>);
  }
});