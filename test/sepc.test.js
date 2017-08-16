/**
 * Created by Administrator on 2017/8/13 0013.
 */
var assert = require('assert');
var wb = require('../dist/index')
describe('waterBall Object', function() {
    describe('#new WaterBall()', function() {
        it('should return undefined when the Object is not defined', function(done) {
            var wb = new WaterBall('container',{});
            if (wb) {
                done();
            } else done('error')
        });
    });
});
