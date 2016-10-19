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

    //End point definition
    var endPointLifeline = {
        id: "EndPoint",
        title: "End Point",
        icon: "images/tool-icons/lifeline.svg",
        colour : "purple",
        class : "endpoint",
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
        getSchema: function () {
            return {
                "title": 'End Point',
                type: "object",
                properties: {
                    Title: { "type": "string" }
                }
            };
        },
        getEditableProperties: function (title) {
            var editableProperties = {};
            editableProperties.Title = title;
            return editableProperties;
        }
    };

    lifelines.EndPointLifeline = endPointLifeline;
    mainElements.lifelines = lifelines;

    return mainElements;
})(MainElements || {});