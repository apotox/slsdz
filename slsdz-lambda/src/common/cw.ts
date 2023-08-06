import CloudWatchLogs from "aws-sdk/clients/cloudwatchlogs";

let _client: CloudWatchLogs = null;

export function getCwClient() {
    if (!_client) {
        _client = new CloudWatchLogs();
    }

    return _client;
}
