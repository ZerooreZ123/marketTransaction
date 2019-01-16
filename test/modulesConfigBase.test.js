import ConfigBase from '../src/components/modules/ConfigBase';
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

describe('columns函数功能测试', () => {
  it("['order', '净资']", (done) => {
    let tmp = ConfigBase.getColumns(['order', '净资']);
    expect(tmp).to.have.lengthOf(2);
    done();
  })

  it("[{main: 'order', dataIndex: 'newName'}]", (done) => {
    let tmp = ConfigBase.getColumns([{main: 'order', dataIndex: 'newName'}]);
    expect(tmp[0].dataIndex).to.equal('newName');
    done();
  })

  it("['净资', {main: 'order', isSorter: true}, {main: 'netcapital', width: 100}]", done => {
    let tmp = ConfigBase.getColumns(['净资', {main: 'order', isSorter: true}, {main: 'netcapital', width: 100}]);
    expect(tmp).to.have.lengthOf(3);
    expect(tmp[1]).to.have.property('sorter');
    done();
  })

  it('[]', (done) => {
    let tmp = ConfigBase.getColumns([]);
    expect(tmp[0]).to.equal(false);
    done();
  })

  it('{}', (done) => {
    let tmp = ConfigBase.getColumns({});
    expect(tmp[0]).to.equal(false);
    done();
  })

  it("[{main: '净资', world: 'hello'}]", (done) => {
    let tmp = ConfigBase.getColumns([{main: '净资', world: 'hello'}]);
    expect(tmp[0]).to.have.property('world');
    expect(tmp[0].world).to.equal('hello');
    done();
  })
})
