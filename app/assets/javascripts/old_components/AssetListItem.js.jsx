/** @jsx React.DOM */

var AssetListItem = React.createClass({
  render: function() {
    var checkboxId = 'asset-list-item--' + this.props.key;

    return <li className="AssetListItem">
      <input type="checkbox" id={checkboxId} onChange={this.props.onToggle} checked={this.props.data.selected} />
      <label htmlFor={checkboxId}>{this.props.data.name}</label>
    </li>;
  }
});