'use strict';

var JBApp = {
    funnel: null,

    initialized: false,

    getNodeInfo: function (node) {
        for (var key in node) {
            if (node.hasOwnProperty(key)) {
                return [key, node[key]];
            }
        }
        
        return null;
    },

    getNodeInfoById: function (id) {
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeInfo = JBApp.getNodeInfo(node);

            if (nodeInfo[1].nodeId === id) {
                return nodeInfo;
                break;
            }
        }
    },

    getNodeTypeById: function (id) {
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeInfo = JBApp.getNodeInfo(node);

            if (nodeInfo[1].nodeId === id) {
                return nodeInfo[0];
                break;
            }
        }
    },
    
    reloadFunnelJson: function () {
        flog('reloadFunnelJson');

        $('#funnelJson').reloadFragment({
            whenComplete: function () {
                JBApp.parseFunnel();
            }
        });
    },
    
    parseFunnel: function () {
        flog('parseFunnel');

        try {
            JBApp.funnel = $.parseJSON($('#funnelJson').text());
        } catch (e) {
            flog('no funnel found');
            JBApp.funnel = {
                nodes: []
            };
        }
    },

    isActionNode: function (type) {
        return type.indexOf('Action') !== 1;
    },

    isGoalNode: function (type) {
        return type.indexOf('Goal') !== 1;
    },

    newNode: function (node, type) {
        flog('newNode', node, type);

        var d = document.createElement('div');
        d.className = 'w ' + type;
        d.id = node.nodeId;
        d.setAttribute('data-type', type);

        var nodePorts = '';
        for (var portName in JBNodes[type].ports) {
            var portData = JBNodes[type].ports[portName];
            var portClass = '';
            switch (portName) {
                case 'decisionDefault':
                    portClass = 'ep-red';
                    break;

                case 'decisionChoices':
                    portClass = 'ep-green';
                    break;

                case 'timeoutNode':
                    portClass = 'ep-timeout';
                    break;

                default:
                    portClass = 'ep-basic';
            }

            nodePorts += '   <span title="' + portData.title + '" class="ep ' + portClass + '" data-name="' + portName + '"></span>';
        }

        var nodeName = node.title ? '<span class="node-title-inner">' + node.title + '</span>' : '<span class="node-title-inner text-muted">Enter title</span>';
        var nodeHtml = '';
        nodeHtml += '<div class="title"> ' + JBNodes[type].title;
        nodeHtml += '   <span class="node-buttons clearfix">';
        nodeHtml += '       <span class="btnNodeDetails" title="Edit details"><i class="fa fa-fw fa-cog"></i></span>';
        nodeHtml += '       <span class="btnNodeDelete" title="Delete this node"><i class="fa fa-fw fa-trash"></i></span>';
        nodeHtml += '   </span>';
        nodeHtml += '</div>';
        nodeHtml += '<div class="inner">';
        nodeHtml += '   <span class="nodeTitle btnNodeEdit">' + nodeName + ' <i class="fa fa-pencil"></i></span>' + nodePorts;
        nodeHtml += '</div>';

        d.innerHTML = nodeHtml;
        d.style.left = node.x + 'px';
        d.style.top = node.y + 'px';

        JBApp.jspInstance.getContainer().appendChild(d);
        JBApp.initNode(d, type);

        return d;
    },

    getConnectorStyle: function (portName) {
        var color = '';
        switch (portName) {
            case 'timeoutNode':
                color = '#e5910f';
                break;

            case 'decisionDefault':
                color = '#f00';
                break;

            case 'decisionChoices':
                color = '#008000';
                break;

            default:
                color = '#e50051';
        }

        return {
            strokeStyle: color,
            lineWidth: 2,
            outlineColor: 'transparent',
            outlineWidth: 4
        }
    },

    initNode: function (node, type) {
        flog('initNode', node, type);

        JBApp.jspInstance.draggable(node, {
            stop: function () {
                JBApp.saveFunnel();
            },
            grid: [10, 10]
        });

        for (var portName in JBNodes[type].ports) {
            JBApp.jspInstance.makeSource(node, {
                filter: '[data-name=' + portName + ']',
                connectorStyle: JBApp.getConnectorStyle(portName),
                connectionType: portName,
                maxConnections: -1
            });
        }

        JBApp.jspInstance.makeTarget(node, {
            dropOptions: {
                hoverClass: 'dragHover'
            },
            allowLoopback: false
        });
    },

    connectionTypes: {
        nextNodeId: [1, 0.775, 1, 0],
        nodeIdDelivered: [1, 0.775, 1, 0],
        nodeIdFailed: [1, 0.63, 1, 0],
        nodeIdOpened: [1, 0.475, 1, 0],
        nodeIdConverted: [1, 0.325, 1, 0],
        decisionChoices: [1, 0.775, 1, 0],
        decisionDefault: [1, 0.925, 1, 0],
        timeoutNode: [1, 0.925, 1, 0]
    },

    initConnection: function (node, type) {
        flog('initConnection', node, type);

        for (var portName in JBNodes[type].ports) {
            var connectionType = portName;

            if (portName === 'decisionChoices') {
                for (var key in node.choices) {
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: key,
                        type: connectionType
                    });
                }
            } else {
                if (portName === 'decisionDefault') {
                    portName = 'nextNodeId';
                    connectionType = 'decisionDefault';
                }

                if (node[portName]) {
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: node[portName],
                        type: connectionType
                    });
                }
            }
        }
    },
    
    saveFunnel: function (message, callback) {
        flog('saveFunnel', message);
        
        var builderStatus = $('#builder-status');
        builderStatus.stop().show().html('Saving...');
        
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            for (var key in node) {
                if (node.hasOwnProperty(key)) {
                    var nodeId = node[key].nodeId;
                    var nodeEl = $('#' + nodeId);

                    node[key].x = parseInt(nodeEl.css('left').replace('px', ''));
                    node[key].y = parseInt(nodeEl.css('top').replace('px', ''));
                }
            }
        }
        
        $.ajax({
            url: 'funnel.json',
            type: 'PUT',
            data: JSON.stringify(JBApp.funnel),
            success: function () {
                builderStatus.html(message || 'Funnel is saved').delay(2000).fadeOut(2000);
                
                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
            }
        });
    },
    
    deleteConnection: function (connection) {
        flog('deleteConnection', connection);

        var portName = connection.endpoints[0].connectionType;
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeInfo = JBApp.getNodeInfo(node);
            var nodeData = nodeInfo[1];
            var nodeType = nodeInfo[0];

            if (nodeData.nodeId === connection.sourceId) {
                if (nodeType === 'decision') {
                    if (connection.hasType('decisionDefault')) {
                        nodeData.nextNodeId = '';
                    } else if (connection.hasType('decisionChoices')) {
                        if (nodeData.choices.hasOwnProperty(connection.targetId)) {
                            delete nodeData.choices[connection.targetId];
                        }
                    }
                } else {
                    nodeData[portName] = '';
                }

                break;
            }
        }
    },
    
    hideSettingPanel: function () {
        flog('hideSettingPanel');
        
        var settingPanel = $('.panel-setting');
        settingPanel.removeClass('showed');
        settingPanel.find('.active').removeClass('active');
        JBApp.currentSettingNode = null;
        JBApp.currentSettingNodeId = null;
    },
    
    showSettingPanel: function (formName) {
        flog('showSettingPanel', formName);

        var titleSelector = '';
        var formSelector = '';
        if (typeof formName !== 'string') {
            var node = formName;
            var nodeType = JBApp.getNodeTypeById(node.nodeId);
            JBApp.currentSettingNode = node;
            JBApp.currentSettingNodeId = node.nodeId;
            formSelector = '.panel-edit-details.panel-setting-' + nodeType;
            titleSelector = '.panel-edit-details';
        } else {
            formSelector = '.panel-' + formName;
            titleSelector = '.panel-' + formName;
        }
        
        var settingPanel = $('.panel-setting');
        settingPanel.addClass('showed');
        settingPanel.find('.active').removeClass('active');

        var settingPanelBody = settingPanel.find('.panel-body');
        var formPanel = settingPanelBody.find(formSelector);
        formPanel.addClass('active');

        var settingPanelHeading = settingPanel.find('.panel-heading');
        settingPanelHeading.find(titleSelector).addClass('active');

        setTimeout(function () {
            formPanel.find('input:text').first().trigger('focus');
        }, 250);
    }
};

