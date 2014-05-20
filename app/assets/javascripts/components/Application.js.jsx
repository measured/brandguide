/** @jsx React.DOM */

var LOCALSTORAGE_AUTH_KEY = 'brandguideAuth';

var Location = ReactRouter.Location;
var Locations = ReactRouter.Locations;

var clone = function(object) {
  return JSON.parse(JSON.stringify(object));
}

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

var ButtonGroup = React.createClass({
  render: function() {
    return (
      <div className="ButtonGroup">{this.props.children}</div>
    );
  }
});

var Icon = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <i className="Icon ss-icon">{this.props.name}</i>
    );
  }
});

var Button = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    if(typeof this.props.onClick === 'function') this.props.onClick(event);
  },
  render: function() {
    var children = [];

    if(this.props.icon) {
      children.push(<Icon key="icon" name={this.props.icon} />);
    }

    if(this.props.text) {
      children.push(<span key="text" className="text">{this.props.text}</span>);
    }

    return this.transferPropsTo(
      <a onClick={this.handleClick} className="Button" href="#">
        {children}
      </a>
    );
  }
});

var Header = React.createClass({
  render: function() {
    var avatarStyle = {
      backgroundImage: 'url('+this.props.user.gravatar+')'
    }

    if(!this.props.user.gravatar) avatarStyle = {}

    return (
      <div className="Header">
        <div className="content">
          <h1><a href="/">brandguide.io</a></h1>

          <div className="user">
            <Button onClick={this.props.onLogout} icon="logout" className="plain" text="Sign out" />
            
            <span className="separator">&bull;</span>
            
            <a className="profile" href="#">
              <span>{this.props.user.email}</span>
              <i className="avatar" style={avatarStyle} />
            </a>
          </div>
        </div>
      </div>
    );
  }
});

var DrawerSectionsListItem = React.createClass({
  getInitialState: function() {
    return {
      input: {
        icon: 'plus',
        placeholder: 'Add Section'
      }
    }
  },
  handleKeyUp: function() {
    var input = this.refs.input.getDOMNode();

    if(event.keyCode === 13) {
      GuideStore.find(this.props.guide.slug).addSection(input.value, this.props.section.slug);
    }

    if([13, 27].indexOf(event.keyCode) !== -1) {
      input.value = null;
      input.blur();
    }
  },
  handleInputFocus: function() {
    this.setState({
      input: {
        icon: 'openbook',
        placeholder: 'Enter title'
      }
    });
  },
  handleInputBlur: function() {
    this.setState({ input: this.getInitialState().input });
    this.refs.input.getDOMNode().value = null;
  },
  handleClick: function(event) {
    event.preventDefault();
    Dispatcher.trigger('navigate', event.target.pathname, { replace: true });
  },
  render: function() {
    var self = this;
    var guide = GuideStore.find(this.props.guide.slug);
    var icon = this.props.selected ? 'navigatedown' : 'navigateright';

    var children = guide.childrenOfSection(this.props.section.id).map(function(child) {
      return (
        <li key={child.id}><a onClick={self.handleClick} href={'/'+self.props.guide.slug+'/'+child.slug}><span>{child.title}</span></a></li>
      );
    });

    return (
      <li className="DrawerSectionsListItem" data-selected={this.props.selected}>
        <a onClick={this.handleClick} href={'/'+this.props.guide.slug+'/'+this.props.section.slug}>
          <span>{this.props.section.title || 'Untitled'}</span>
        </a>
        <ul>
          {children}
          <li className="addSection">
            <Icon name={this.state.input.icon} /><input onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} type="text" ref="input" placeholder={this.state.input.placeholder} onKeyUp={this.handleKeyUp} />
          </li>
        </ul>
      </li>
    );
  }
});

