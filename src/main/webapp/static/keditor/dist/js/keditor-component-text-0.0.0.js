/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
/**
 * KEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.dtd.$removeEmpty['i'] = false;
    
    // Text component
    // ---------------------------------------------------------------------
    KEditor.components['text'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "text" component', component);
            
            var options = keditor.options;
            
            var componentContent = component.find('.keditor-component-content');
            var ckeditorPlace = componentContent.find('.keditor-component-text-content-inner');
            
            if (ckeditorPlace.length === 0) {
                var contentHtml = componentContent.html();
                ckeditorPlace = $('<div class="keditor-component-text-content-inner clearfix"></div>');
                componentContent.html(ckeditorPlace);
                ckeditorPlace.html(contentHtml);
                ckeditorPlace.wrap('<div class="keditor-component-text-content"></div>');
            }
            
            if (!ckeditorPlace.attr('id')) {
                ckeditorPlace.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            ckeditorPlace.prop('contenteditable', true);
            ckeditorPlace.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });
            
            var editor = ckeditorPlace.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "text" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var componentTextContent = componentContent.find('.keditor-component-text-content');
            
            var id = componentTextContent.children().attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                componentTextContent.html('<div class="keditor-component-text-content-inner clearfix">' + editor.getData() + '</div>');
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Text Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "text" component');
            
            return $.ajax({
                url: '/static/keditor/componentTextSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    // =================================================================================
                    // Backgrounds
                    // =================================================================================
                    form.find('.background-image-edit').mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                            var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;
                            target.css('background-image', 'url("' + imageUrl + '")');
                            form.find('.background-image-previewer').attr('src', imageUrl);
                        }
                    });
                    form.find('.background-image-delete').on('click', function (e) {
                        e.preventDefault();
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('background-image', '');
                        form.find('.background-image-previewer').attr('src', '/static/images/photo_holder.png');
                    });
                    
                    var colorPicker = form.find('.txt-bg-color');
                    contentEditor.initSimpleColorPicker(colorPicker, function (color) {
                        target.css('background-color', color);
                    });
                    
                    form.find('.select-bg-repeat').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-repeat', this.value);
                    });
                    
                    form.find('.select-bg-size').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-size', this.value);
                    });
                    
                    form.find('.select-bg-position').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-position', this.value);
                    });
                    
                    // =================================================================================
                    // Padding
                    // =================================================================================
                    form.find('.txt-padding').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');
                        
                        txt.on('change', function () {
                            var paddingValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content').get(0);
                            
                            if (paddingValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(paddingValue)) {
                                    paddingValue = 0;
                                    this.value = paddingValue;
                                }
                                target.style[styleName] = paddingValue + 'px';
                            }
                        });
                    });
                    
                    // =================================================================================
                    // Margin
                    // =================================================================================
                    form.find('.txt-margin').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');
                        
                        txt.on('change', function () {
                            var marginValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content').get(0);
                            
                            if (marginValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(marginValue)) {
                                    marginValue = 0;
                                    this.value = marginValue;
                                }
                                target.style[styleName] = marginValue + 'px';
                            }
                        });
                    });
                    
                    // =================================================================================
                    // Width and Height
                    // =================================================================================
                    form.find('.txt-height').on('change', function () {
                        var height = this.value || '';
                        if (isNaN(height)) {
                            height = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('height', height);
                    });
                    
                    form.find('.txt-max-height').on('change', function () {
                        var maxHeight = this.value || '';
                        if (isNaN(maxHeight)) {
                            maxHeight = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('max-height', maxHeight + 'px');
                    });
                    
                    form.find('.txt-width').on('change', function () {
                        var width = this.value || '';
                        if (isNaN(width)) {
                            width = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('width', width);
                    });
                    
                    form.find('.txt-max-width').on('change', function () {
                        var maxWidth = this.value || '';
                        if (isNaN(maxWidth)) {
                            maxWidth = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('max-width', maxWidth + 'px');
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "text" component', component);

            var target = component.find('.keditor-component-text-content').get(0);

            var imageUrl = target.style.backgroundImage;
            imageUrl = (imageUrl || '').replace(/^url\(['"]+(.+)['"]+\)$/, '$1');
            form.find('.background-image-previewer').attr('src', imageUrl !== 'none' && imageUrl !== '' ? imageUrl : '/static/images/photo_holder.png');

            form.find('.select-bg-repeat').val(target.style.backgroundRepeat || 'repeat');
            form.find('.select-bg-position').val(target.style.backgroundPosition || '0% 0%');
            form.find('.select-bg-size').val(target.style.backgroundSize || 'auto');

            form.find('.txt-bg-color').val(target.style.backgroundColor || '').trigger('update')

            form.find('.txt-padding').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.val((target.style[styleName] || '').replace('px', ''));
            });
            form.find('.txt-margin').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.val((target.style[styleName] || '').replace('px', ''));
            });

            form.find('.txt-height').val((target.style.height || '').replace('px', ''));
            form.find('.txt-max-height').val((target.style.maxHeight || '').replace('px', ''));
            form.find('.txt-width').val((target.style.width || '').replace('px', ''));
            form.find('.txt-maxWith').val((target.style.maxWidth || '').replace('px', ''));
        }
    };
    
})(jQuery);
