var tabListView;

/**
 * This method generates the diagram model for the given tree object, and set the generated model for the default view
 * @param treeObject Tree object which represents NEL source data
 */
var sourceToDesign = function (treeObject) {
    var view = setCurrentDiagramView(treeObject);
    traverseTree(treeObject, view.model, view);
    view.render();
};

/**
 * This represents a diagram element
 * @param node Current node
 * @param model Node's parent model
 * @param view Current view
 */
var traverseTree = function (node, model, view) {

    if (node.type === "Service") {

        var parameters = [
            {
                key: "title",
                value: "Source"
            }
        ];
        MainElements.lifelines.SourceLifeline.utils.createMyModel(model, parameters);
        view.render();

        var serviceValues = getParameterValue(node.parameters, "serviceValues");
        var tags = "";
        if (serviceValues["tags"]) {
            serviceValues["tags"].forEach(function (tag, index) {
                if (index != 0) {
                    tags += ", ";
                }
                tags += tag;
            });
        }

        //set service parameters for the default view
        view.serviceProduces = serviceValues["producer"]["mediaType"];
        view.serviceBasePath = getParameterValue(node.parameters, "path");
        view.servicePackageName = getParameterValue(node.parameters, "packageDefinition");
        view.serviceTags = tags;
        view.serviceDescription = serviceValues["description"];

        //traverse services children (can be resources or endpoints)
        node.children.forEach(function (child) {
            traverseTree(child, model, view);
        });

    } else if (node.type === "Resource") {
        var parameters = [
            {
                key: "title",
                value: "Resource"
            },
            {
                key: "path",
                value: getParameterValue(node.parameters, "path")
            },
            {
                key: "get",
                value: getParameterValue(node.parameters, "get")
            },
            {
                key: "put",
                value: getParameterValue(node.parameters, "put")
            },
            {
                key: "post",
                value: getParameterValue(node.parameters, "post")
            }
        ];

        var resourceLifeline = MainElements.lifelines.ResourceLifeline.utils.createMyModel(model, parameters);
        var processor = MainElements.lifelines.ResourceLifeline.utils.createMyStartProcessorModel(resourceLifeline);
        var currentSource = view.model.diagramSourceElements().models[0];
        addInitArrow(currentSource, processor, view);

        //traverse resources children (can be a logger, header processor, if-else, try-catch, endpoint..etc)
        node.children.forEach(function (child) {
            traverseTree(child, model.get('diagramResourceElements').models[0], view);
        });

    } else if (node.type === "Endpoint") {
        var centerPoint = createPoint(0, 50);
        var title = getParameterValue(node.parameters, "title");

        var parameters = [
            {
                key: "title",
                value: title
            },
            {
                key: "url",
                value: getParameterValue(node.parameters, "url")
            }
        ];

        MainElements.lifelines.EndPointLifeline.utils.createMyModel(model, title, centerPoint, parameters);

    } else if (node.type == "InvokeMediator") {
        var invokeModel = Processors.manipulators.InvokeMediator.utils.createMyModel(model);

        var startPoint = new GeoCore.Models.Point({x: 0, y: 0}),
            endpoint = new GeoCore.Models.Point({x: 0, y: 0});

        var sourcePoint = new SequenceD.Models.MessagePoint({
            model: {type: "messagePoint"},
            x: startPoint.x(),
            y: startPoint.y(),
            direction: "outbound"
        });
        var destinationPoint = new SequenceD.Models.MessagePoint({
            model: {type: "messagePoint"},
            x: endpoint.x(),
            y: endpoint.y(),
            direction: "inbound"
        });
        var messageLink = new SequenceD.Models.MessageLink({
            source: sourcePoint,
            destination: destinationPoint,
            type: 2
        });

        var destinationModel = getEndpoint(getParameterValue(node.parameters, "endpointRef"), view.model);

        if (destinationModel) {
            var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
            var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
            invokeModel.outputConnector(sourcePoint);
            destinationModel.addChild(destinationPoint, messageOptionsInbound);
        }

    } else if (node.type === "ResponseMsg") {
        Processors.manipulators.replyProcessor.utils.createMyModel(model, view);

    } else if (node.type === "LogMediator") {
        var parameters = [
            {
                key: "messageRef",
                value: Processors.manipulators.LogMediator.parameters[0].value
            },
            {
                key: "message",
                value: Processors.manipulators.LogMediator.parameters[1].value
            },
            {
                key: "logLevel",
                value: getParameterValue(node.parameters, "level")
            },
            {
                key: "logCategory",
                value: Processors.manipulators.LogMediator.parameters[3].value
            },
            {
                key: "description",
                value: getParameterValue(node.parameters, "status")
            }
        ];

        Processors.manipulators.LogMediator.utils.createMyModel(model, parameters);

    } else if (node.type === "HeaderProcessor") {
        var parameters = [
            {
                key: "reference",
                value: getParameterValue(node.parameters, "messageRef")
            },
            {
                key: "name",
                value: getParameterValue(node.parameters, "headerName")
            },
            {
                key: "value",
                value: getParameterValue(node.parameters, "headerValue")
            }
        ];
        Processors.manipulators.HeaderProcessor.utils.createMyModel(model, parameters);

    } else if (node.type === "TryCatchMediator") {
        var parameters = [];
        var tryCatchMediator = Processors.flowControllers.TryBlockMediator.utils.createMyModel(model, parameters);

        node.children.forEach(function (child) {
            traverseTree(child, tryCatchMediator, view);
        });

    } else if (node.type === "TryBlock") {
        var tryBlock = Processors.flowControllers.TryBlockMediator.utils.createMyContainableProcessorElement(model,
                                                                                                             "Try");
        //traverse try block's inner elements
        node.children.forEach(function (child) {
            traverseTree(child, tryBlock, view);
        });

    } else if (node.type === "CatchBlock") {
        var catchBlock = Processors.flowControllers.TryBlockMediator.utils.createMyContainableProcessorElement(model,
                                                                                                               "Catch");
        var parameters = [
            {
                key: "exception",
                value: getParameterValue(node.parameters, "exception")
            },
            {
                key: "description",
                value: "Description"
            }
        ];
        model.attributes.parameters = parameters;

        //traverse catch block's inner elements
        node.children.forEach(function (child) {
            traverseTree(child, catchBlock, view);
        });

    } else if (node.type === "IfElseMediator") {
        var parameters = [];
        var ifElseMediator = Processors.flowControllers.IfElseMediator.utils.createMyModel(model, parameters);

        node.children.forEach(function (child) {
            traverseTree(child, ifElseMediator, view);
        });

    } else if (node.type === "IfBlock") {
        var ifBlock = Processors.flowControllers.IfElseMediator.utils.createMyContainableProcessorElement(model, "If");
        var parameters = [
            {
                key: "condition",
                value: getParameterValue(node.parameters, "condition")
            },
            {
                key: "description",
                value: "Description"
            }
        ];
        model.attributes.parameters = parameters;

        //traverse if block's inner elements
        node.children.forEach(function (child) {
            traverseTree(child, ifBlock, view);
        });

    } else if (node.type === "ElseBlock") {
        var elseBlock = Processors.flowControllers.IfElseMediator.utils.createMyContainableProcessorElement(model,
                                                                                                            "Else");
        //traverse else block's inner elements
        node.children.forEach(function (child) {
            traverseTree(child, elseBlock, view);
        });

    }
};