var DrawerSectionsList = React.createClass({
  getInitialState: function() {
    return {
      input: {
        icon: 'plus',
        placeholder: 'Add Page'
      }
    }
  },
  handleKeyUp: function() {
    var input = this.refs.input.getDOMNode();

    if(event.keyCode === 13) {
      GuideStore.find(this.props.guide.slug).addSection(input.value, null);
    }

    if([13, 27].indexOf(event.keyCode) !== -1) {
      input.value = null;
      input.blur();
    }
  },
  handleInputFocus: function() {
    this.setState({
      input: {
        icon: 'openbook',
        placeholder: 'Enter title'
      }
    });
  },
  handleInputBlur: function() {
    this.setState({ input: this.getInitialState().input });
    this.refs.input.getDOMNode().value = null;
  },
  render: function() {
    var self = this;

    var drawerSectionsListItems = (this.props.guide.sections || []).map(function(section) {
      if(section.parent_id) return;

      var selected = self.props.section ?
        (self.props.section.slug === section.slug) || (section.id === self.props.section.parent_id) :
        false;
      
      return (
        <DrawerSectionsListItem
          key={section.id}
          section={section}
          guide={self.props.guide}
          selected={selected} />
      );
    });

    return (
      <ul className="DrawerSectionsList">
        {drawerSectionsListItems}
        <li className="addSection">
          <Icon name={this.state.input.icon} /><input onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} type="text" ref="input" placeholder={this.state.input.placeholder} onKeyUp={this.handleKeyUp} />
        </li>
      </ul>
    );
  }
});

var Drawer = React.createClass({
  handleToggle: function(event) {
    event.preventDefault();
    this.props.onToggle();
  },
  handleBack: function() {
    Dispatcher.trigger('navigate', '/');
  },
  render: function() {
    return (
      <div className="Drawer" data-open={this.props.open}>
        <div className="contents" onClick={this.props.onOpenDrawer}>
          <header>
            <Button onClick={this.handleBack} className="back plain" icon="back" />
            <h2>{this.props.guide.title}</h2>
            <Button className="settings plain" icon="gear" />
          </header>
          <div className="content">
            <h3>Pages</h3>

            <DrawerSectionsList guide={this.props.guide} section={this.props.section} />
          </div>
        </div>
        <div className="toggle">
          <a href="#" onClick={this.handleToggle}><i /><i /><i /></a>
        </div>
      </div>
    );
  }
});

var MarkdownContentInput = React.createClass({
  componentWillMount: function() {
    this.converter = new Showdown.converter();
  },
  render: function() {
    var markup = this.converter.makeHtml(this.props.value || '');

    return (
      <div className="input contentInput MarkdownContentInput">
        <textarea onChange={this.props.onChange} value={this.props.value} placeholder={this.props.placeholder} />
        <div className="preview">
          <label>Preview</label>
          <div className="previewHtml" dangerouslySetInnerHTML={{__html: markup}} />
        </div>
      </div>
    );
  }
});