jsPlumb.ready(function () {
    JBApp.parseFunnel();
    
    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ['Dot', {
            radius: 2
        }],
        Connector: ['Flowchart', {
            cornerRadius: 5,
            gap: 1,
            stub: 15,
            alwaysRespectStubs: true,
            midpoint: 1
        }],
        HoverPaintStyle: {
            strokeStyle: '#1e8151',
            lineWidth: 2
        },
        ConnectionOverlays: [
            ['Arrow', {
                location: 1,
                id: 'arrow',
                length: 10,
                width: 10,
                foldback: 0.5
            }],
            ['Label', {
                label: '',
                id: 'label',
                cssClass: 'aLabel'
            }],
            ['Custom', {
                create: function () {
                    return $('<div><a href="#" title="Click to delete connection" class="buttonX"><i class="fa fa-times-circle"></i></a></div>');
                },
                events: {
                    click: function (labelOverlay, e) {
                        flog('Click on label overlay', labelOverlay, labelOverlay.component);

                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        labelOverlay.component.setParameter('clickedButtonX', true);

                        if (confirm('Are you sure you want to delete this connection?')) {
                            labelOverlay.component.setParameter('clickedButtonXCancelled', false);
                        } else {
                            labelOverlay.component.setParameter('clickedButtonXCancelled', true);
                        }
                    }
                },
                location: 0.7,
                id: 'buttonX',
                visible: false
            }]
        ],
        Container: 'paper'
    });
    JBApp.jspInstance = instance;

    for (var typeName in JBApp.connectionTypes) {
        var outPortPosition = JBApp.connectionTypes[typeName];

        instance.registerConnectionType(typeName, {
            anchors: [outPortPosition, ['LeftMiddle', 'TopCenter', 'BottomCenter']],
            connector: 'StateMachine'
        });
    }

    instance.bind('click', function (connection) {
        if (connection) {
            if (connection.getParameter('clickedButtonX') === true) {
                var clickedButtonXCancelled = connection.getParameter('clickedButtonXCancelled');
                if (clickedButtonXCancelled === false) {
                    JBApp.deleteConnection(connection);
                    instance.detach(connection);
                    JBApp.saveFunnel('Connection is deleted!');

                    return false;
                }
            }
        }

        var sourceId = connection.sourceId;
        var targetId = connection.targetId;

        flog('Click on jsplump', connection, sourceId, targetId);

        if (connection && sourceId && targetId) {
            flog('Edit connection ', connection);
            var nodes = JBApp.funnel.nodes;

            var filteredDecision = nodes.filter(function (item) {
                return item.hasOwnProperty('decision') && item['decision'].nodeId === sourceId;
            });
            flog('filteredDecision', filteredDecision);

            if (filteredDecision.length > 0) {
                var node = filteredDecision[0]['decision'];
                var choice = node.choices[targetId];
                if (choice) {
                    showChoiceForm(choice, sourceId, targetId);
                }
            }
        } else {
            flog('clicked to non-connection ', connection);
        }
    });
    
    instance.bind('mouseover', function (connection) {
        if (connection.getOverlay('buttonX')) {
            connection.getOverlay('buttonX').show();
        }
    });
    
    instance.bind('mouseout', function (connection) {
        if (connection.getOverlay('buttonX')) {
            connection.getOverlay('buttonX').hide();
        }
    });

    instance.bind('connection', function (info) {
        var nodeType = info.source.getAttribute('data-type');
        var portName = info.sourceEndpoint.connectionType;
        var portData = JBNodes[nodeType].ports[portName];
        var label = portData.label;
        var maxConnections = portData.maxConnections;
        var connection = info.connection;

        flog('In connection, nodeType: ' + nodeType + ', portName: ' + portName + ', label: ' + label + ', maxConnections: ' + maxConnections, info, connection);

        // Check limitation of connections
        if (maxConnections !== -1) {
            var existingConnections = 0;
            instance.select({
                source: connection.sourceId
            }).each(function (item) {
                if (item.endpoints.length !== 0) {
                    if (item.endpoints[0].connectionType === portName && item.endpoints[0].connections && item.endpoints[0].connections.length !== 0) {
                        existingConnections++;
                    }

                    return;
                }
            });

            if (existingConnections > maxConnections) {
                Msg.warning('You reached maximum connections (' + portData.maxConnections + ') of <b>' + portData.title + '</b>. Please delete current connection and make a new one.');
                instance.detach(connection);
                return;
            }
        }

        // Check connection between 2 nodes
        existingConnections = 0;
        instance.select({
            source: connection.sourceId,
            target: connection.targetId
        }).each(function (item) {
            if (item.endpoints.length !== 0) {
                if (item.endpoints[0].connectionType === portName && item.endpoints[0].connections && item.endpoints[0].connections.length !== 0) {
                    existingConnections++;
                }

                return;
            }
        });

        if (existingConnections > 1) {
            Msg.warning('Connection between these nodes exists');
            instance.detach(connection);
            return;
        }

        // Set label
        connection.getOverlay('label').setLabel(label);
        $(connection.getOverlay('label').canvas).addClass('showed');
        
        if (JBApp.initialized) {
            flog('New connection was made', info.connection);
            
            for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                var node = JBApp.funnel.nodes[i];
                var nodeData = JBApp.getNodeInfo(node)[1];
                
                if (nodeData.nodeId === connection.sourceId) {
                    if (nodeData.hasOwnProperty('choices')) {
                        flog('started from a decision node');
                        
                        if (connection.hasType('decisionDefault')) {
                            flog(nodeData)
                            nodeData.nextNodeId = connection.targetId;
                            flog(nodeData)
                        } else if (connection.hasType('decisionChoices')) {
                            if (!nodeData.choices) {
                                nodeData.choices = {};
                            }
                            nodeData.choices[connection.targetId] = {constant: {}};
                        }
                    } else {
                        nodeData[portName] = connection.targetId;
                    }
                    
                    break;
                }
            }

            JBApp.saveFunnel();
        }
    });
    
    // suspend drawing and initialise.
    instance.batch(function () {
        if (JBApp.funnel && JBApp.funnel.nodes && JBApp.funnel.nodes.length > 0) {
            var journeyBuilder = $('#journeyBuilder');
            $('a[href=#journeyBuilder]').on('click', function () {
                if (!journeyBuilder.hasClass('initialized')) {
                    JBApp.initialized = false;

                    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                        var node = JBApp.funnel.nodes[i];
                        var nodeInfo = JBApp.getNodeInfo(node);
                        JBApp.newNode(nodeInfo[1], nodeInfo[0]);
                    }

                    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                        var node = JBApp.funnel.nodes[i];
                        var nodeInfo = JBApp.getNodeInfo(node);
                        JBApp.initConnection(nodeInfo[1], nodeInfo[0]);
                    }

                    JBApp.initialized = true;
                    journeyBuilder.addClass('initialized')
                }
            }).trigger('click');
        }
    });

    JBApp.initialized = true;
    flog('JBApp init done');
});

