/**
 *
 * Leadpages Custom Drag & Drop 
 *
 */


var leadpages_input_data = {};
$(function() {

    env = function() {
        var env;
        if (window.location.pathname.indexOf('preview') !== -1) {
            env = 'preview';
        } else if (window.location.hostname === 'my.leadpages.net') {
            env = 'builder';
        } else if (window._phantom || window.callPhantom) {
            env = 'screenshot';
        } else if (window.location.hostname === 'localhost') {
            env = 'local';
        } else {
            env = 'production';
        }
        return env;
    };

    var render = function(buffer) {
        var t;
        var btngroup = $('#page');
        buffer.forEach(function(map) {
            var h = $('[dnd-id=' + map.id + ']');
            if (0 === h.length) {
                h = $('[dnd-sortable-name="' + map.name + '"]');
            }
            if (0 !== h.length) {
                if (t) {
                    h.detach().insertAfter(t);
                } else {
                    btngroup.append(h.detach());
                }
                t = h;
            }
        });
    };

 
    var initPanel = function() {

/*       
        <div id="template-settings">
            <a class="option-toggle"><i class="fa fa-cog" aria-hidden="true"></i></a>

                <ul class="panel-tabs">
                    <li class="tab-link current" data-tab="tab-1">Layout</li>
                    <li class="tab-link" data-tab="tab-2">Support</li>
                    <li class="tab-link" data-tab="tab-3">Templates</li>
                </ul>
                <div id="tab-1" class="tab-content current">
                  <div class="dnd"></div>
                </div>
                <div id="tab-2" class="tab-content">
                    tab2
                </div>
                <div id="tab-3" class="tab-content">
                    tab 3
                </div>
               

            
        </div>
*/
       // 
       // $ts='<div id="template-settings"><a class="option-toggle"><i class="fa fa-cog" aria-hidden="true"></i></a><div class="dnd"></div></div>';

       $ts='<div id="template-settings"> <a class="option-toggle"><i class="fa fa-cog" aria-hidden="true"></i></a> <ul class="panel-tabs"> <li class="tab-link current" data-tab="tab-1">Layout</li><li class="tab-link" data-tab="tab-2">Support</li><li class="tab-link" data-tab="tab-3">Templates</li></ul> <div id="tab-1" class="tab-content current"> <div class="dnd"></div></div><div id="tab-2" class="tab-content"> tab2 </div><div id="tab-3" class="tab-content"> tab 3 </div></div>';
        
       $('body').prepend($ts);

       $('ul.panel-tabs li').click(function(){
        var tab_id = $(this).attr('data-tab');
        $('ul.panel-tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
        });

       $('.option-toggle').click(function() {
            $('#template-settings').toggleClass('sleep');
            
            $('.sortable-element').toggleClass('sortable-element-minimized');
       }); 

       
        var data = [];
        var container = $('.dnd');
        var refresh = function() {
            $('[dnd-sortable=true]').each(function() {
                var inputsPlugin = $(this);
                data.push({
                    id: inputsPlugin.attr('dnd-id'),
                    name: inputsPlugin.attr('dnd-sortable-name')
                });
            });
        };

        if (window.top.App) {
            var amount = window.top.App.Data.read('page.variables.componentOrder');
            data = JSON.parse(amount.value || '[]'); 
            if (data.length > 0) {
                render(data);
            } else {
                refresh();
            }
        } else {
            refresh();
        }

        // var l = '<div class="sortable-panel-header clearfix"><h5><i class="fa fa-arrows"></i> Drag & Drop </h5><div class="panel-control"><div class="move-left"><a href="#" class="sortable-panel-invert-position">Move to left</a></div><div class="mize"><a href="#" class="sortable-panel-toggle">Minimize</a></div></div></div>';
        // var l='<div class="sortable-panel-header clearfix"><h5><i class="fa fa-arrows"></i> Drag & Drop </h5></div>';
       var l='';
        var out = [];

        data.forEach(function(map) {
            var copies = '<li><div class="sortable-item " data-target="' + map.id + '"><span>' + map.name + '</span></div></li>';
            out.push(copies);
            var divSpan = $('[dnd-id=' + map.id + ']');
            divSpan.addClass('sortable-element sortable-element-left').prepend('<div class="sortable-element-overlay">' + map.name + '</div>');
        });

        var shadow = '<div class="sortable-panel">' + l + '<ul class="sortable-items">' + out.join('') + '</ul></div>';
        var content = $(shadow);
        container.prepend(content);
        var ulElement = $('.sortable-items');
        ulElement.sortable({
            containment: '.sortable-panel',
            update: function() {
                var data = [];
                ulElement.find('.sortable-item').each(function() {
                    var $this = $(this);
                    var selector = $this.attr('data-target');
                    var errorName = $this.text();
                    data.push({
                        id: selector,
                        name: errorName
                    });
                });
                render(data);
                if (window.top.App) {
                    window.top.App.Data.write('page.variables.componentOrder.value', JSON.stringify(data));
                }
            }
        });

        $('.sortable-item').hover(function() {
            var $this = $(this);
            var divSpan = $('[dnd-id=' + $this.attr('data-target') + ']');
            divSpan.addClass('sortable-element-hover');
        }, function() {
            var $this = $(this);
            var $field = $('[dnd-id=' + $this.attr('data-target') + ']');
            $field.removeClass('sortable-element-hover');
        });

        $('.sortable-panel-invert-position').on('click', function(types) {
          console.log(types);
            types.preventDefault();
            var script = $(this);
            var reWhitespace = script.text();
            if (-1 !== reWhitespace.indexOf('right')) {
                content.animate({
                    left: container.width() - content.outerWidth(true) - 30
                }, 'medium', function() {
                    content.css({
                        left: '',
                        right: 0
                    });
                    script.text('Move to left');
                    $('.sortable-element').addClass('sortable-element-left');
                });
            } else {
                if (-1 !== reWhitespace.indexOf('left')) {
                    content.animate({
                        right: container.width() - content.outerWidth(true) - 30
                    }, 'medium', function() {
                        content.css({
                            left: 0,
                            right: 'inherit'
                        });
                        script.text('Move to right');
                        $('.sortable-element').removeClass('sortable-element-left');
                    });
                }
            }
        });

        $('.sortable-panel-toggle').on('click', function(types) {
            types.preventDefault();
            var ret = $(this);
            var rreturn = ret.text();
            ulElement.slideToggle('medium', function() {
                if ('Minimize' === rreturn) {
                    rreturn = 'Maximize';
                    $('.sortable-element').addClass('sortable-element-minimized');
                } else {
                    if ('Maximize' === rreturn) {
                        rreturn = 'Minimize';
                        $('.sortable-element').removeClass('sortable-element-minimized');
                    }
                }
                ret.text(rreturn);
            });
        });
    };
    
    
    var preceding = env();
    
    if (('local') == preceding){
     initPanel();     
    }
     

    if (window.top.App){
      initPanel();
      } else {
          if (window.LeadPageData && window.LeadPageData.componentOrder) {
              var data = JSON.parse(window.LeadPageData.componentOrder.value || '[]');
              render(data);
          }
      }
    
});