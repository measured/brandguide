/** @jsx React.DOM */

var LOCALSTORAGE_AUTH_KEY = 'brandguideAuth';

var Location = ReactRouter.Location;
var Locations = ReactRouter.Locations;

var Dispatcher = _.clone(Backbone.Events);

var GuideStore = _.extend(_.clone(Backbone.Events), {
  collection: [],
  selected: {},
  parse: function(response) {
    this.collection = _.map(response.data.guides, function(attributes) {
      return new GuideModel(attributes);
    });
    this.trigger('change');
  },
  fetch: function() {
    $.get('/guides.json', this.parse.bind(this))
  },
  toJSON: function() {
    return this.collection.map(function(guide) {
      return guide.attributes;
    });
  },
  find: function(id) {
    var selections = _.select(this.collection, function(guide) {
      return guide.toJSON().slug === id;
    });

    return selections.length ? selections[0] : new GuideModel({});
  }
});

var GuideModel = function(attributes) {
  _.extend(this, Backbone.Events);

  if(typeof attributes === 'number') this.attributes = { id: attributes }
  if(typeof attributes === 'string') this.attributes = { slug: attributes }
  if(typeof attributes === 'object') this.attributes = attributes;
  
  this.fetch = function() {
    var slug = this.toJSON().slug;
    $.get('/guides/'+slug+'.json').done(this.parse.bind(this));
  }

  this.parse = function(response) {
    this.attributes = response.data.guide;
    GuideStore.trigger('change');
  }

  this.sync = function(callback) {
    var self = this;

    var attributes = this.toJSON();

    attributes.sections_attributes = _.clone(attributes.sections);
    // delete attributes.sections;

    _.each(attributes.sections_attributes, function(section) {
      section.asset_groups_attributes = _.clone(section.asset_groups);
      // delete section.asset_groups;
    });

    $.post('/guides/'+this.toJSON().slug+'.json', {
      guide: attributes
    }).done(function(response) {
      self.parse(response);
      if(typeof callback === 'function') callback();
    });
  }

  this.findSection = function(id) {
    var selections = _.select(this.toJSON().sections, function(section) {
      return section.slug === id;
    });

    return selections.length ? selections[0] : {};
  }

  this.addSection = function(title, callback) {
    this.attributes.sections.push({
      title: title
    });

    this.sync(callback);
  }

  this.deleteSection = function(id, callback) {
    var section = this.findSection(id);
    section._destroy = true;

    this.sync(callback);
  }

  this.updateSection = function(id, attributes) {
    var section = this.findSection(id);

    section = _.extend(section, attributes);

    GuideStore.trigger('change');
  }

  this.addAssetGroupToSection = function(id) {
    var section = this.findSection(id);
    section.asset_groups.push({
      title: null,
      assets: []
    });

    GuideStore.trigger('change');
  }

  this.findAssetGroup = function(sectionId, assetGroupId) {
    var section = this.findSection(sectionId);

    var selected = _.select(section.asset_groups, function(assetGroup) {
      return assetGroup.id === assetGroupId;
    });

    return selected.length ? selected[0] : {};
  }

  this.deleteAssetGroupFromSection = function(sectionId, assetGroupId) {
    var assetGroup = this.findAssetGroup(sectionId, assetGroupId);
    assetGroup._destroy = true;

    this.sync();
  }

  this.uploadAssets = function(sectionId, assetGroupId, files) {
    var formData = new FormData();

    _.each(event.dataTransfer.files, function(file) {
      formData.append('assets[][file]', file);
    });

    assetGroupId = assetGroupId ? assetGroupId : '';

    $.ajax({
      url: '/guides/'+this.toJSON().slug+'/upload.json?section_id='+sectionId+'&asset_group_id='+assetGroupId,
      data: formData,
      processData: false,
      contentType: false,
      type: 'post'
    }).done(this.parse.bind(this));
  }

  this.updateSectionAssetGroup = function(sectionId, assetGroupId, attributes) {
    var assetGroup = this.findAssetGroup(sectionId, assetGroupId);

    assetGroup = _.extend(assetGroup, attributes);

    GuideStore.trigger('change');
  }

  this.toJSON = function() {
    return this.attributes;
  }
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
  handleClick: function(event) {
    event.preventDefault();
    Dispatcher.trigger('navigate', '/'+this.props.guide.slug+'/'+this.props.section.slug);
  },
  render: function() {
    return (
      <li className="DrawerSectionsListItem" data-selected={this.props.selected}>
        <a onClick={this.handleClick} href={'/'+this.props.guide.slug+'/'+this.props.section.slug}>
          <span>{this.props.section.title || 'Untitled'}</span><Icon className="plain" name="navigateright" />
        </a>
        <ul>
          <li><a href="#">Section</a></li>
          <li><a href="#">Section</a></li>
          <li><a href="#">Section</a></li>
          <li><a href="#">Section</a></li>
        </ul>
      </li>
    );
  }
});

