/* ===================================================
 *  jquery-sortable.js v0.9.13
 *  http://johnny.github.com/jquery-sortable/
 * ===================================================
 *  Copyright (c) 2012 Jonas von Andrian
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ========================================================== */

!(function ($, window, pluginName, undefined) {
  var containerDefaults = {
      // If true, items can be dragged from this container
      drag: true,
      // If true, items can be droped onto this container
      drop: true,
      // Exclude items from being draggable, if the
      // selector matches the item
      exclude: '',
      // If true, search for nested containers within an item.If you nest containers,
      // either the original selector with which you call the plugin must only match the top containers,
      // or you need to specify a group (see the bootstrap nav example)
      nested: true,
      // If true, the items are assumed to be arranged vertically
      vertical: true,
    }, // end container defaults
    groupDefaults = {
      // This is executed after the placeholder has been moved.
      // $closestItemOrContainer contains the closest item, the placeholder
      // has been put at or the closest empty Container, the placeholder has
      // been appended to.
      afterMove: function ($placeholder, container, $closestItemOrContainer) {},
      // The exact css path between the container and its items, e.g. "> tbody"
      containerPath: '',
      // The css selector of the containers
      containerSelector: 'ol, ul',
      // Distance the mouse has to travel to start dragging
      distance: 0,
      // Time in milliseconds after mousedown until dragging should start.
      // This option can be used to prevent unwanted drags when clicking on an element.
      delay: 0,
      // The css selector of the drag handle
      handle: '',
      // The exact css path between the item and its subcontainers.
      // It should only match the immediate items of a container.
      // No item of a subcontainer should be matched. E.g. for ol>div>li the itemPath is "> div"
      itemPath: '',
      // The css selector of the items
      itemSelector: 'li',
      // The class given to "body" while an item is being dragged
      bodyClass: 'dragging',
      // The class giving to an item while being dragged
      draggedClass: 'dragged',
      // Check if the dragged item may be inside the container.
      // Use with care, since the search for a valid container entails a depth first search
      // and may be quite expensive.
      isValidTarget: function ($item, container) {
        return true;
      },
      // Executed before onDrop if placeholder is detached.
      // This happens if pullPlaceholder is set to false and the drop occurs outside a container.
      onCancel: function ($item, container, _super, event) {},
      // Executed at the beginning of a mouse move event.
      // The Placeholder has not been moved yet.
      onDrag: function ($item, position, _super, event) {
        $item.css(position);
      },
      // Called after the drag has been started,
      // that is the mouse button is being held down and
      // the mouse is moving.
      // The container is the closest initialized container.
      // Therefore it might not be the container, that actually contains the item.
      onDragStart: function ($item, container, _super, event) {
        $item.css({
          height: $item.outerHeight(),
          width: $item.outerWidth(),
        });
        $item.addClass(container.group.options.draggedClass);
        $('body').addClass(container.group.options.bodyClass);
      },
      // Called when the mouse button is being released
      onDrop: function ($item, container, _super, event) {
        $item
          .removeClass(container.group.options.draggedClass)
          .removeAttr('style');
        $('body').removeClass(container.group.options.bodyClass);
      },
      // Called on mousedown. If falsy value is returned, the dragging will not start.
      // Ignore if element clicked is input, select or textarea
      onMousedown: function ($item, _super, event) {
        if (!event.target.nodeName.match(/^(input|select|textarea)$/i)) {
          event.preventDefault();
          return true;
        }
      },
      // The class of the placeholder (must match placeholder option markup)
      placeholderClass: 'placeholder',
      // Template for the placeholder. Can be any valid jQuery input
      // e.g. a string, a DOM element.
      // The placeholder must have the class "placeholder"
      placeholder: '<li class="placeholder"></li>',
      // If true, the position of the placeholder is calculated on every mousemove.
      // If false, it is only calculated when the mouse is above a container.
      pullPlaceholder: true,
      // Specifies serialization of the container group.
      // The pair $parent/$children is either container/items or item/subcontainers.
      serialize: function ($parent, $children, parentIsContainer) {
        var result = $.extend({}, $parent.data());

        if (parentIsContainer) return [$children];
        else if ($children[0]) {
          result.children = $children;
        }

        delete result.subContainers;
        delete result.sortable;

        return result;
      },
      // Set tolerance while dragging. Positive values decrease sensitivity,
      // negative values increase it.
      tolerance: 0,
    }, // end group defaults
    containerGroups = {},
    groupCounter = 0,
    emptyBox = {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },
    eventNames = {
      start: 'touchstart.sortable mousedown.sortable',
      drop: 'touchend.sortable touchcancel.sortable mouseup.sortable',
      drag: 'touchmove.sortable mousemove.sortable',
      scroll: 'scroll.sortable',
    },
    subContainerKey = 'subContainers';

  /*
   * a is Array [left, right, top, bottom]
   * b is array [left, top]
   */
  function d(a, b) {
    var x = Math.max(0, a[0] - b[0], b[0] - a[1]),
      y = Math.max(0, a[2] - b[1], b[1] - a[3]);
    return x + y;
  }

  function setDimensions(array, dimensions, tolerance, useOffset) {
    var i = array.length,
      offsetMethod = useOffset ? 'offset' : 'position';
    tolerance = tolerance || 0;

    while (i--) {
      var el = array[i].el ? array[i].el : $(array[i]),
        // use fitting method
        pos = el[offsetMethod]();
      pos.left += parseInt(el.css('margin-left'), 10);
      pos.top += parseInt(el.css('margin-top'), 10);
      dimensions[i] = [
        pos.left - tolerance,
        pos.left + el.outerWidth() + tolerance,
        pos.top - tolerance,
        pos.top + el.outerHeight() + tolerance,
      ];
    }
  }

  function getRelativePosition(pointer, element) {
    var offset = element.offset();
    return {
      left: pointer.left - offset.left,
      top: pointer.top - offset.top,
    };
  }

  function sortByDistanceDesc(dimensions, pointer, lastPointer) {
    pointer = [pointer.left, pointer.top];
    lastPointer = lastPointer && [lastPointer.left, lastPointer.top];

    var dim,
      i = dimensions.length,
      distances = [];

    while (i--) {
      dim = dimensions[i];
      distances[i] = [i, d(dim, pointer), lastPointer && d(dim, lastPointer)];
    }
    distances = distances.sort(function (a, b) {
      return b[1] - a[1] || b[2] - a[2] || b[0] - a[0];
    });

    // last entry is the closest
    return distances;
  }

  function ContainerGroup(options) {
    this.options = $.extend({}, groupDefaults, options);
    this.containers = [];

    if (!this.options.rootGroup) {
      this.scrollProxy = $.proxy(this.scroll, this);
      this.dragProxy = $.proxy(this.drag, this);
      this.dropProxy = $.proxy(this.drop, this);
      this.placeholder = $(this.options.placeholder);

      if (!options.isValidTarget) this.options.isValidTarget = undefined;
    }
  }

  ContainerGroup.get = function (options) {
    if (!containerGroups[options.group]) {
      if (options.group === undefined) options.group = groupCounter++;

      containerGroups[options.group] = new ContainerGroup(options);
    }

    return containerGroups[options.group];
  };

  ContainerGroup.prototype = {
    dragInit: function (e, itemContainer) {
      this.$document = $(itemContainer.el[0].ownerDocument);

      // get item to drag
      var closestItem = $(e.target).closest(this.options.itemSelector);
      // using the length of this item, prevents the plugin from being started if there is no handle being clicked on.
      // this may also be helpful in instantiating multidrag.
      if (closestItem.length) {
        this.item = closestItem;
        this.itemContainer = itemContainer;
        if (
          this.item.is(this.options.exclude) ||
          !this.options.onMousedown(this.item, groupDefaults.onMousedown, e)
        ) {
          return;
        }
        this.setPointer(e);
        this.toggleListeners('on');
        this.setupDelayTimer();
        this.dragInitDone = true;
      }
    },
    drag: function (e) {
      if (!this.dragging) {
        if (!this.distanceMet(e) || !this.delayMet) return;

        this.options.onDragStart(
          this.item,
          this.itemContainer,
          groupDefaults.onDragStart,
          e
        );
        this.item.before(this.placeholder);
        this.dragging = true;
      }

      this.setPointer(e);
      // place item under the cursor
      this.options.onDrag(
        this.item,
        getRelativePosition(this.pointer, this.item.offsetParent()),
        groupDefaults.onDrag,
        e
      );

      var p = this.getPointer(e),
        box = this.sameResultBox,
        t = this.options.tolerance;

      if (
        !box ||
        box.top - t > p.top ||
        box.bottom + t < p.top ||
        box.left - t > p.left ||
        box.right + t < p.left
      )
        if (!this.searchValidTarget()) {
          this.placeholder.detach();
          this.lastAppendedItem = undefined;
        }
    },
    drop: function (e) {
      this.toggleListeners('off');

      this.dragInitDone = false;

      if (this.dragging) {
        // processing Drop, check if placeholder is detached
        if (this.placeholder.closest('html')[0]) {
          this.placeholder.before(this.item).detach();
        } else {
          this.options.onCancel(
            this.item,
            this.itemContainer,
            groupDefaults.onCancel,
            e
          );
        }
        this.options.onDrop(
          this.item,
          this.getContainer(this.item),
          groupDefaults.onDrop,
          e
        );

        // cleanup
        this.clearDimensions();
        this.clearOffsetParent();
        this.lastAppendedItem = this.sameResultBox = undefined;
        this.dragging = false;
      }
    },
    searchValidTarget: function (pointer, lastPointer) {
      if (!pointer) {
        pointer = this.relativePointer || this.pointer;
        lastPointer = this.lastRelativePointer || this.lastPointer;
      }

      var distances = sortByDistanceDesc(
          this.getContainerDimensions(),
          pointer,
          lastPointer
        ),
        i = distances.length;

      while (i--) {
        var index = distances[i][0],
          distance = distances[i][1];

        if (!distance || this.options.pullPlaceholder) {
          var container = this.containers[index];
          if (!container.disabled) {
            if (!this.$getOffsetParent()) {
              var offsetParent = container.getItemOffsetParent();
              pointer = getRelativePosition(pointer, offsetParent);
              lastPointer = getRelativePosition(lastPointer, offsetParent);
            }
            if (container.searchValidTarget(pointer, lastPointer)) return true;
          }
        }
      }
      if (this.sameResultBox) this.sameResultBox = undefined;
    },
    movePlaceholder: function (container, item, method, sameResultBox) {
      var lastAppendedItem = this.lastAppendedItem;
      if (!sameResultBox && lastAppendedItem && lastAppendedItem[0] === item[0])
        return;

      item[method](this.placeholder);
      this.lastAppendedItem = item;
      this.sameResultBox = sameResultBox;
      this.options.afterMove(this.placeholder, container, item);
    },
    getContainerDimensions: function () {
      if (!this.containerDimensions)
        setDimensions(
          this.containers,
          (this.containerDimensions = []),
          this.options.tolerance,
          !this.$getOffsetParent()
        );
      return this.containerDimensions;
    },
    getContainer: function (element) {
      return element.closest(this.options.containerSelector).data(pluginName);
    },
    $getOffsetParent: function () {
      if (this.offsetParent === undefined) {
        var i = this.containers.length - 1,
          offsetParent = this.containers[i].getItemOffsetParent();

        if (!this.options.rootGroup) {
          while (i--) {
            if (
              offsetParent[0] != this.containers[i].getItemOffsetParent()[0]
            ) {
              // If every container has the same offset parent,
              // use position() which is relative to this parent,
              // otherwise use offset()
              // compare #setDimensions
              offsetParent = false;
              break;
            }
          }
        }

        this.offsetParent = offsetParent;
      }
      return this.offsetParent;
    },
    setPointer: function (e) {
      var pointer = this.getPointer(e);

      if (this.$getOffsetParent()) {
        var relativePointer = getRelativePosition(
          pointer,
          this.$getOffsetParent()
        );
        this.lastRelativePointer = this.relativePointer;
        this.relativePointer = relativePointer;
      }

      this.lastPointer = this.pointer;
      this.pointer = pointer;
    },
    distanceMet: function (e) {
      var currentPointer = this.getPointer(e);
      return (
        Math.max(
          Math.abs(this.pointer.left - currentPointer.left),
          Math.abs(this.pointer.top - currentPointer.top)
        ) >= this.options.distance
      );
    },
    getPointer: function (e) {
      var o =
        e.originalEvent ||
        (e.originalEvent.touches && e.originalEvent.touches[0]);
      return {
        left: e.pageX || o.pageX,
        top: e.pageY || o.pageY,
      };
    },
    setupDelayTimer: function () {
      var that = this;
      this.delayMet = !this.options.delay;

      // init delay timer if needed
      if (!this.delayMet) {
        clearTimeout(this._mouseDelayTimer);
        this._mouseDelayTimer = setTimeout(function () {
          that.delayMet = true;
        }, this.options.delay);
      }
    },
    scroll: function (e) {
      this.clearDimensions();
      this.clearOffsetParent(); // TODO is this needed?
    },
    toggleListeners: function (method) {
      var that = this,
        events = ['drag', 'drop', 'scroll'];

      $.each(events, function (i, event) {
        that.$document[method](eventNames[event], that[event + 'Proxy']);
      });
    },
    clearOffsetParent: function () {
      this.offsetParent = undefined;
    },
    // Recursively clear container and item dimensions
    clearDimensions: function () {
      this.traverse(function (object) {
        object._clearDimensions();
      });
    },
    traverse: function (callback) {
      callback(this);
      var i = this.containers.length;
      while (i--) {
        this.containers[i].traverse(callback);
      }
    },
    _clearDimensions: function () {
      this.containerDimensions = undefined;
    },
    _destroy: function () {
      containerGroups[this.options.group] = undefined;
    },
  };

  function Container(element, options) {
    this.el = element;
    this.options = $.extend({}, containerDefaults, options);

    this.group = ContainerGroup.get(this.options);
    this.rootGroup = this.options.rootGroup || this.group;
    this.handle =
      this.rootGroup.options.handle || this.rootGroup.options.itemSelector;

    var itemPath = this.rootGroup.options.itemPath;
    this.target = itemPath ? this.el.find(itemPath) : this.el;

    this.target.on(eventNames.start, this.handle, $.proxy(this.dragInit, this));

    if (this.options.drop) this.group.containers.push(this);
  }

  Container.prototype = {
    dragInit: function (e) {
      var rootGroup = this.rootGroup;

      if (
        !this.disabled &&
        !rootGroup.dragInitDone &&
        this.options.drag &&
        this.isValidDrag(e)
      ) {
        rootGroup.dragInit(e, this);
      }
    },
    isValidDrag: function (e) {
      return (
        e.which == 1 ||
        (e.type == 'touchstart' && e.originalEvent.touches.length == 1)
      );
    },
    searchValidTarget: function (pointer, lastPointer) {
      var distances = sortByDistanceDesc(
          this.getItemDimensions(),
          pointer,
          lastPointer
        ),
        i = distances.length,
        rootGroup = this.rootGroup,
        validTarget =
          !rootGroup.options.isValidTarget ||
          rootGroup.options.isValidTarget(rootGroup.item, this);

      if (!i && validTarget) {
        rootGroup.movePlaceholder(this, this.target, 'append');
        return true;
      } else
        while (i--) {
          var index = distances[i][0],
            distance = distances[i][1];
          if (!distance && this.hasChildGroup(index)) {
            var found = this.getContainerGroup(index).searchValidTarget(
              pointer,
              lastPointer
            );
            if (found) return true;
          } else if (validTarget) {
            this.movePlaceholder(index, pointer);
            return true;
          }
        }
    },
    movePlaceholder: function (index, pointer) {
      var item = $(this.items[index]),
        dim = this.itemDimensions[index],
        method = 'after',
        width = item.outerWidth(),
        height = item.outerHeight(),
        offset = item.offset(),
        sameResultBox = {
          left: offset.left,
          right: offset.left + width,
          top: offset.top,
          bottom: offset.top + height,
        };
      if (this.options.vertical) {
        var yCenter = (dim[2] + dim[3]) / 2,
          inUpperHalf = pointer.top <= yCenter;
        if (inUpperHalf) {
          method = 'before';
          sameResultBox.bottom -= height / 2;
        } else sameResultBox.top += height / 2;
      } else {
        var xCenter = (dim[0] + dim[1]) / 2,
          inLeftHalf = pointer.left <= xCenter;
        if (inLeftHalf) {
          method = 'before';
          sameResultBox.right -= width / 2;
        } else sameResultBox.left += width / 2;
      }
      if (this.hasChildGroup(index)) sameResultBox = emptyBox;
      this.rootGroup.movePlaceholder(this, item, method, sameResultBox);
    },
    getItemDimensions: function () {
      if (!this.itemDimensions) {
        this.items = this.$getChildren(this.el, 'item')
          .filter(
            ':not(.' +
              this.group.options.placeholderClass +
              ', .' +
              this.group.options.draggedClass +
              ')'
          )
          .get();
        setDimensions(
          this.items,
          (this.itemDimensions = []),
          this.options.tolerance
        );
      }
      return this.itemDimensions;
    },
    getItemOffsetParent: function () {
      var offsetParent,
        el = this.el;
      // Since el might be empty we have to check el itself and
      // can not do something like el.children().first().offsetParent()
      if (
        el.css('position') === 'relative' ||
        el.css('position') === 'absolute' ||
        el.css('position') === 'fixed'
      )
        offsetParent = el;
      else offsetParent = el.offsetParent();
      return offsetParent;
    },
    hasChildGroup: function (index) {
      return this.options.nested && this.getContainerGroup(index);
    },
    getContainerGroup: function (index) {
      var childGroup = $.data(this.items[index], subContainerKey);
      if (childGroup === undefined) {
        var childContainers = this.$getChildren(this.items[index], 'container');
        childGroup = false;

        if (childContainers[0]) {
          var options = $.extend({}, this.options, {
            rootGroup: this.rootGroup,
            group: groupCounter++,
          });
          childGroup =
            childContainers[pluginName](options).data(pluginName).group;
        }
        $.data(this.items[index], subContainerKey, childGroup);
      }
      return childGroup;
    },
    $getChildren: function (parent, type) {
      var options = this.rootGroup.options,
        path = options[type + 'Path'],
        selector = options[type + 'Selector'];

      parent = $(parent);
      if (path) parent = parent.find(path);

      return parent.children(selector);
    },
    _serialize: function (parent, isContainer) {
      var that = this,
        childType = isContainer ? 'item' : 'container',
        children = this.$getChildren(parent, childType)
          .not(this.options.exclude)
          .map(function () {
            return that._serialize($(this), !isContainer);
          })
          .get();

      return this.rootGroup.options.serialize(parent, children, isContainer);
    },
    traverse: function (callback) {
      $.each(this.items || [], function (item) {
        var group = $.data(this, subContainerKey);
        if (group) group.traverse(callback);
      });

      callback(this);
    },
    _clearDimensions: function () {
      this.itemDimensions = undefined;
    },
    _destroy: function () {
      var that = this;

      this.target.off(eventNames.start, this.handle);
      this.el.removeData(pluginName);

      if (this.options.drop)
        this.group.containers = $.grep(this.group.containers, function (val) {
          return val != that;
        });

      $.each(this.items || [], function () {
        $.removeData(this, subContainerKey);
      });
    },
  };

  var API = {
    enable: function () {
      this.traverse(function (object) {
        object.disabled = false;
      });
    },
    disable: function () {
      this.traverse(function (object) {
        object.disabled = true;
      });
    },
    serialize: function () {
      return this._serialize(this.el, true);
    },
    refresh: function () {
      this.traverse(function (object) {
        object._clearDimensions();
      });
    },
    destroy: function () {
      this.traverse(function (object) {
        object._destroy();
      });
    },
  };

  $.extend(Container.prototype, API);

  /**
   * jQuery API
   *
   * Parameters are
   *   either options on init
   *   or a method name followed by arguments to pass to the method
   */
  $.fn[pluginName] = function (methodOrOptions) {
    var args = Array.prototype.slice.call(arguments, 1);

    return this.map(function () {
      var $t = $(this),
        object = $t.data(pluginName);

      if (object && API[methodOrOptions])
        return API[methodOrOptions].apply(object, args) || this;
      else if (
        !object &&
        (methodOrOptions === undefined || typeof methodOrOptions === 'object')
      )
        $t.data(pluginName, new Container($t, methodOrOptions));

      return this;
    });
  };
})(jQuery, window, 'sortable');