var getEndpoint = function (endpointRef, viewModel) {
    var endpointModels = viewModel.attributes.diagramEndpointElements.models;
    var endpointReference = null;
    endpointModels.forEach(function (endpoint) {
        if ((endpoint.attributes.title.toLowerCase() === endpointRef.toLowerCase() && endpointReference === null)) {
            endpointReference = endpoint;
        }
    });
    return endpointReference;
};

var setCurrentDiagramView = function () {
    defaultView.model = new Diagrams.Models.Diagram({});
    return defaultView;
};


var addNewEmptyTab = function () {
    var id = Math.random().toString(36).substr(2, 9);
    var hrefId = '#seq_' + id;
    var resourceId = 'seq_' + id;
    var resourceModel = new Diagrams.Models.Tab({
        resourceId: resourceId,
        hrefId: hrefId,
        resourceTitle: "Resource",
        createdTab: false
    });

    if (diagram.selectedOptionsGroup) {
        diagram.selectedOptionsGroup.classed("option-menu-hide", true);
        diagram.selectedOptionsGroup.classed("option-menu-show", false);
    }
    diagram.selectedOptionsGroup = null;
    if (diagram.propertyWindow) {
        diagram.propertyWindow = false;
        defaultView.enableDragZoomOptions();
        $('#property-pane-svg').empty();
    }

    var nextTabListView = new Diagrams.Views.TabListView({model: resourceModel});
    tabListView = nextTabListView;
    nextTabListView.render(resourceModel);
    //create new diagram object for the tab
    var diagramObj = new Diagrams.Models.Diagram({});
    resourceModel.addDiagramForTab(diagramObj);

    //Activating tab on creation itself
    $('.tabList a[href="#' + resourceId + '"]').tab('show');
    var dgModel = resourceModel.getDiagramOfTab(resourceModel.attributes.diagramForTab.models[0].cid);
    dgModel.CurrentDiagram(dgModel);
    var svgUId = resourceId + "4";
    var options = {selector: hrefId, wrapperId: svgUId};

    // get the current diagram view for the tab
    var currentView = dgModel.createDiagramView(dgModel, options);
    // add diagramModel
    var preview = new Diagrams.Views.DiagramOutlineView({mainView: currentView});
    preview.render();
    resourceModel.preview(preview);

    // set current tab's diagram view as default view
    currentView.currentDiagramView(currentView);
    resourceModel.setDiagramViewForTab(currentView);
    // mark tab as visited
    resourceModel.setSelectedTab();
    return currentView;
};

var getParameterValue = function (parameters, key) {
    var value = "";
    if (parameters) {
        parameters.forEach(function (parameter) {
            if (parameter.key === key) {
                value = parameter.value;
            }
        });
    }
    return value;
};

var addInitArrow = function (source, destination, diagramView) {
    centerS = createPoint(200, 50);
    centerR = createPoint(380, 50);
    var sourcePoint = new SequenceD.Models.MessagePoint({
        model: {type: "messagePoint"},
        x: centerS.x(),
        y: centerS.y(),
        direction: "outbound"
    });
    var destinationPoint = new SequenceD.Models.MessagePoint({
        model: {type: "messagePoint"},
        x: centerR.x(),
        y: centerR.y(),
        direction: "inbound"
    });
    var messageLink = new SequenceD.Models.MessageLink({
        source: sourcePoint,
        destination: destinationPoint,
        priority: destinationPoint,
        type: Diagrams.Utils.messageLinkType.OutOnly
    });
    var messageOptionsInbound = {'class': 'messagePoint', 'direction': 'inbound'};
    var messageOptionsOutbound = {'class': 'messagePoint', 'direction': 'outbound'};
    source.addChild(sourcePoint, messageOptionsOutbound);
    destination.inputConnector(destinationPoint);
};