var DrawerSectionsList = React.createClass({
  render: function() {
    var self = this;

    var drawerSectionsListItems = (this.props.guide.sections || []).map(function(section) {
      var selected = self.props.section ? (self.props.section.slug === section.slug) : false;
      
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
  addSection: function() {
    if(title = prompt('Enter Title')) {
      GuideStore.find(this.props.guide.slug).addSection(title);
    }
  },
  render: function() {
    return (
      <div className="Drawer" data-open={this.props.open}>
        <div className="contents" onClick={this.props.onOpenDrawer}>
          <header>
            <Button onClick={this.handleBack} className="back plain" icon="back" />
            <h2>{this.props.guide.title || 'Untitled'}</h2>
            <Button className="settings plain" icon="gear" />
          </header>
          <div className="content">
            <h3>Pages</h3>

            <DrawerSectionsList guide={this.props.guide} section={this.props.section} />
            <Button onClick={this.addSection} text="Add Page" icon="openbook" />
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
  handleDelete: function(event) {
    var guide = GuideStore.find(this.props.guide.slug);
    guide.deleteAssetGroupFromSection(this.props.section.slug, this.props.assetGroup.id);
  },
  handleDragEnter: function(event) {
    event.preventDefault();
    if(this.state.drag !== 'enter') this.setState({ drag: 'enter' });
  },
  handleDragOver: function(event) {
    event.preventDefault();
    if(this.state.drag !== 'over') this.setState({ drag: 'over' });
  },
  handleDragLeave: function(event) {
    event.preventDefault();
    if(this.state.drag !== 'leave') this.setState({ drag: 'leave' });
  },
  handleDrop: function(event) {
    event.stopPropagation();
    event.preventDefault();

    if(this.state.drag !== 'drop') this.setState({ dragState: 'drop' });

    var guide = GuideStore.find(this.props.guide.slug);

    guide.uploadAssets(this.props.section.slug, this.props.assetGroup.id, event.dataTransfer.files);

    return false;
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
  render: function() {
    var self = this;

    console.log('called render');

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

    return (
      <div
        className="AssetGroup"
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
            <input value={this.props.assetGroup.title || 'Untitled'} onChange={this.changeTitle} />
          </div>
          <div className="buttons">
            <Button icon="delete" className="plain" onClick={this.handleDelete} />
          </div>
        </header>
        <div className="assetsListContainer">
          <div className="meta">
            <h2>{assets.length} Files</h2>
            <span className="size">{this.props.assetGroup.size}</span>
            <Button className="displayMode plain" icon={displayModeIcon} onClick={this.toggleDisplayMode} />
          </div>
          <ul className="assetsList" data-display-mode={this.state.displayMode}>{assets}</ul>
        </div>
        <footer>
          <div className="text"><Icon name="clock" /> Updated {mtime}</div>
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
              <Button onClick={this.addAssetGroup} text="Add Asset Group" icon="plus" />
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
        message.text = ['Select a page', <br />, 'to edit'];
      } else {
        message.icon = 'openbook';
        message.text = ['Add a page', <br />, 'to get started'];
      }

      var viewComponent = (
        <div className="noSectionsMessage">
          <div>
            <div className="book"><Icon name={message.icon} /></div>
            <p>{message.text}</p>
          </div>
        </div>
      )
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

      // console.log('GuidesList#createGuide');
      // $.post('/guides.json', { guide: attributes }, function(response) {
      //   self.props.onCreateGuide(response.guide);
      // });
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
      guides: GuideStore.toJSON()
    }
  },
  componentDidMount: function() {
    GuideStore.on('change', this.guideStoreChanged);
  },
  componentWillUnmount: function() {
    GuideStore.off('change', this.guideStoreChanged);
  },
  guideStoreChanged: function() {
    this.setState({ guides: GuideStore.toJSON() });
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
      guide: GuideStore.find(this.props.guideId).toJSON()
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
    console.log('guideStoreChanged');
    this.setState({ guide: GuideStore.find(this.props.guideId).toJSON() });
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

    // <Drawer
    //   guide={guide}
    //   onAddSection={this.addSection}
    //   open={this.state.drawerOpen}
    //   onToggle={this.toggleDrawer}
    //   onSelectSection={this.selectSection} />
    // <SectionEditor
    //   guide={this.state.guide}
    //   onTitleChange={this.changeSectionTitle}
    //   onContentChange={this.changeSectionContent}
    //   onSaveChanges={this.updateSection}
    //   section={this.state.editorSection}
    //   guideHasSections={guideHasSections}
    //   onDelete={this.deleteSection}
    //   onAddAssetGroup={this.addAssetGroup}
    //   onAssetUploaded={this.assetUploaded}
    //   onAssetGroupDeleted={this.assetGroupDeleted} />

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

    Dispatcher.on('navigate', function(path) {
      self.refs.router.navigate(path);
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
  },
  login: function() {
    this.setState(this.getInitialState());
    this.setXhrHeaders();
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
      <div className="Application" data-ajax-state={this.state.ajax}>
        <Spinner show={this.state.ajax === 'start'} />
        {viewComponent}
      </div>
    );
  }
});