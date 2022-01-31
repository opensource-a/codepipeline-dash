let PipelineService = function (jquery) {

    let getPipelines = function (responseHandler) {
            jquery.ajax({
                dataType: "json",
                url: "/pipelines",
                success: function (response) {
                    const listOfPipelineNames = [];
                    for (let i = 0; i < response.length; i++) {
                        listOfPipelineNames.push(response[i].name);
                    }
                    responseHandler(listOfPipelineNames);
                }
            });
        },
        getPipelineDetailFromAWS = function (pipelineName, responseHandler) {
            jquery.ajax({
                dataType: "json",
                url: "/pipeline/" + pipelineName,
                success: function (response) {
                    responseHandler(response);
                }
            });
        },
        parsePipelineState = function (stageState, commitMessage) {
            return {
                name: stageState.stageName,
                latestStatus: stageState.actionStates[0].latestExecution.status.toLowerCase(),
                lastStatusChange: stageState.actionStates[0].latestExecution.lastStatusChange,
                externalExecutionUrl: stageState.actionStates[0].latestExecution.externalExecutionUrl,
                commitMessage: commitMessage
            };
        },
        getPipelineDetails = function (pipelineName, responseHandler) {
            let stages = [];
            getPipelineDetailFromAWS(pipelineName,
                function (response) {
                    for (let i = 0; i < response.stageStates.length; i++) {
                        stages.push(parsePipelineState(response.stageStates[i], response.commitMessage));
                    }
                    responseHandler(stages);
                });
        };

    return {
        getPipelines: getPipelines,
        getPipelineDetails: getPipelineDetails,
    };
};

