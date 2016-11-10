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

var Diagrams = (function (diagrams) {
    var utils = diagrams.Utils || {};

    /**
     * Create the view for a particular model.
     *
     * @param {Object} model instance
     * @param {Object} [options] options for the view constructor
     * @returns {Object} view object created for the model
     */
    var createViewForModel = function (model, options) {
        return new model.nameSpace.Views[model.modelName + "View"]({model: model, options: options});
    };

    var messageLinkType = {
        OutOnly : 1,
        InOut : 2
    };

    utils.createViewForModel = createViewForModel;
    utils.messageLinkType = messageLinkType;
    diagrams.Utils = utils;
    return diagrams;

}(Diagrams || {}));