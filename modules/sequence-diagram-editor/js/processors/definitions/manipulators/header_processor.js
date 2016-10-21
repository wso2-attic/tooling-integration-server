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
    var manipulators = processors.manipulators || {};

    // Header Processor Definition
    var headerProcessor = {
        id: "HeaderProcessor",
        title: "Header",
        icon: "images/tool-icons/header.svg",
        colour : "#2980b9",
        type : "UnitProcessor",
        dragCursorOffset : { left: 24, top: -5 },
        createCloneCallback : function(view){
            function cloneCallBack() {
                var div = view.createContainerForDraggable();
                d3.xml("images/tool-icons/header_drag.svg").mimeType("image/svg+xml").get(function(error, xml) {
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
                key: "reference",
                value: "Message Reference"
            },
            {
                key: "name",
                value: "Header Name"
            },
            {
                key: "value",
                value: "Header Value"
            }
        ],
        getSchema: function () {
            return {
                title: "Header Processor",
                type: "object",
                properties: {
                    Reference: {"type": "string"},
                    Name: {"type": "string"},
                    Value: {"type": "string"}
                }
            };
        },
        getEditableProperties: function (parameters) {
            var editableProperties = {};
            editableProperties.Reference = parameters[0];
            editableProperties.Name = parameters[1];
            editableProperties.Value = parameters[2];
            return editableProperties;
        },
        getMySubTree: function (model) {
            var parameters = model.get('parameters').parameters;
            var headerConfigStart = "setHeader(messageRef = " + parameters[0].value + ", headerName = \"" +
                parameters[1].value + "\", headerValue = " + parameters[2].value;
            return new TreeNode("HeaderProcessor", "HeaderProcessor", headerConfigStart, ");");
        }
    };

    // Add defined mediators to manipulators
    // Mediator id should be exactly match to name defining here.(Eg : "LogMediator")
    manipulators.HeaderProcessor = headerProcessor;

    processors.manipulators = manipulators;

    return processors;

}(Processors || {}));
