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

var MainElements = (function (mainElements) {
    var lifelines = mainElements.lifelines || {};

    var resourceLifeline = {
        id: "Resource",
        title: "Pipe Line",
        icon: "images/tool-icons/lifeline.svg",
        colour : "#998844",
        class : "resource",
        dragCursorOffset : { left: 50, top: 50 },
        createCloneCallback : function(view){
            function cloneCallBack() {
                var div = view.createContainerForDraggable();
                d3.xml("images/tool-icons/lifeline.svg").mimeType("image/svg+xml").get(function(error, xml) {
                    if (error) throw error;
                    var svg = xml.getElementsByTagName("svg")[0];
                    d3.select(svg).attr("width", "100px").attr("height", "100px");
                    d3.select(svg).attr("width", "100px");
                    div.node().appendChild(svg);
                });
                return div.node();
            }
            return cloneCallBack;
        },
        propertyPaneSchema: [
            {
                key: "title",
                text: "Title"
            },
            {
                key: "path",
                text: "Path"
            },
            {
                key: "get",
                checkbox: "GET"
            },
            {
                key: "put",
                checkbox: "PUT"
            },
            {
                key: "post",
                checkbox: "POST"
            }
        ],
        parameters: [
            {
                key: "path",
                value: ""
            },
            {
                key: "get",
                value: false
            },
            {
                key: "put",
                value: false
            },
            {
                key: "post",
                value: false
            }
        ],
        saveMyProperties: function (model, inputs) {
            model.attributes.title = inputs.title.value;
            model.attributes.parameters = [
                {
                    key: "path",
                    value: inputs.path.value
                },
                {
                    key: "get",
                    value: inputs.get.checked
                },
                {
                    key: "put",
                    value: inputs.put.checked
                },
                {
                    key: "post",
                    value: inputs.post.checked
                }
            ];
        }
    };

    lifelines.ResourceLifeline = resourceLifeline;
    mainElements.lifelines = lifelines;

    return mainElements;
})(MainElements || {});