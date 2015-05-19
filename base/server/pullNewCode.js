// check to make sure this isn't run twice
var startedPull = false;

Meteor.methods({
    pullNewCode: function(key) {
        if (key != process.env.DOMINUS_KEY) {
            return;
        }

        if (startedPull) {
            console.error('pull code started more than once');
            return;
        }

        console.log('--- started pull');
        startedPull = true;
        new pullNewCode();
    }
});


pullNewCode = function() {
    var self = this;
    self.tries = 0;
    self.maxTries = 120;    // 60 minutes

    if (process.env.DOMINUS_WORKER == 'true') {

        // wait for queue to empty
        Meteor.call('cueStop');
        if (CueTasks.find().count() === 0) {
            self.runScript();
        } else {
            self.waitForQueueToEmpty();
        }

    } else {
        self.runScript();
    }
};

pullNewCode.prototype.waitForQueueToEmpty = function() {
    var self = this;

    if (self.tries > self.maxTries) {
        startedPull = false;
        console.error('could not pull new code because queue is not empty');
        return;
    }

    if (CueTasks.find().count() === 0) {
        self.runScript();
    } else {
        Meteor.setTimeout(function() {
            self.waitForQueueToEmpty();
        }, 1000*30);
    }

    self.tries++;
};

pullNewCode.prototype.runScript = function() {
    var branchId = process.env.BRANCH_ID;

    var exec = Npm.require('child_process').exec;

    var cmd = '/bin/bash /pullNewCode.sh '+branchId;

    var child = exec(cmd, function(error, stdout, stderr) {
        console.log('stdout: '+stdout);
        console.log('stderr: '+stderr);

        if (error !== null) {
            console.log('exec error: '+error);
        }

    });
};
