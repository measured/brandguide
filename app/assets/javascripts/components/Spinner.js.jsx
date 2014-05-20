/** @jsx React.DOM */

var Spinner = React.createClass({
  render: function() {
    return (
      <div className="Spinner" data-show={this.props.show}>
        <div>
          <div className="iconContainer"><Icon name="sync" /></div>
        </div>
      </div>
    );
  }
});