function initJourneyBuilder() {
    flog('initJourneyBuilder');

    initSideBar();
    initSaveButton();
    initNodeActions();
    initSettingPanel();
    initBuilderHeightAdjuster();
}

function initSettingPanel() {
    flog('initSettingPanel');

    var panelSetting = $('.panel-setting');
    var panelSettingBody = panelSetting.find('.panel-body');

    panelSetting.find('.btn-close-setting').on('click', function (e) {
        e.preventDefault();

        JBApp.hideSettingPanel();
    });

    panelSetting.find('.btn-save-setting').on('click', function (e) {
        e.preventDefault();

        panelSettingBody.find('form.active').trigger('submit');
    });

    for (var nodeType in JBNodes) {
        var nodeDef = JBNodes[nodeType];

        if (typeof nodeDef.initSettingForm === 'function') {
            var form = $('<form class="panel-setting-' + nodeType + ' panel-edit-details"></form>');
            panelSettingBody.append(form);
            nodeDef.initSettingForm(form);
        } else {
            $.error('"initSettingForm" method of ' + nodeType + ' does not exist!');
        }
    }

    initTitleForm();
    initChoiceForm();
}

function initTitleForm() {
    flog('initTitleForm');

    var form = $('form.panel-edit-title');
    form.on('submit', function (e) {
        e.preventDefault();

        updateNode(form);
    });
}

