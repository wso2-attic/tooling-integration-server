/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var Processors = (function (processors) {

    var flowControllers = processors.flowControllers || {};

    //Define manipulator mediators
    var ifElseMediator = {
        id: "IfElseMediator",
        title: "If Else",
        icon: "images/tool-icons/dgm-if-else.svg",
        colour : "#ffffff",
        type : "ComplexProcessor",
        containableElements: [{container:"ifContainer",children:[{title:"If"}]},{container:"elseContainer",children:[{title:"Else"}]}],
        dragCursorOffset : { left: 24, top: -5 },
        createCloneCallback : function(view){
            function cloneCallBack() {
                var div = view.createContainerForDraggable();
                d3.xml("images/tool-icons/dgm-if-else.svg").mimeType("image/svg+xml").get(function(error, xml) {
                    if (error) throw error;
                    var svg = xml.getElementsByTagName("svg")[0];
                    d3.select(svg).attr("width", "48px").attr("height", "108px");
                    div.node().appendChild(svg);
                });
                return div.node();
            }
            return cloneCallBack;
        },
        parameters: [
            {
                key: "condition",
                value: ""
            },
            {
                key: "description",
                value: "Description"
            }
        ],
        propertyPaneSchema: [
            {
                key: "condition",
                text: "Condition"
            },
            {
                key: "description",
                text: "Description"
            }
        ],
        utils: {
            getMyPropertyPaneSchema : function () {
                return Processors.flowControllers.IfElseMediator.propertyPaneSchema;
            },
            getMyParameters: function (model) {
                return model.attributes.parameters;
            },
            saveMyProperties: function (model, inputs) {
                model.attributes.parameters = [
                    {
                        key: "condition",
                        value: inputs.condition.value
                    },
                    {
                        key: "description",
                        value: inputs.description.value
                    }
                ];
            },
            getMySubTree: function (model) {
                // Generate Subtree for the if block
                var tryBlock = model.get('containableProcessorElements').models[0];
                var parameters = model.attributes.parameters;
                var ifConfigStart = "if ( " + parameters[0].value + ") {";
                var ifBlockNode = new TreeNode("IfBlock", "IfBlock", ifConfigStart, "}");
                for (var itr = 0; itr < tryBlock.get('children').models.length; itr++) {
                    var child = tryBlock.get('children').models[itr];
                    if (child instanceof SequenceD.Models.MessagePoint && child.get('direction') == 'outbound') {
                        var endpoint = child.get('message').get('destination').get('parent').attributes.parameters[0].value;
                        var uri = child.get('message').get('destination').get('parent').attributes.parameters[1].value;
                        // When we define the properties, need to extract the endpoint from the property
                        definedConstants["HTTPEP"] = {name: endpoint, value: uri};
                        var l = new TreeNode("InvokeMediator", "InvokeMediator", ("response = invoke(endpointKey=" +
                        endpoint + ", messageKey=m)"), ";");
                        ifBlockNode.getChildren().push(l);
                    } else {
                        ifBlockNode.getChildren().push(child.get('utils').getMySubTree(child));
                    }
                }

                // Generate the Subtree for the else block
                var elseBlock = model.get('containableProcessorElements').models[1];
                var elseBlockNode = new TreeNode("ElseBlock", "ElseBlock", "else{", "}");
                for (var itr = 0; itr < elseBlock.get('children').models.length; itr++) {
                    var child = elseBlock.get('children').models[itr];
                    if (child instanceof SequenceD.Models.MessagePoint && child.get('direction') == 'outbound') {
                        var endpoint = child.get('message').get('destination').get('parent').attributes.parameters[0].value;
                        var uri = child.get('message').get('destination').get('parent').attributes.parameters[1].value;
                        // When we define the properties, need to extract the endpoint from the property
                        definedConstants["HTTPEP"] = {name: endpoint, value: uri};
                        var l = new TreeNode("InvokeMediator", "InvokeMediator", ("response = invoke(endpointKey=" +
                        endpoint + ", messageKey=m)"), ";");
                        elseBlockNode.getChildren().push(l);
                    } else {
                        elseBlockNode.getChildren().push(child.get('utils').getMySubTree(child));
                    }
                }
                var ifElseNode = new TreeNode("IfElseMediator", "IfElseMediator", "", "");
                ifElseNode.getChildren().push(ifBlockNode);
                ifElseNode.getChildren().push(elseBlockNode);

                return ifElseNode;

            },
            canConnectTo: function () {
                return ['Worker'];
            },
            createMyModel: function (model, parameters) {
                var position = new GeoCore.Models.Point({
                    x: 0,
                    y: 0
                });
                var processor = model.createProcessor(
                    Processors.flowControllers.IfElseMediator.title,
                    position,
                    Processors.flowControllers.IfElseMediator.id,
                    {type: Processors.flowControllers.IfElseMediator.type, initMethod: Processors.flowControllers.IfElseMediator.init},
                    {colour: Processors.flowControllers.IfElseMediator.colour},
                    parameters,
                    Processors.flowControllers.IfElseMediator.utils
                );
                model.addChild(processor);
                return processor;
            },
            createMyContainableProcessorElement: function (processor, title) {
                // var containableElementsArr = Processors.flowControllers.TryBlockMediator.containableElements;
                // for (var y = 0; y < containableElementsArr.length; y++) {
                //     var children = containableElementsArr[y].children;

                //for (var z = 0; z < children.length; z ++) {
                var containableProcessorElem = new SequenceD.Models.ContainableProcessorElement(lifeLineOptions);
                containableProcessorElem.type = 'ContainableProcessorElement';
                containableProcessorElem.set('title', title);
                containableProcessorElem.set('utils', Processors.flowControllers.IfElseMediator.utils);
                containableProcessorElem.parent(processor);
                processor.containableProcessorElements().add(containableProcessorElem);
                return containableProcessorElem;
                // }
                //  }
            }
        }
    };

    // Add defined mediators to manipulators
    // Mediator id should be exactly match to name defining here.(Eg : "LogMediator")
    flowControllers.IfElseMediator = ifElseMediator;

    processors.flowControllers = flowControllers;

    return processors;

}(Processors || {}));
