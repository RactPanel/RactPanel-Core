/*
 * RactPanel.js
 *
 * @package ZPanel
 * @version 1.0.0
 * @author Jason Davis - <jason.davis.fl@gmail.com>
 * @copyright (c) 2013 ZPanel Group - http://www.zpanelcp.com/
 * @license http://opensource.org/licenses/gpl-3.0.html GNU Public License v3
 */

// The Main RactPanel.js file requires these libraries to assist it and make it all work...
// /js/jquery.js
// /js/jquery.cookie.js
// /js/jquery.sortable-custom.js
// /js/spin.min.js
// /js/bootstrap-alert.js
// /js/bootstrap-modal.js
// /js/bootstrap-dropdown.js
// /js/bootstrap-tab.js
// /js/bootstrap-tooltip.js
// /js/bootstrap-popover.js
// /js/typeahead.js

var RactPanel = {

    init: function() {

        RactPanel.utils.log('RactPanel.init() ran');
        RactPanel.menu.header();
        RactPanel.menu.sidebar();
        RactPanel.loader.init();
        RactPanel.stats.init();
        RactPanel.modules.dragDrop();
        RactPanel.modules.boxes();

        // Enable Bootstrap Pop-overs
        $('body').popover({
            selector: '[rel^=popover]',
            container: 'body',
            trigger: 'hover'
        });
        
        // When Client Notice is Closed Hide Until it Changes
        var Notice_Cookie = $('.notice-manager-alert').find('p').text().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').substring(0, 64);
        if($.cookie(Notice_Cookie) != 'closed') {
            $('.notice-manager-alert').removeClass('hidden');
        }
        $('.notice-manager-alert > .close').click( function () {
            $.cookie(Notice_Cookie, 'closed', {path: '/'});
        });


        //RactPanelDNS.utils.cache.dnsTitleId = $("#dnsTitle");

    },

    utils: {
        settings: {
            debug: true
        },

        cache: {},

        log: function(what) {
            if (RactPanel.utils.settings.debug) {
                console.log(what);
            }
        },

        /* Merge source object properties into destination object */
        deepExtend: function(destination, source) {
            var property;
            for (property in source) {
                if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    //RactPanel.utils.log(source[property].constructor);
                    destination[property] = destination[property] || {};
                    RactPanel.utils.deepExtend(destination[property], source[property]);
                } else if (property in destination) {
                    destination[property] = source[property];
                } else {
                    throw new Error('RactPanel.deepExtend was passed a non-supported Property: ' + property);
                }
            }
            return destination;
        },

        addEvent: function addEvent(element, eventName, func) {
            if (element.addEventListener) {
                return element.addEventListener(eventName, func, false);
            } else if (element.attachEvent) {
                return element.attachEvent("on" + eventName, func);
            }
        },

    },


    loader: {

        spinner: null,

        init: function() {
            RactPanel.utils.log('RactPanel.loader.init() ran - Watching for Click events');
            //Bind zloader to button click
            $('#button').click(function() {
                RactPanel.loader.showLoader();
            });
            // $('.fg-button').click(function() {
            //     RactPanel.loader.showLoader();
            // });
            $('.button-loader').click(function() {
                RactPanel.loader.showLoader();
            });
            //Bind zloader to save button click
            // $('.save').click(function() {
            //     RactPanel.loader.showLoader();
            // });

        },

        showLoader: function() {
            //Show Spinning Loader
            RactPanel.utils.log('RactPanel.loader.showLoader() ran - Show Spinning Loader screen');
            $('#zloader_overlay').fadeIn('fast', function() {
                $("#zloader").show();
                RactPanel.loader.buildSpinner();
            });
        },

        hideLoader: function() {
            //Hide  Spinning Loader
            RactPanel.utils.log('RactPanel.loader.hideLoader() ran - Remove Spinning Loader screen');
            $('#zloader_overlay').fadeOut('fast', function() {
                $("#zloader").hide();
                RactPanel.loader.spinner.stop();
            });
        },


        // REQUIRES spin.min.js to be loaded FIRST
        // http://fgnass.github.io/spin.js/
        buildSpinner: function() {
            RactPanel.utils.log('RactPanel.loader.buildSpinner() ran - Builing Spining Loader');
            var opts = {
                lines: 9, // The number of lines to draw
                length: 11, // The length of each line
                width: 13, // The line thickness
                radius: 40, // The radius of the inner circle
                corners: 0.4, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                color: '#000', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };

            var target = document.getElementById('zloader_content');
            RactPanel.loader.spinner = new Spinner(opts).spin(target);
        },
    },


    notice: {

        // Show a Custom Bootstrap Notice
        // Example Usage
        // RactPanel.notice.show({
        //     type: "success",
        //     selector: "#alert-area",
        //     closeTime: 6000,
        //     autoClose: true,
        //     message: "<strong>Warnig:</strong> Show my custom notice message here",
        //     closeButton: true
        // });

        show: function(options) {
            var i;

            RactPanel.utils.log('RactPanel.notice.show() ran - Show Notice');
            // Default options
            this.options = {
                selector: "#alert-area", // Selector: Specify the Div ID to Append Notice to
                closeButton: true, // Boolean: Show Close X Button true or false
                autoClose: false, // Boolean: Automatically close true or false
                closeTime: 6000, // Integer: Time to before closing if autoClose is True
                type: "success", // String: Alert type "success", "error", "info"
                message: "" // String: The Notice Message
            };

            // User defined options over-ride default options
            for (i in options) {
                if (i in this.options) {
                    this.options[i] = options[i];
                } else {
                    throw new Error('Notice doesn\'t support option: ' + i);
                }
            }

            var closeTmpl = (this.options.closeButton) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '';
            var selector = $(this.options.selector);

            // Append Notice Div
            selector.append($('<div class="alert alert-' + this.options.type + ' fade in" data-alert>' + closeTmpl + '' + this.options.message + '</div>'));

            // If Autoclose is enabled then Close/remove the Notice Div after X seconds
            if (this.options.autoClose) {
                setTimeout(function() {
                    RactPanel.notice.hide(selector);
                }, this.options.closeTime);
            }
        },

        hide: function(selector) {
            RactPanel.utils.log('RactPanel.notice.hide() ran - Hide Notice');
            selector.children(".alert:first").fadeOut('slow', function() {
                $(this).remove();

            })
        },

    },


    dialog: {

        // Show a Custom Bootstrap Dialog based on BS Modal
        confirm: function(options) {

            var self = this,
                i,
                okButtonStyle,
                cancelButtonStyle,
                dialogTemplate,
                dialogDiv,
                backdropDiv;

            RactPanel.utils.log('RactPanel.dialog.confirm() ran - Show Dialog');
            // Default options
            this.options = {
                title: 'ATTENTION',
                message: '',
                width: 500,
                cancelButton: {
                    show: true,
                    text: 'default cancel',
                    class: 'btn-default'
                },
                okButton: {
                    show: true,
                    text: 'default ok',
                    class: 'btn-primary'
                },
                cancelCallback: function() {}, // Function: Callback function when Cancel button clicked
                okCallback: function() {} // Function: Callback function when Ok button clicked
            };

            // Merge User defined options
            RactPanel.utils.deepExtend(this.options, options);

            // Check for Hidden Buttons
            okButtonStyle = this.options.okButton.show === false ? 'style="display: none;"' : 
            '';
            cancelButtonStyle = this.options.cancelButton.show === false ? 'style="display: none;"' : 
            '';

            // Create Dialog Div
            dialogTemplate = document.createElement('div');
            dialogTemplate.innerHTML +=
                '<div class="modal-content confirm panel panel-primary" style="width: ' + this.options.width + 'px; border: 1px solid #428BCA;">' +
                '<div class="panel-heading">' + this.options.title + '</div>' +
                '<div class="modal-body">' +
                '<div>' + this.options.message + '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" id="okbtn" class="btn ' + this.options.okButton.class + '" ' + okButtonStyle + '>' + this.options.okButton.text + '</button>' +
                '<button type="button" class="btn ' + this.options.cancelButton.class + '" ' + cancelButtonStyle + '>' + this.options.cancelButton.text + '</button>' +
                '</div>' +
                '</div>';


            dialogDiv = dialogTemplate.firstChild;
            document.body.appendChild(dialogDiv);

            // Create Backdrop Div
            backdropDiv = document.createElement('div');
            backdropDiv.className = 'modal-backdrop fade in';
            document.body.appendChild(backdropDiv);

            //OK button click event
            if (this.options.okButton.show !== false) {
                var ok = dialogDiv.getElementsByTagName('button')[0];
                RactPanel.utils.addEvent(ok, 'click', function() {
                    //ok.addEventListener('click', function() {
                    document.body.removeChild(dialogDiv);
                    document.body.removeChild(backdropDiv);
                    //self.options.okCallback();
                    self.options.okCallback.apply(this, arguments);
                }, false);
            }

            //Cancel button click event
            if (this.options.cancelButton.show !== false) {
                var cancel = dialogDiv.getElementsByTagName('button')[1];
                RactPanel.utils.addEvent(cancel, 'click', function() {
                    //cancel.addEventListener('click', function() {
                    document.body.removeChild(dialogDiv);
                    document.body.removeChild(backdropDiv);
                    //self.options.cancelCallback();
                    self.options.cancelCallback.apply(this, arguments);
                }, false);
            }

        }

    },


    stats: {
        init: function() {
            //Account Stats Tabs
            // Requires Bootstrap tabs
            $('#stats-tab a').click(function(e) {
                RactPanel.utils.log('RactPanel.stats.init Click Event - Toggle Stats Tabs');
                e.preventDefault();
                $(this).tab('show');
            })
        }

    },

    menu: {

        header: function() {
            // Add .active current page drop-down Header Nav Sub-menu
            $('ul.dropdown-menu > li.active  ').parent().parent().addClass('active');
        },

        sidebar: function() {

            RactPanel.utils.log('RactPanel.menu.sidebar() Ran - Handle sidebar menu clicks');
            // // Handle the Sidebar Menu state based on Click events
            $('#menu-sidebar li:has(ul) .heading').click(function() {
                $(this).next().toggle();
                if ($(this).next().is(':visible')) {
                    $.cookie($(this).text().replace(/\+|-|\s/g, ''), 'expanded');
                    $(this).children('.open').text('-');
                }

                if ($(this).next().is(':hidden')) {
                    $.cookie($(this).text().replace(/\+|-|\s/g, ''), 'collapsed');
                    $(this).children('.open').text('+');
                }
            });

            // Handle the Sidebar Menu state based on current Cookie values
            $('#menu-sidebar > li').each(function() {
                var cookieName = $(this).children('.heading').text().replace(/\+|-|\s/g, '')
                var verticalNav = $.cookie(cookieName);

                if (verticalNav == 'expanded') {
                    $(this).find('ul').show();
                    $(this).find('.open').text('-');
                }
            });

        }

    },

    modules: {

        // Requires Draggable/Sortable JS Library
        dragDrop: function() {
            RactPanel.utils.log('RactPanel.modules.dragDrop() Ran - Handle Module Box Sorting');
            $('.sortable').sortable({
                handle: '.handle',
                onStartDrag: function() {
                    RactPanel.modules.addFloats($(".sortable"));
                },
                onEndDrag: function() {
                    RactPanel.modules.addFloats($(".sortable"))
                },
                onChangeOrder: function() {
                    RactPanel.modules.addFloats($(".sortable"))
                }
            }).bind('sortupdate', function() {

                var sortorder = new Array();
                RactPanel.modules.addFloats($(".sortable"));

                $('.sortable li.module-box').each(function() {
                    sortorder.push($(this).attr('data-catid'));
                });

                RactPanel.loader.showLoader();

                $.ajax({
                    type: "POST",
                    url: "dryden/ajax/moduleorder.php",
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",
                    data: {
                        'moduleorder': sortorder,
                        //'csrfmiddlewaretoken': ''
                    },

                    success: function(data) {
                        RactPanel.utils.log('RactPanel.modules.dragDrop() AJAX Sorting order Saved');
                        RactPanel.loader.hideLoader();
                    },

                    error: function(ts) {
                        RactPanel.utils.log('ERROR: RactPanel.modules.dragDrop() AJAX Sorting order NOT Saved');
                        RactPanel.loader.hideLoader();
                    }

                });
            });

            RactPanel.modules.addFloats($(".sortable"));

        },

        addFloats: function(container) {
            RactPanel.utils.log('RactPanel.modules.addFloats() - Floats added for Drag/Drop Modules');
            $(container).find(".module-box:not(.sortable-dragging)").removeClass("sortable-first-col").each(function(index, element) {
                if (index % 2 == 0) {
                    $(this).addClass("sortable-first-col");
                }
            });
        },


        boxes: function() {

            // If Hash exist in URI then Add appropriate Category Class
            if (location.hash) {
                $(location.hash).addClass('active-cat');
            }

            // Module-box Expand/Collapse click event
            $('.module-box-title .tools .expand, .module-box-title .tools .collapse').click(function(e) {
                RactPanel.utils.log('modulebox clicked');
                var el = $(this).parents(".module-box").children(".module-box-body");
                var cookieName = $(this).parents(".module-box-title").children("h4").text() + 'Module';

                if ($(this).hasClass("collapse")) {
                    $(this).removeClass("collapse").addClass("expand");
                    //alert(cookieName);
                    $.cookie(cookieName, 'collapse');
                    $(this).html('<i class="icon-down-open"></i>');
                    el.slideUp(200);
                } else {
                    $(this).removeClass("expand").addClass("collapse");
                    $.cookie(cookieName, 'expand');
                    $(this).html('<i class="icon-up-open"></i>');
                    el.slideDown(200);
                }
                e.preventDefault();
            });

            // Handle the Module-box Expand/Collapse state based on current Cookie values
            $('.module-box-title .tools .expand, .module-box-title .tools .collapse').each(function() {
                var cookieName = $(this).parents(".module-box-title").children("h4").text() + 'Module';
                var verticalNav = $.cookie(cookieName);
                var el = $(this).parents(".module-box").children(".module-box-body");

                if (verticalNav == 'collapse') {
                    el.hide();
                    $(this).html('<i class="icon-down-open"></i>');
                    $(this).removeClass("collapse").addClass("expand");
                }
            });

        },

        // Show Bootstrap typeAhead with Redirect.
        // Pass in JSON object with Names and URLs
        // typeAheadOLD: function(moduleNames) {
        //     var moduleNames = new Array();
        //     var moduleUrls = new Object();
        //     // Build Arrays
        //     $.each(moduleJsonData, function(index, module) {
        //         moduleNames.push(module.name);
        //         moduleUrls[module.name] = module.url;
        //     });
        //     // Attach Bootstrap TypeAhead
        //     $('#module-search').typeahead({
        //         source: moduleNames,
        //         updater: function(item) {
        //             RactPanel.loader.showLoader();
        //             setTimeout(function() {
        //                 window.location.href = '/?module=' + moduleUrls[item];
        //                 return item;
        //             }, 1000);

        //         }
        //     });
        // },

        // Show Twitter typeAhead with Redirect.
        // Pass in JSON object with Names and URLs
        typeAhead: function(moduleNames) {
            var moduleNames = new Array();
            var moduleUrls = new Object();

            // Build Arrays
            $.each(moduleJsonData, function(index, module) {
                moduleNames.push(module.name);
                moduleUrls[module.name] = module.url;
            });

            // Attach Twitter TypeAhead
            $('#module-search').typeahead({
                name: 'modules',
                local: moduleNames,
                header: '<h3 class="module-search">Modules</h3>'
            }).on('typeahead:selected typeahead:autocompleted', function($e,datum) {
                var $typeahead = $(this);
                RactPanel.utils.log(moduleUrls[datum.value]);
                    window.location.href = '/?module=' + moduleUrls[datum.value];
            });
        }


    }

};

$(function() {
    RactPanel.utils.settings.debug = false;
    RactPanel.init();
});
