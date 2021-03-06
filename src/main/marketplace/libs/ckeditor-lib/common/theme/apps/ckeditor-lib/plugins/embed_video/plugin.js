(function (CKEDITOR) {
    var ALT_SUFFIX = '/alt-640-360.png';
    
    CKEDITOR.plugins.add('embed_video', {
        init: function (editor) {
            var that = this;
            
            // ===========================================================
            // Init modal for plugin
            // ===========================================================
            var modal = $('#modal-embed-video');
            if (modal.length === 0) {
                $(document.body).append(
                    '<div id="modal-embed-video" class="modal modal-mselect modal-no-foooter fade" aria-hidden="true" tabindex="-1">' +
                    '   <div class="modal-dialog modal-lg">' +
                    '       <div class="modal-content">' +
                    '           <div class="modal-header">' +
                    '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
                    '               <h4 class="modal-title">Select video</h4>' +
                    '           </div>' +
                    '           <div class="modal-body"></div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );
                modal = $('#modal-embed-video');
            }
            var modalBody = modal.find('.modal-body');
            var previewContainer;
            
            // ===========================================================
            // Add videoDialog for plugin
            // ===========================================================
            editor.addCommand('videoDialog', new CKEDITOR.command(editor, {
                exec: function (instance) {
                    if (!modalBody.data('mselect')) {
                        var options = {
                            contentType: 'video',
                            useModal: false,
                            onSelectFile: function (url, relativeUrl, fileType, hash, isAsset) {
                                flog('[CKEDITOR.embed_video] onSelectFile', url, relativeUrl, fileType, hash, isAsset);
                                
                                var uniqueId = isAsset ? hash : '';
                                uniqueId = uniqueId || previewContainer.attr('data-uniqueid');
                                var hashId = isAsset ? '' : hash;
                                hashId = hashId || previewContainer.attr('data-hash');
                                var videoUrl = isAsset ? '/assets/' + uniqueId : '/_hashes/files/' + hashId;
                                videoUrl += ALT_SUFFIX;
                                
                                that.element.setAttribute('data-hash', hashId);
                                that.element.setAttribute('data-uniqueid', uniqueId);
                                that.element.setAttribute('src', videoUrl);
                                that.element.$.removeAttribute('data-cke-saved-src');
                                that.element.setAttribute("class", "video-jw");
                                
                                var instance = modal.data('ckeditorInstance');
                                if (that.insertMode) {
                                    instance.insertElement(that.element);
                                } else {
                                    instance.updateElement();
                                }
                                
                                that.element = null;
                                modal.data('ckeditorInstance', null);
                                modal.modal('hide');
                            },
                            onReady: function () {
                                previewContainer = modalBody.find('.milton-file-preview');
                            }
                        };
                        
                        if (editor.config.basePath) {
                            options.basePath = editor.config.basePath;
                        }
                        
                        if (editor.config.pagePath) {
                            options.basePath = editor.config.pagePath;
                        }
                        
                        if (window.showAssets !== undefined) {
                            options.showAssets = window.showAssets;
                        }
                        
                        if (window.showFiles !== undefined) {
                            options.showFiles = window.showFiles;
                        }
                        
                        modalBody.mselect(options);
                    }
                    
                    var sel = instance.getSelection();
                    var element = sel.getStartElement();
                    if (element) {
                        element = element.getAscendant('img', true);
                    }
                    
                    if (CKEDITOR.plugins.embedVideo.isVideo(element)) {
                        that.insertMode = false;
                        var hash = element.getAttribute('data-hash') || '';
                        var uniqueId = element.getAttribute('data-uniqueid') || '';
                        var src = element.getAttribute('src');
                        
                        $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                            $.getScriptOnce('/static/jwplayer/jwplayer.html5.js', function () {
                                jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                                previewContainer.attr({
                                    'data-hash': hash,
                                    'data-uniqueid': uniqueId,
                                    'data-file-type': 'video',
                                    'data-src': src
                                });
                                previewContainer.html('<div class="jp-video"></div>');
                                buildJWPlayer(previewContainer.find('div.jp-video'), 100, src.replace(ALT_SUFFIX, ''), src);
                            });
                        });
                    } else {
                        element = instance.document.createElement('img');
                        that.insertMode = true;
                    }
                    
                    that.element = element;
                    modal.data('ckeditorInstance', instance);
                    modal.modal('show');
                }
            }));
            
            // ===========================================================
            // Add toolbar button for plugin
            // ===========================================================
            editor.ui.addButton('embed_video', {
                label: 'Browse and upload videos',
                command: 'videoDialog',
                toolbar: 'insert,2',
                icon: this.path + 'images/icon.png'
            });
            
            // ===========================================================
            // Adjust statement of plugin button when selection is changed
            // ===========================================================
            editor.on('selectionChange', function (evt) {
                if (editor.readOnly) {
                    return;
                }
                
                var command = editor.getCommand('videoDialog');
                var element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant('img', true);
                
                if (CKEDITOR.plugins.embedVideo.isEditableVideo(element)) {
                    command.setState(CKEDITOR.TRISTATE_ON);
                } else {
                    command.setState(CKEDITOR.TRISTATE_OFF);
                }
            });
            
            // ===========================================================
            // Double-click event handle for plugin
            // ===========================================================
            editor.on('doubleclick', function (evt) {
                var element = evt.data.element.getAscendant('img', true);
                
                if (CKEDITOR.plugins.embedVideo.isEditableVideo(element)) {
                    editor.getSelection().selectElement(element);
                    that.element = element;
                    editor.execCommand('videoDialog');
                }
            });
            
            // ===========================================================
            // Context menu for plugin
            // ===========================================================
            if (editor.contextMenu) {
                editor.addMenuGroup('videoGroup');
                
                editor.addMenuItem('videoItem', {
                    label: 'Edit video',
                    icon: this.path + 'images/icon.png',
                    command: 'videoDialog',
                    group: 'videoGroup'
                });
                
                editor.contextMenu.addListener(function (element) {
                    if (CKEDITOR.plugins.embedVideo.isEditableVideo(element))
                        return {
                            videoItem: CKEDITOR.TRISTATE_ON
                        };
                    return null;
                });
            }
        }
    });
    
    CKEDITOR.plugins.embedVideo = {
        isEditableVideo: function (element) {
            return CKEDITOR.plugins.embedVideo.isVideo(element) && !element.isReadOnly();
        },
        isVideo: function (element) {
            if (element) {
                element = element.getAscendant('img', true);
            }
            
            return element && element.getName() === 'img' && !element.data('cke-realelement') && !element.data('kaudio') && (element.hasClass('video-jw') || element.hasClass("video"));
        }
    };
    
})(CKEDITOR);