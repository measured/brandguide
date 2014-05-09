/** @jsx React.DOM */

var ButtonGroup = React.createClass({
  render: function() {
    return (
      <div className="ButtonGroup">
        {this.props.children}
      </div>
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

    children.push(<span key="text" className="text">{this.props.text}</span>)

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
      backgroundImage: 'url('+this.props.user.gravatarUrl+')'
    }

    if(!this.props.user.gravatarUrl) avatarStyle = {}

    return (
      <div className="Header">
        <div className="content">
          <h1><a href="/">brandguide.io</a></h1>

          <div className="user">
            <Button icon="logout" className="plain" text="Sign out" />
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
    this.props.onSelectSection();
  },
  render: function() {
    return (
      <li className="DrawerSectionsListItem">
        <a onClick={this.handleClick} href="#">{this.props.section.title || 'Untitled'}</a>
      </li>
    );
  }
});

var DrawerSectionsList = React.createClass({
  render: function() {
    var self = this;

    var drawerSectionsListItems = this.props.sections.map(function(section) {
      var onSelectSection = function() {
        self.props.onSelectSection(section.id);
      }
      
      return (
        <DrawerSectionsListItem
          key={section.id}
          onSelectSection={onSelectSection}
          section={section} />
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
  handleAddSection: function(event) {
    var title = prompt('Enter title');
    this.props.onAddSection(title);
  },
  handleToggle: function(event) {
    event.preventDefault();
    this.props.onToggle();
  },
  render: function() {
    return (
      <div className="Drawer" data-open={this.props.open}>
        <div className="contents" onClick={this.props.onOpenDrawer}>
          <header>
            <Button className="back plain" icon="back" />
            <h2>{this.props.guide.title}</h2>
            <Button className="settings plain" icon="gear" />
          </header>
          <div className="content">
            <h3>Pages</h3>

            <DrawerSectionsList onSelectSection={this.props.onSelectSection} sections={this.props.guide.sections} />
            <Button onClick={this.handleAddSection} text="Add Page" icon="openbook" />
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

var AssetDropZone = React.createClass({
  getInitialState: function() {
    return {
      dragState: null
    }
  },
  handleDragEnter: function(event) {
    event.preventDefault();
    this.setState({ dragState: 'enter' });
  },
  handleDragOver: function(event) {
    event.preventDefault();
    this.setState({ dragState: 'over' });
  },
  handleDragLeave: function(event) {
    event.preventDefault();
    this.setState({ dragState: 'leave' });
  },
  handleDrop: function(event) {
    event.preventDefault();
    event.stopPropagation();

    var self = this;
    this.setState({ dragState: 'drop' });

    var formData = new FormData();

    formData.append('section[id]', this.props.sectionId);

    _.each(event.dataTransfer.files, function(file) {
      formData.append('section[files][]', file);
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function(event) {
      self.props.onUpload();
    });

    xhr.open('POST', '/guides/mt-gox/upload.json');
    xhr.send(formData);
  },
  render: function() {
    var hasAssets = !!this.props.section.asset_groups;

    return (
      <div className="AssetDropZone" onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop} data-drag-state={this.state.dragState} data-has-assets={hasAssets}>
        <div className="message"><span>Drop Files Here</span></div>
        <AssetGroupsList assetGroups={this.props.section.asset_groups} />
      </div>
    );
  }
});

var AssetGroup = React.createClass({
  render: function() {
    return (
      <div className="AssetGroup">
        <header>
          {this.props.assetGroup.title || 'Untitled'}
        </header>
        <div className="stack">
          {this.props.assetGroup.assets.map(function(asset) {
            return (<div>{asset}</div>)
          })}
        </div>
        <footer>footer</footer>
      </div>
    );
  }
});

var AssetGroupsList = React.createClass({
  render: function() {
    var assetGroups = this.props.assetGroups.map(function(assetGroup) {
      return (
        <AssetGroup key={assetGroup.id} assetGroup={assetGroup} />
      );
    });

    return (
      <div className="AssetGroupsList">
        {assetGroups}
      </div>
    );
  }
});

var Editor = React.createClass({
  getInitialState: function() {
    return {
      section: {
        asset_groups: []
      }
    }
  },
  handleSave: function(event) {
    event.preventDefault();
    this.props.onUpdateSection(this.state.section);
  },
  componentDidUpdate: function(prevProps, prevState) {
    if((prevProps.sectionId !== this.props.sectionId) || (prevProps.guide !== this.props.guide)) {
      this.selectSection(this.props.sectionId);
    }
  },
  selectSection: function(sectionId) {
    var sections = _.select(this.props.guide.sections, function(section) {
      return section.id === sectionId;
    });

    if(sections.length) {
      this.setState({ section: sections[0] });
    }
  },
  handleTitleChange: function(event) {
    var section = this.state.section;
    section.title = event.target.value;
    this.setState({ section: section });
  },
  handleContentChange: function(event) {
    var section = this.state.section;
    section.content = event.target.value;
    this.setState({ section: section });
  },
  handleUpload: function() {
    this.props.onUpdateSection();
  },
  render: function() {
    var self = this;

    if(this.state.section) {
      sectionEditor = (
        <div>
          <form onSubmit={this.handleSave}>
            <input className="input titleInput" value={this.state.section.title} type="text" onChange={this.handleTitleChange} placeholder="Title" />
            <MarkdownContentInput onChange={this.handleContentChange} value={this.state.section.content} placeholder="Content" />
            <AssetDropZone section={this.state.section} sectionId={this.props.sectionId} onUpload={this.handleUpload} />
            <ButtonGroup>
              <Button onClick={this.handleSave} className="green" text="Save Changes" icon="check" />
            </ButtonGroup>
          </form>
        </div>
      );
    }

    return (
      <div className="Editor">
        <div className="content">
          {sectionEditor}
        </div>
      </div>
    );
  }
});

var Application = React.createClass({
  getInitialState: function() {
    return {
      drawerOpen: true,
      currentUser: {},
      guide: {
        title: 'Untitled',
        sections: []
      },
      sectionId: 24
    }
  },
  componentWillMount: function() {
    this.fetchUser();
    this.fetchGuide();
  },
  fetchGuide: function() {
    var self = this;
    $.get('/guides/mt-gox.json', function(response) {
      self.setState({ guide: response.guide });
    });
  },
  fetchUser: function() {
    var self = this;
    $.get('/current_user.json', function(response) {
      self.setState({ currentUser: response.user });
    });
  },
  toggleDrawer: function() {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  },
  openDrawer: function() {
    this.setState({ drawerOpen: true });
  },
  handleAddSection: function(title) {
    var self = this;
    $.post('/guides/mt-gox/add_section.json', { section: { title: title } }, function() {
      self.fetchGuide();
    });
  },
  handleSelectSection: function(sectionId) {
    this.setState({ sectionId: sectionId });
  },
  handleUpdateSection: function(section) {
    var self = this;
    
    if(section) {
      $.post('/guides/mt-gox/update_section.json', { section: section }, function(response) {
        self.fetchGuide();
      });
    } else {
      self.fetchGuide();
    }
  },
  render: function() {
    return (
      <div className="Application">
        <Header user={this.state.currentUser} />
        <div className="container">
          <Drawer
            guide={this.state.guide}
            onToggle={this.toggleDrawer}
            onOpenDrawer={this.openDrawer}
            open={this.state.drawerOpen}
            onAddSection={this.handleAddSection}
            onSelectSection={this.handleSelectSection} />
          <Editor
            guide={this.state.guide}
            sectionId={this.state.sectionId}
            onUpdateSection={this.handleUpdateSection} />
        </div>
      </div>
    );
  }
});