$(document).ready(function () {
  //select
  $.fn.niceSelect = function (method) {
    // Methods
    if (typeof method == 'string') {
      if (method == 'update') {
        this.each(function () {
          var $select = $(this);
          var $dropdown = $(this).next('.ne-select');
          var open = $dropdown.hasClass('open');

          if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select);

            if (open) {
              $select.next().trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        this.each(function () {
          var $select = $(this);
          var $dropdown = $(this).next('.ne-select');

          if ($dropdown.length) {
            $dropdown.remove();
            $select.css('display', '');
          }
        });
        if ($('.ne-select').length == 0) {
          $(document).off('.ne_select');
        }
      } else {
        console.log('Method "' + method + '" does not exist.');
      }
      return this;
    }

    // Hide native select
    this.hide();

    // Create custom markup
    this.each(function () {
      var $select = $(this);

      if (!$select.next().hasClass('ne-select')) {
        create_nice_select($select);
      }
    });

    function create_nice_select($select) {
      $select.after(
        $('<div></div>')
          .addClass('ne-select')
          .addClass($select.attr('class') || '')
          .addClass($select.attr('disabled') ? 'disabled' : '')
          .attr('tabindex', $select.attr('disabled') ? null : '0')
          .html('<span class="current"></span><ul class="list"></ul>')
      );

      var $dropdown = $select.next();
      var $options = $select.find('option');

      var $selectedOption = $select.find('option:selected');
      var selectValue = $selectedOption.val();
      var placeholder =
        $select.data('placeholder') || $select.attr('data-placeholder');

      var isPlaceholder = typeof placeholder !== 'undefined';

      var $matchedOption = $options.filter('[value="' + selectValue + '"]');

      var currentText = isPlaceholder
        ? placeholder || '&nbsp;'
        : $selectedOption.data('display') || $selectedOption.text();

      var $current = $dropdown.find('.current');
      $current.text(currentText);
      $current.toggleClass('placeholder', isPlaceholder);

      $options.each(function (i) {
        var $option = $(this);
        var display = $option.data('display');

        var isSelected =
          !isPlaceholder && $option.val() === selectValue ? ' selected' : '';

        $dropdown.find('ul').append(
          $('<li></li>')
            .attr('data-value', $option.val())
            .attr('data-display', display || null)
            .addClass(
              'option' +
                isSelected +
                ($option.is(':disabled') ? ' disabled' : '')
            )
            .append($('<p></p>').text($option.text()))
        );
      });
    }

    /* Event listeners */

    // Unbind existing events in case that the plugin has been initialized before
    $(document).off('.ne_select');

    // Open/close
    $(document).on('click.ne_select', '.ne-select', function (event) {
      var $dropdown = $(this);

      $('.ne-select').not($dropdown).removeClass('open');
      $dropdown.toggleClass('open');

      if ($dropdown.hasClass('open')) {
        $dropdown.find('.option');
        $dropdown.find('.focus').removeClass('focus');
        $dropdown.find('.selected').addClass('focus');
      } else {
        $dropdown.focus();
      }
    });

    // Close when clicking outside
    $(document).on('click.ne_select', function (event) {
      if ($(event.target).closest('.ne-select').length === 0) {
        $('.ne-select').removeClass('open').find('.option');
      }
    });

    // Option click
    $(document).on(
      'click.ne_select',
      '.ne-select .option:not(.disabled)',
      function (event) {
        var $option = $(this);
        var $dropdown = $option.closest('.ne-select');
        var $current = $dropdown.find('.current');

        $dropdown.find('.selected').removeClass('selected');
        $option.addClass('selected');

        var text = $option.data('display') || $option.text();
        $dropdown.find('.current').text(text);

        // ✅ placeholder 클래스 제거
        $current.removeClass('placeholder');

        $dropdown.prev('select').val($option.data('value')).trigger('change');
      }
    );

    // Keyboard events
    $(document).on('keydown.ne_select', '.ne-select', function (event) {
      var $dropdown = $(this);
      var $focused_option = $(
        $dropdown.find('.focus') || $dropdown.find('.list .option.selected')
      );

      // Space or Enter
      if (event.keyCode == 32 || event.keyCode == 13) {
        if ($dropdown.hasClass('open')) {
          $focused_option.trigger('click');
        } else {
          $dropdown.trigger('click');
        }
        return false;
        // Down
      } else if (event.keyCode == 40) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $next = $focused_option.nextAll('.option:not(.disabled)').first();
          if ($next.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $next.addClass('focus');
          }
        }
        return false;
        // Up
      } else if (event.keyCode == 38) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
          if ($prev.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $prev.addClass('focus');
          }
        }
        return false;
        // Esc
      } else if (event.keyCode == 27) {
        if ($dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        }
        // Tab
      } else if (event.keyCode == 9) {
        if ($dropdown.hasClass('open')) {
          return false;
        }
      }
    });

    // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      $('html').addClass('no-csspointerevents');
    }

    return this;
  };

  $('.ne select').niceSelect();
  $('.ne-modal select').niceSelect();

  //tab
  document.querySelectorAll('.ne-tabs').forEach((tabsContainer) => {
    const tabLinks = tabsContainer.querySelectorAll('.ne-tabs-item');

    tabLinks.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();

        // 탭 그룹 기준으로만 처리
        const container = tab.closest('.ne-tabs').parentElement;

        // 탭 그룹 안 모든 탭 비활성화
        container
          .querySelectorAll('.ne-tabs-item')
          .forEach((t) => t.classList.remove('active'));

        // 콘텐츠 영역 비활성화
        container
          .querySelectorAll('.ne-tabs-contents')
          .forEach((c) => c.classList.remove('active'));

        // 현재 탭 활성화
        tab.classList.add('active');

        // 대상 콘텐츠 활성화
        const targetId = tab.getAttribute('href').replace('#', '');
        const targetContent = container.querySelector(`#${targetId}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });

  //input
  $(document).on('input', '.ne-input input', function () {
    const $parent = $(this).closest('.ne-input');
    if ($(this).val().trim() !== '') {
      $parent.addClass('has-value'); // 원하는 클래스
    } else {
      $parent.removeClass('has-value');
    }
  });
  $(document).on('click', '.ne-input button', function () {
    const $parent = $(this).closest('.ne-input');
    $(this).siblings('input').val('');
    $parent.removeClass('has-value');
  });

  //password
  $('.ne-password button').on('click', function () {
    const $container = $(this).closest('.ne-password');
    const $input = $container.find('input');

    // active 클래스 토글
    $container.toggleClass('active');

    // type 토글
    const isPassword = $input.attr('type') === 'password';
    $input.attr('type', isPassword ? 'text' : 'password');
  });

  //faq
  $('.ne-faq-item__question').on('click', function () {
    const $item = $(this).closest('.ne-faq-item');
    const $answer = $(this).next('.ne-faq-item__answer');

    $('.ne-faq-item').not($item).removeClass('active');
    $('.ne-faq-item__answer')
      .not($answer)
      .each(function () {
        const $el = $(this);
        if ($el.height() > 0) {
          $el.css('height', $el.height() + 'px');
          $el[0].offsetHeight;
          $el.css('height', '0px');
        }
      });

    if ($answer.height() > 0) {
      $answer.css('height', $answer.height() + 'px');
      $answer[0].offsetHeight;
      $answer.css('height', '0px');
      $item.removeClass('active');
    } else {
      $answer.css('height', $answer[0].scrollHeight + 'px');
      $item.addClass('active');
    }
  });

  $('.ne-faq-item__answer').on('transitionend', function () {
    if ($(this).height() !== 0) {
      $(this).css('height', 'auto');
    }
  });

  //class
  $('.ne-class-home-class-head h4 button').on('click', function () {
    const $item = $(this).closest('.ne-class-home-class');
    const $answer = $(this)
      .closest('.ne-class-home-class')
      .find('.ne-class-home-class-contents');

    $('.ne-class-home-class').not($item).removeClass('active');
    $('.ne-class-home-class-contents')
      .not($answer)
      .each(function () {
        const $el = $(this);
        if ($el.height() > 0) {
          $el.css('height', $el.height() + 'px');
          $el[0].offsetHeight;
          $el.css('height', '0px');
        }
      });

    if ($answer.height() > 0) {
      $answer.css('height', $answer.height() + 'px');
      $answer[0].offsetHeight;
      $answer.css('height', '0px');
      $item.removeClass('active');
    } else {
      $answer.css('height', $answer[0].scrollHeight + 'px');
      $item.addClass('active');
    }
  });

  $('.ne-class-home-class').on('transitionend', function () {
    if ($(this).height() !== 0) {
      $(this).css('height', 'auto');
    }
  });

  //modal
  // 열기 버튼 클릭
  document.querySelectorAll('[data-bs-target]').forEach((button) => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-bs-target');
      const modal = document.querySelector(targetId);
      if (modal) {
        modal.classList.add('show');

        // 백드롭 추가
        let backdrop = document.createElement('div');
        backdrop.className = 'ne-modal-backdrop fade';
        document.body.appendChild(backdrop);

        requestAnimationFrame(() => {
          backdrop.classList.add('show');
        });
      }
    });
  });

  // 닫기 버튼(data-bs-dismiss="modal") 클릭
  document.addEventListener('click', function (e) {
    const dismissBtn = e.target.closest('[data-bs-dismiss="modal"]');
    if (dismissBtn) {
      const modal = dismissBtn.closest('.ne-modal');
      if (modal) {
        modal.classList.remove('show');
      }

      const backdrop = document.querySelector('.ne-modal-backdrop');
      if (backdrop) {
        // show 제거로 fade-out 시작
        backdrop.classList.remove('show');

        // 트랜지션 완료 후 제거 (300ms 후)
        setTimeout(() => {
          backdrop.remove();
        }, 300); // fade 트랜지션 시간과 맞춰주세요
      }
    }
  });

  // ESC 키로 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ne-modal.show').forEach((modal) => {
        modal.classList.remove('show');
      });

      const backdrop = document.querySelector('.ne-modal-backdrop');
      if (backdrop) {
        backdrop.classList.remove('show');
        setTimeout(() => {
          backdrop.remove();
        }, 300); // fade 트랜지션 시간
      }
    }
  });

  //layer
  $('[data-toggle]').on('click', function (e) {
    const $button = $(this);
    const layerId = $button.data('toggle');
    const position = $button.data('position') || 'bottom';
    const $layer = $('#' + layerId);

    // 초기화
    $('.ne-sns-layer').removeClass(
      'active top top-left top-right bottom bottom-left bottom-right'
    );

    // 위치 클래스 추가
    $layer.addClass('active').addClass(position);

    // 버튼 위치 기준으로 레이어 배치 (간단히 absolute)
    const offset = $button.offset();
    const height = $button.outerHeight();
    const width = $button.outerWidth();

    // 기본 위치값 (예시)
    let top = offset.top + height + 10;
    let left = offset.left;

    if (position.includes('top')) {
      top = offset.top - $layer.outerHeight() - 10;
    }

    if (position.includes('left')) {
      left = offset.left;
    } else if (position.includes('right')) {
      left = offset.left + width - $layer.outerWidth();
    } else if (position === 'top' || position === 'bottom') {
      left = offset.left + width / 2 - $layer.outerWidth() / 2;
    }

    $layer.css({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
    });
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.ne-sns-layer, [data-toggle]').length) {
      $('.ne-sns-layer').removeClass('active');
    }
  });

  //tooltip
  $('[data-toggle]').on('click', function (e) {
    const $button = $(this);
    const tooltipId = $button.data('toggle');
    const position = $button.data('position') || 'bottom';
    const $tooltip = $('#' + tooltipId);

    // 초기화
    $('.ne-tooltip').removeClass(
      'active top top-left top-right bottom bottom-left bottom-right'
    );

    // 위치 클래스 추가
    $tooltip.addClass('active').addClass(position);

    // 버튼 위치 기준으로 레이어 배치 (간단히 absolute)
    const offset = $button.offset();
    const height = $button.outerHeight();
    const width = $button.outerWidth();

    // 기본 위치값 (예시)
    let top = offset.top + height + 10;
    let left = offset.left;

    if (position.includes('top')) {
      top = offset.top - $tooltip.outerHeight() - 10;
    }

    if (position.includes('left')) {
      left = offset.left;
    } else if (position.includes('right')) {
      left = offset.left + width - $tooltip.outerWidth();
    } else if (position === 'top' || position === 'bottom') {
      left = offset.left + width / 2 - $tooltip.outerWidth() / 2;
    }

    $tooltip.css({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
    });
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.ne-tooltip, [data-toggle]').length) {
      $('.ne-tooltip').removeClass('active');
    }
  });
  $('.ne-tooltip .ne-btn').on('click', function (e) {
    $(this).parents('.ne-tooltip').removeClass('active');
  });
});