var AssetGroup = React.createClass({
  getInitialState: function() {
    return {
      drag: null,
      displayMode: 'list',
      selectedAssets: []
    }
  },
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.updateSectionAssetGroup(this.props.section.slug, this.props.assetGroup.id, { title: event.target.value });
  },
  handleInputKeyUp: function(event) {
    if([27,13].indexOf(event.keyCode) !== -1) {
      event.target.blur();
    }
  },
  handleDelete: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.deleteAssetGroup(this.props.section.slug, this.props.assetGroup.id);
  },
  handleDragStart: function(event) {
    event.preventDefault();
    event.dataTransfer.effectAllowed = 'copyMove';
    this.setState({ drag: 'start' });
  },
  handleDragEnter: function(event) {
    event.preventDefault();
    this.setState({ drag: 'enter' });
  },
  handleDragOver: function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    this.setState({ drag: 'over' });
  },
  handleDragLeave: function(event) {
    event.preventDefault();
    this.setState({ drag: 'leave' });
  },
  handleDrop: function(event) {
    event.stopPropagation();
    event.preventDefault();

    var guide = GuideStore.find(this.props.guide.slug);

    guide.uploadAssets(this.props.section.slug, this.props.assetGroup.id, event.dataTransfer.files);

    this.setState({ drag: 'drop' });
  },
  toggleDisplayMode: function() {
    var displayMode = this.state.displayMode === 'list' ? 'grid' : 'list';
    this.setState({ displayMode: displayMode });
  },
  toggleAssetSelection: function(id, event) {
    var selectedAssets = this.state.selectedAssets;

    if(selectedAssets.indexOf(id) === -1) {
      selectedAssets.push(id);
    } else {
      selectedAssets.splice(selectedAssets.indexOf(id), 1);
    }

    this.setState({ selectedAssets: selectedAssets });
  },
  deleteSelectedAssets: function() {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.deleteAssets(this.props.section.slug, this.props.assetGroup.id, this.state.selectedAssets);
    this.setState({ selectedAssets: [] });
  },
  render: function() {
    var self = this;

    var mtime = moment.unix(this.props.assetGroup.mtime).fromNow();

    var displayModeIcon = this.state.displayMode === 'list' ? 'rows' : 'thumbnails';

    var assets = this.props.assetGroup.assets.map(function(asset) {
      var style = {
        backgroundImage: 'url('+asset.images.thumbnail+')'
      }

      var selected = self.state.selectedAssets.indexOf(asset.id) !== -1;

      return (
        <li className="asset" key={asset.id} data-selected={selected}>
          <div className="image" style={style}>
            <input type="checkbox" className="selectImage" checked={selected} onChange={self.toggleAssetSelection.bind(self, asset.id)} />
          </div>
          <div className="filename">
            <span className="name">{asset.name}</span>
            <span className="size">{asset.size}</span>
          </div>
        </li>
      );
    });

    var deleteButtonStyle = {
      display: this.state.selectedAssets.length ? 'inline-block' : 'none'
    }

    return (
      <div
        className="AssetGroup"
        onDragStart={this.handleDragStart}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragLeave={this.handleDragLeave}
        data-drag-state={this.state.drag}>
        
        <div className="dropHint">
          <div>
            <Icon name="upload" />
            <span>Drop to upload files</span>
          </div>
        </div>
        
        <header>
          <div className="symbol"></div>
          <div className="title">
            <input value={this.props.assetGroup.title} onKeyUp={this.handleInputKeyUp} onChange={this.changeTitle} />
          </div>
          <div className="buttons">
            <Button icon="delete" className="plain" onClick={this.handleDelete} />
          </div>
        </header>
        
        <div className="assetsListContainer">
          <div className="meta">
            <div className="left">
              <h2>{assets.length} Files</h2>
              <span className="size">{this.props.assetGroup.size}</span>
              <Button onClick={this.deleteSelectedAssets} style={deleteButtonStyle} className="plain delete" text={this.state.selectedAssets.length} icon="trash" />
            </div>
            <Button className="displayMode plain" icon={displayModeIcon} onClick={this.toggleDisplayMode} />
          </div>
          <ul className="assetsList" data-display-mode={this.state.displayMode}>{assets}</ul>
        </div>
        
        <footer>
          <div className="text">
            <span className="mtime"><Icon name="clock" /> Updated {mtime}</span>
          </div>
        </footer>
      </div>
    );
  }
});

var AssetGroupsList = React.createClass({
  render: function() {
    var self = this;

    var assetGroups = (this.props.section.asset_groups || []).map(function(group) {
      return (
        <AssetGroup
          key={group.id}
          assetGroup={group}
          section={self.props.section}
          guide={self.props.guide} />
      );
    });

    var assetGroupsContainer;

    if(assetGroups.length) {
      assetGroupsContainer = (
        <div className="container">
          {assetGroups}
        </div>
      );
    }

    return (
      <div className="AssetGroupsList">
        {assetGroupsContainer}
      </div>
    );
  }
});

