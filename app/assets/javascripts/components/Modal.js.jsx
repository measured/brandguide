/** @jsx React.DOM */

var ModalMixin = {
  getInitialState: function() {
    return {
      modal: {}
    }
  },
  componentWillMount: function() {
    var self = this;

    this.modal = {
      open: function(modalState) {
        self.setState({ modal: modalState })
      },
      close: function() {
        self.setState({ modal: {} });
      }
    }
  },
  handleKeyUp: function(event) {
    if(event.keyCode === 27) this.modal.close();
  },
  componentDidMount: function() {
    window.addEventListener('keyup', this.handleKeyUp, false);
  },
  componentWillUnmount: function() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}

var Modal = React.createClass({
  render: function() {
    return (<div className="Modal" data-open={!!this.props.data.content}>
      <div className="ModalContainer">
        <div className="ModalHeader">
          <div className="ModalTitle">{this.props.data.title}</div>
          <Btn icon="close" onClick={this.props.onClose} />
        </div>
        <div className="ModalContent">{this.props.data.content}</div>
      </div>
    </div>)
  }
});