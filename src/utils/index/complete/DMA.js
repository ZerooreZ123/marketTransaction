module.exports = function DMA({data, close, low, high, common, N1=10, N2=50, M=10}) {
  let vdata = common.getData();
  const keys = ['DMA_DIF', 'DMA_DIFMA'];
  data.map((item, index) => {
    if(vdata[index][keys[0]] !== undefined){
      keys.forEach(key => item[key] = vdata[index][key]);
    }else{
      vdata[index].DMA_DIF = item.DMA_DIF = common.getMA({key: close, index, day: N1}) - common.getMA({key: close, index, day: N2});
      vdata[index].DMA_DIFMA = item.DMA_DIFMA = common.getMA({key: 'DMA_DIF', index, day: M});
    }
  })
  return {keys};
}