var SectionEditor = React.createClass({
  componentDidMount: function() {
    var self = this;

    this.mtimeTicker = setInterval(function() {
      self.forceUpdate();
    }, 10000);
  },
  componentWillUnmount: function() {
    clearInterval(this.mtimeTicker);
  },
  deleteSection: function() {
    var self = this;
    var guide = GuideStore.find(this.props.guide.slug);

    guide.deleteSection(this.props.section.slug, function() {
      Dispatcher.trigger('navigate', '/'+self.props.guide.slug);
    });
  },
  changeTitle: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.updateSection(this.props.section.slug, { title: event.target.value });
  },
  changeContent: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.updateSection(this.props.section.slug, { content: event.target.value });
  },
  saveChanges: function(event) {
    event.preventDefault();
    var guide = GuideStore.find(this.props.guide.slug);

    guide.sync();
  },
  addAssetGroup: function() {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.addAssetGroupToSection(this.props.section.slug);
  },
  render: function() {
    var self = this;
    
    if(this.props.section) {
      var mtime = moment.unix(this.props.section.mtime).fromNow();

      var viewComponent = (
        <div>
          <form onSubmit={this.saveChanges}>
            <span className="mtime"><Icon name="clock" /> Updated {mtime}</span>
            <input className="input titleInput" value={this.props.section.title} type="text" onChange={this.changeTitle} placeholder="Title" />
            
            <MarkdownContentInput onChange={this.changeContent} value={this.props.section.content || ''} placeholder="Content" />
            
            <AssetGroupsList
              onAssetGroupDeleted={this.props.onAssetGroupDeleted}
              onAssetUploaded={this.props.onAssetUploaded}
              section={this.props.section}
              guide={this.props.guide} />
            
            <ButtonGroup>
              <Button onClick={this.addAssetGroup} text="Add Asset Group" icon="attachment" />
              <Button onClick={this.addAssetGroup} text="Add Colour" icon="eyedropper" />
              <span className="spacer" />
              <Button onClick={this.deleteSection} text="Delete Page" icon="trash" />
              <Button onClick={this.saveChanges} className="green" text="Save Changes" icon="check" />
            </ButtonGroup>
          </form>
        </div>
      );
    } else {
      var message = {}
      
      if(this.props.guide.sections && this.props.guide.sections.length) {
        message.icon = 'list';
        message.text = (<p>Select a page<br />to edit</p>);
      } else {
        message.icon = 'openbook';
        message.text = (<p>Add a page<br />to get started</p>);
      }

      var viewComponent = (
        <div className="noSectionsMessage">
          <div>
            <div className="book"><Icon name={message.icon} /></div>
            {message.text}
          </div>
        </div>
      );
    }

    return (
      <div className="SectionEditor">
        <div className="content">
          {viewComponent}
        </div>
      </div>
    );
  }
});

var GuidesListItem = React.createClass({
  handleClick: function() {
    Dispatcher.trigger('navigate', '/'+this.props.guide.slug);
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className="GuidesListItem">
        <header>
          <h2>{this.props.guide.title}</h2>
        </header>
        <div className="thumbnail" />
      </div>
    );
  }
});

var GuidesList = React.createClass({
  createGuide: function() {
    var self = this;

    if(title = prompt('Enter title')) {
      var attributes = {
        title: title
      }

      var guide = new GuideModel({ title: title });
      guide.sync();
    }
  },
  render: function() {
    var self = this;

    var guidesListItems = this.props.guides.map(function(guide) {
      return (
        <GuidesListItem key={guide.id} onClickGuide={self.props.onClickGuide} guide={guide} />
      );
    });

    return (
      <div className="GuidesList">
        <div className="grid">
          {guidesListItems}
        </div>
        <footer>
          <Button onClick={this.createGuide} className="green" text="Create New Guide" icon="compose" />
        </footer>
      </div>
    );
  }
});

var GuidesListPage = React.createClass({
  getInitialState: function() {
    return {
      guides: GuideStore.attributes()
    }
  },
  componentDidMount: function() {
    GuideStore.on('change', this.guideStoreChanged);
  },
  componentWillUnmount: function() {
    GuideStore.off('change', this.guideStoreChanged);
  },
  guideStoreChanged: function() {
    this.setState({ guides: GuideStore.attributes() });
  },
  render: function() {
    return (
      <div className="GuidesListPage">
        <GuidesList onClickGuide={this.props.onClickGuide} onCreateGuide={this.props.onCreateGuide} guides={this.state.guides} />
      </div>
    );
  }
});

