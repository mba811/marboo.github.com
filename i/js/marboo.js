// Generated by CoffeeScript 1.5.0
var Marboo, addEvent, basename, core, current_url, dirname, marboo, myLayout, pluginValid;

myLayout = "";

current_url = "";

$(document).ready(function() {
  return myLayout = $('body').layout({
    west__size: 150,
    west__spacing_closed: 20,
    west__togglerLength_closed: 100,
    west__togglerAlign_closed: "top",
    west__togglerContent_closed: "M<BR>E<BR>N<BR>U",
    west__togglerTip_closed: "Open & Pin Menu",
    west__sliderTip: "Slide Open Menu",
    west__slideTrigger_open: "mouseover",
    center__maskContents: true
  });
});

core = function() {
  return document.getElementById('marboo-core');
};

pluginValid = function() {
  return alert(core().valid);
};

addEvent = function(obj, name, func) {
  if (obj.attachEvent) {
    return obj.attachEvent("on" + name, func);
  } else {
    return obj.addEventListener(name, func, false);
  }
};

basename = function(path) {
  return path.replace(/\\/g, '/').replace(/.*\//, '');
};

dirname = function(path) {
  return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
};

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

Marboo = function() {
  this.current_url = "";
  if (core().valid) {
    this.root = sprintf("file://%s", core().root);
    this.initEvent();
    this.buildTree();
  } else {
    this.root = "http://marboo.biz/i/build";
    this.buildDemo();
  }
  return this;
};

Marboo.prototype.buildDemo = function() {
  var files;
  files = [];
  files.push({
    "name": "Markdown语法说明.md",
    "isDir": "0"
  });
  files.push({
    "name": "Markdown-Syntax.md",
    "isDir": "0"
  });
  files.push({
    "name": "样例笔记.md",
    "isDir": "0"
  });
  files.push({
    "name": "一颗开花的树.md",
    "isDir": "0"
  });
  files.push({
    "name": "2011-12-29-jekyll-introduction.md",
    "isDir": "0"
  });
  return this.generateUl($("#treeView"), "", files);
};

Marboo.prototype.initEvent = function() {
  addEvent(core(), 'addItem', this.addItemAction);
  addEvent(core(), 'removeItem', this.removeItemAction);
  return addEvent(core(), 'refresh', this.onRefresh);
};

Marboo.prototype.addItemAction = function(path, isDir) {
  var li, _i, _len, _ref;
  _ref = $("li");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    li = _ref[_i];
    if (li.title === path) {
      return;
    }
  }
  if (dirname(path) === "") {
    $("#treeView ul").append(marboo.generateli(path, isDir));
  }
  return {
    "else": (function() {
      var _j, _len1, _ref1, _results;
      _ref1 = $("li");
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        li = _ref1[_j];
        if (li.title === dirname(path)) {
          _results.push(li.parent().append(marboo.generateli(path, isDir)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    })()
  };
};

Marboo.prototype.removeItemAction = function(path, isDir) {
  var li, _i, _len, _ref, _results;
  _ref = $("li");
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    li = _ref[_i];
    if (li.title === path) {
      _results.push(li.remove());
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

Marboo.prototype.onRefresh = function() {
  return document.getElementById('webView').src = current_url;
};

Marboo.prototype.editFile = function(obj) {
  return core().editFile($(obj).attr("title"));
};

Marboo.prototype.buildTree = function() {
  var files;
  files = core().listDir("");
  return this.generateUl($("#treeView"), "", files);
};

Marboo.prototype.toggleList = function(node) {
  var files;
  if (node.hasClass('collapsed')) {
    files = core().listDir(node.attr("title"));
    this.generateUl(node, node.attr("title"), files);
    return node.removeClass('collapsed').addClass('expanded');
  } else {
    node.removeClass('expanded').addClass('collapsed');
    return node.children("ul").remove();
  }
};

Marboo.prototype.onChangeTreeViewItem = function(path) {
  current_url = sprintf("%s%s.html", this.root, path);
  return core().checkHTML(path);
};

Marboo.prototype.generateUl = function(node, path, files) {
  var file, file_path, ul, _i, _len, _results;
  ul = $('<ul class="jqueryFileTree"></ul>');
  _results = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    if (file.name.indexOf(".") === 0 || file.name.endsWith("~")) {
      continue;
    }
    file_path = [path, file.name].join("/");
    ul.append(this.generateli(file_path, parseInt(file.isDir)));
    _results.push(node.append(ul));
  }
  return _results;
};

Marboo.prototype.generateli = function(path, isDir) {
  var a, file_components, file_extension, li, url;
  li = "";
  if (isDir) {
    li = $(sprintf('<li class="directory collapsed" title="%s"></li>', path));
    a = $(sprintf('<a href="#">%s</a>', basename(path)));
    a.click(function() {
      return marboo.toggleList($(this).parent());
    });
    li.append(a);
  } else {
    url = sprintf("%s%s.html", this.root, path);
    file_components = basename(path).split('.');
    file_extension = file_components[file_components.length - 1];
    li = $(sprintf('<li class="file ext_%s" title="%s"></li>', file_extension, path));
    a = $(sprintf('<a target="webView" href="%s">%s</a>', url, basename(path)));
    li.click(function() {
      return marboo.onChangeTreeViewItem($(this).attr("title"));
    });
    li.dblclick(function() {
      return core().editFile($(this).attr("title"));
    });
    li.append(a);
  }
  return li;
};

Marboo.prototype.test = function() {};

marboo = new Marboo();