function updateNode(form) {
    flog('updateNode', form);

    var sourceId = form.find('[name=sourceId]').val();
    var title = form.find('[name=title]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId) {
                node[key].title = title;

                JBApp.saveFunnel('Title is updated', function () {
                    var nodeTitleInner = $('#' + sourceId).find('.nodeTitle .node-title-inner');
                    if (nodeTitleInner.hasClass('text-muted')) {
                        nodeTitleInner.removeClass('text-muted')
                    }
                    nodeTitleInner.html(title);

                    JBApp.hideSettingPanel();
                });

                break;
            }
        }
    }
}

function initBuilderHeightAdjuster() {
    flog('initBuilderHeightAdjuster');

    var builder = $('#builder');

    $('.btn-increase-height').on('click', function (e) {
        e.preventDefault();

        builder.css('height', (builder.height() + 50) + 'px');
    });

    $('.btn-decrease-height').on('click', function (e) {
        e.preventDefault();

        var currentHeight = builder.height();
        var newHeight = currentHeight - 50;

        builder.css('height', (newHeight <= 500 ? 500 : newHeight) + 'px');
    });
}

function initSideBar() {
    flog('initSideBar');

    var rightPanel = $('.right-panel');

    var snippetsStr = '';
    for (var nodeType in JBNodes) {
        var nodeDef = JBNodes[nodeType];

        snippetsStr += '<li data-type="' + nodeType + '" class="list-group-item">';
        snippetsStr += '    <img src="' + nodeDef.previewUrl + '" class="img-responsive" />';
        snippetsStr += '</li>';
    }
    rightPanel.find('.list-group').html(snippetsStr);

    rightPanel.find('.list-group, .panel-body').niceScroll({
        cursorcolor: '#999',
        cursorwidth: 6,
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        },
        cursorborder: '',
        disablemutationobserver: true
    });

    rightPanel.find('.list-group-item').draggable({
        revert: 'invalid',
        tolerance: 'pointer',
        helper: 'clone'
    });

    var paper = $('#paper');
    paper.droppable({
        drop: function (event, ui) {
            var type = ui.draggable.attr('data-type');
            var node = {
                nodeId: type + '-' + uuid(),
                x: ui.offset.left - paper.offset().left,
                y: ui.offset.top - paper.offset().top
            };
            var objToPush = {};
            objToPush[type] = node;

            JBApp.newNode(node, type);
            JBApp.funnel.nodes.push(objToPush);
            JBApp.saveFunnel('New node is added!');
        }
    });
}