var GuideEditPage = React.createClass({
  getInitialState: function() {
    return {
      section: null,
      drawerOpen: true,
      guide: GuideStore.find(this.props.guideId).attributes
    }
  },
  componentWillMount: function() {
    GuideStore.on('change', this.guideStoreChanged);
  },
  componentWillUnmount: function() {
    GuideStore.off('change', this.guideStoreChanged);
  },
  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.sectionId !== this.props.sectionId) {
      this.selectSection();
    }
  },
  guideStoreChanged: function() {
    this.setState({ guide: GuideStore.find(this.props.guideId).attributes });
    this.selectSection();
  },
  selectSection: function() {
    var guide = GuideStore.find(this.props.guideId);

    var section = this.props.sectionId ? guide.findSection(this.props.sectionId) : null;
    this.setState({ section: section });
  },
  toggleDrawer: function() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  },
  render: function() {
    var guide = this.state.guide || {};

    return (
      <div className="GuideEditPage">
        <Drawer guide={guide} section={this.state.section} open={this.state.drawerOpen} onToggle={this.toggleDrawer} />
        <SectionEditor guide={guide} section={this.state.section} />
      </div>
    );
  }
});

var AdminPage = React.createClass({
  componentDidMount: function() {
    var self = this;

    Dispatcher.on('navigate', function(path, options) {
      self.refs.router.navigate(path, options);
    });

    GuideStore.fetch();
  },
  componentWillUnmount: function() {
    Dispatcher.off('navigate');
  },
  render: function() {
    return (
      <div className="AdminPage">
        <Header user={this.props.user} onLogout={this.props.onLogout} />
        <Locations ref="router" className="Location">
          <Location path="/" handler={GuidesListPage} />
          <Location path="/:guideId" handler={GuideEditPage} />
          <Location path="/:guideId/:sectionId" handler={GuideEditPage} />
        </Locations>
      </div>
    );
  }
});

var LoginPage = React.createClass({
  submitLogin: function(event) {
    if(event) event.preventDefault();

    var attributes = {
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    }

    $.post('/login.json', { user: attributes })
      .done(this.loginSucceeded);
  },
  loginSucceeded: function(response) {
    if(response.status === 'success') {
      var data = response.data;
      localStorage.setItem(LOCALSTORAGE_AUTH_KEY, JSON.stringify(data));
      this.props.onLogin();
    } else {
      alert(response.status + ': ' + response.message);
    }
  },
  onKeyUp: function(event) {
    if(event.keyCode === 13) this.submitLogin();
  },
  render: function() {
    return (
      <div className="LoginPage" onKeyUp={this.onKeyUp}>
        <h1>Please sign in</h1>
        <input className="input email" ref="email" required type="email" placeholder="Email" />
        <input className="input password" ref="password" required type="password" placeholder="Password" />
        <ButtonGroup>
          <Button icon="user" text="Submit" onClick={this.submitLogin} />
        </ButtonGroup>
      </div>
    );
  }
});

var Application = React.createClass({
  getInitialState: function() {
    var state = {
      user: {},
      ajax: null
    }

    if(savedState = localStorage.getItem(LOCALSTORAGE_AUTH_KEY)) {
      state.user = JSON.parse(savedState).user;
    }

    return state;
  },
  setXhrHeaders: function() {
    var xhrHeaders = {};

    if(this.state.user.token && this.state.user.email) {
      var userToken = [this.state.user.email, this.state.user.token].join(':');
      xhrHeaders['X-User-Token'] = userToken;
    }

    $.ajaxSetup({
      headers: xhrHeaders
    });
  },
  logout: function() {
    localStorage.removeItem(LOCALSTORAGE_AUTH_KEY);
    this.setState(this.getInitialState());
    window.location.href = '/';
  },
  login: function() {
    this.setState(this.getInitialState());
    this.setXhrHeaders();
    window.location.href = '/';
  },
  handleDragOver: function(event) {
    event.preventDefault();
  },
  handleDrop: function(event) {
    event.preventDefault();
  },
  componentWillMount: function() {
    this.setXhrHeaders();
  },
  componentDidMount: function() {
    var self = this;
  
    $(document).ajaxStart(function() {
      self.setState({ ajax: 'start' });
    });

    $(document).ajaxComplete(function() {
      self.setState({ ajax: 'complete' });
    });
  },
  componentDidUpdate: function() {
    this.setXhrHeaders();
  },
  render: function() {
    var viewComponent = this.state.user.token ?
      (<AdminPage onLogout={this.logout} user={this.state.user} />) :
      (<LoginPage onLogin={this.login} />);

    return (
      <div className="Application" data-ajax-state={this.state.ajax} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
        <Spinner show={this.state.ajax === 'start'} />
        {viewComponent}
      </div>
    );
  }
});