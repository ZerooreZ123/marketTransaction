module.exports = function KDJ({data, close, low, high, N=9, M1=3, M2=3, common}) {
  let vdata = common.getData();
  const keys = ['K', 'D', 'J'];
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].RSV = (item[close] - common.getLLV({key: low, day: N, index})) / (common.getHHV({key: high, day: N, index}) - common.getLLV({key: low, day: N, index})) * 100;
      vdata[index].K = item.K = common.getSMA({key: 'RSV', day: M1, weight: 1, index});
      vdata[index].D = item.D = common.getSMA({key: 'K', day: M2, weight: 1, index});
      vdata[index].J = item.J = 3 * item.K - 2 * item.D;
    }
  })
}