function showChoiceForm(choice, sourceId, targetId) {
    flog('showChoiceForm', choice, sourceId, targetId);

    var form = $('form.panel-decision');
    form.find('[name=sourceId]').val(sourceId);
    form.find('[name=targetId]').val(targetId);
    form.find('[name=constValue]').val(choice.constant.value || '');
    JBApp.showSettingPanel('decision');
}

function initChoiceForm() {
    flog('initChoiceForm');

    var form = $('form.panel-decision');
    form.on('submit', function (e) {
        e.preventDefault();
        
        doSaveChoice(form);
    });
}

function doSaveChoice(form) {
    flog('doSaveChoice', form);

    var sourceId = form.find('[name=sourceId]').val();
    var targetId = form.find('[name=targetId]').val();
    var constValue = form.find('[name=constValue]').val();

    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        var nodeData = JBApp.getNodeInfo(node)[1];
        
        if (nodeData.nodeId === sourceId) {
            if (nodeData.hasOwnProperty('choices')) {
                var choices = nodeData.choices;
                if (!choices) {
                    choices = {};
                }

                if (targetId in choices) {
                    var constant = choices[targetId].constant || {
                            value: '',
                            label: 'empty'
                        };
                    constant.value = constValue;

                    choices[targetId].constant = constant;
                }

                nodeData.choices = choices;
                break;
            }
        }
    }

    JBApp.saveFunnel('Decision choices updated', function () {
        JBApp.hideSettingPanel();
    });
}

function showTitleForm(node) {
    flog('showTitleForm', node);

    var title = node.title || '';
    var form = $('form.panel-edit-title');
    form.find('[name=title]').val(title);
    form.find('[name=sourceId]').val(node.nodeId);
    JBApp.showSettingPanel('edit-title');
}

function initNodeActions() {
    flog('initNodeActions');

    $(document.body).on('click', '.btnNodeEdit', function (e) {
        e.preventDefault();

        var nodeId = $(this).closest('.w').attr('id');
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeData = JBApp.getNodeInfo(node)[1];
            
            if (nodeData.nodeId === nodeId) {
                showTitleForm(nodeData);
                break;
            }
        }
    });

    $(document.body).on('click', '.btnNodeDetails', function (e) {
        e.preventDefault();

        var domElement = $(this).closest('.w');
        var id = domElement.attr('id');
        var type = domElement.attr('data-type');
        var nodeData = JBApp.getNodeInfoById(id)[1];

        if (typeof JBNodes[type].showSettingForm === 'function') {
            JBNodes[type].showSettingForm($('.panel-setting-' + type), nodeData);
        } else {
            $.error('"showSettingForm" method of ' + type + ' does not exist!');
        }
    });

    $(document.body).on('click', '.btnNodeDelete', function (e) {
        e.preventDefault();

        var domElement = $(this).closest('.w');
        if (confirm('Are you sure you want to delete this node?')) {
            var id = domElement.attr('id');
            deleteNode(id);
            JBApp.jspInstance.remove(id);
            JBApp.saveFunnel('Node is deleted!');
        }
    });
}

function deleteNode(nodeId) {
    flog('deleteNode', nodeId);

    var index = -1;
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === nodeId) {
                index = i;
                break;
            }
        }
    }
    
    if (index > -1) {
        JBApp.funnel.nodes.splice(index, 1);
    }
}

function initSaveButton() {
    flog('initSaveButton');

    $('#btnSave').on('click', function (e) {
        e.preventDefault();

        JBApp.saveFunnel();
    });
}

function uuid() {
    return ('xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));
}
